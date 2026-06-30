import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawn } from 'child_process';
import crypto from 'crypto';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');
const __dirname = path.resolve();
const TEMP_DIR = path.join(os.tmpdir(), 'orima-streams');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

app.use(cors());

interface Track {
  id: string;
  title: string;
  artist: string;
  artistImg: string;
  album: string;
  albumId: number;
  duration: string;
  durSec: number;
  thumb: string;
  preview: string;
  views: number;
  viewsText: string;
  link: string;
  isOfficial: boolean;
}

function fmtDur(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function fmtPopularity(p: number): string {
  if (p >= 1e9) return `${(p / 1e9).toFixed(1)}B`;
  if (p >= 1e6) return `${(p / 1e6).toFixed(1)}M`;
  if (p >= 1e3) return `${(p / 1e3).toFixed(1)}K`;
  return String(p);
}

const searchCache = new Map<string, { data: Track[]; t: number }>();

async function deezerSearch(query: string, limit = 25): Promise<Track[]> {
  const key = query.toLowerCase().trim();
  const c = searchCache.get(key);
  if (c && Date.now() - c.t < 300000) return c.data;

  try {
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await res.json();
    if (!data.data) return [];

    const results: Track[] = data.data.map((t: any) => ({
      id: String(t.id),
      title: t.title || 'Unknown',
      artist: t.artist?.name || 'Unknown',
      artistImg: t.artist?.picture_big || t.artist?.picture_medium || '',
      album: t.album?.title || '',
      albumId: t.album?.id || 0,
      duration: fmtDur(t.duration || 0),
      durSec: t.duration || 0,
      thumb: t.album?.cover_big || t.album?.cover_medium || '',
      preview: t.preview || '',
      views: t.rank || 0,
      viewsText: fmtPopularity(t.rank || 0),
      link: t.link || '',
      isOfficial: false,
    }));

    searchCache.set(key, { data: results, t: Date.now() });
    return results;
  } catch (err) {
    console.error('[search]', err);
    return [];
  }
}

app.get('/api/search', async (req: Request, res: Response) => {
  const q = (req.query.q as string || '').trim();
  if (!q) { res.status(400).json({ error: 'Query kosong' }); return; }
  const results = await deezerSearch(q);
  res.json({ results, q, source: 'deezer' });
});

app.get('/api/album/:id', async (req: Request, res: Response) => {
  const albumId = parseInt(String(req.params.id));
  if (!albumId) { res.status(400).json({ error: 'Invalid album ID' }); return; }

  try {
    const albumRes = await fetch(`https://api.deezer.com/album/${albumId}`);
    const albumData = await albumRes.json();
    if (!albumData.tracks?.data) { res.status(404).json({ error: 'Album tidak ditemukan' }); return; }

    const albumImg = albumData.cover_big || albumData.cover_medium || '';
    const albumTitle = albumData.title || '';
    const artistName = albumData.artist?.name || '';

    const tracks: Track[] = albumData.tracks.data.map((t: any) => ({
      id: String(t.id),
      title: t.title || 'Unknown',
      artist: t.artist?.name || artistName,
      artistImg: albumData.artist?.picture_big || albumData.artist?.picture_medium || '',
      album: albumTitle,
      albumId: albumId,
      duration: fmtDur(t.duration || 0),
      durSec: t.duration || 0,
      thumb: albumImg,
      preview: t.preview || '',
      views: 0,
      viewsText: '',
      link: t.link || '',
      isOfficial: false,
    }));

    console.log('[album]', albumTitle, '-', tracks.length, 'tracks');
    res.json({ tracks, album: albumTitle, artist: artistName, img: albumImg, total: tracks.length });
  } catch (err) {
    console.error('[album]', err);
    res.status(500).json({ error: 'Gagal mengambil album' });
  }
});

interface LrcLine { time: number; text: string; }

app.get('/api/lyrics', async (req: Request, res: Response) => {
  const track = (req.query.track as string || '').trim();
  const artist = (req.query.artist as string || '').trim();
  if (!track) { res.status(400).json({ error: 'Track kosong' }); return; }

  console.log('[lyrics]', artist, '-', track);

  // Try LRCLib first
  try {
    const signal = AbortSignal.timeout(8000);
    const params = new URLSearchParams({ track_name: track });
    if (artist) params.set('artist_name', artist);

    const r = await fetch(`https://lrclib.net/api/get?${params}`, { signal });
    if (r.ok) {
      const data = await r.json();
      const lines: LrcLine[] = parseLrc(data.syncedLyrics || data.plainLyrics || '');
      if (lines.length > 0) {
        res.json({ lyrics: lines, source: 'lrclib' });
        return;
      }
    }
  } catch {}

  // Try LRCLib search
  try {
    const signal = AbortSignal.timeout(8000);
    const searchParams = new URLSearchParams({ q: `${artist} ${track}` });
    const sr = await fetch(`https://lrclib.net/api/search?${searchParams}`, { signal });
    if (sr.ok) {
      const sData = await sr.json();
      if (Array.isArray(sData) && sData.length > 0) {
        const best = sData.find((l: any) => l.syncedLyrics) || sData[0];
        const lines: LrcLine[] = parseLrc(best.syncedLyrics || best.plainLyrics || '');
        if (lines.length > 0) {
          res.json({ lyrics: lines, source: 'lrclib-search' });
          return;
        }
      }
    }
  } catch {}

  // Fallback: try with simplified track name
  try {
    const signal = AbortSignal.timeout(8000);
    const cleanTrack = track.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    if (cleanTrack !== track) {
      const params = new URLSearchParams({ track_name: cleanTrack });
      if (artist) params.set('artist_name', artist);
      const r = await fetch(`https://lrclib.net/api/get?${params}`, { signal });
      if (r.ok) {
        const data = await r.json();
        const lines: LrcLine[] = parseLrc(data.syncedLyrics || data.plainLyrics || '');
        if (lines.length > 0) {
          res.json({ lyrics: lines, source: 'lrclib-clean' });
          return;
        }
      }
    }
  } catch {}

  // No lyrics found
  res.json({ lyrics: [], source: 'none' });
});

function parseLrc(raw: string): LrcLine[] {
  if (!raw) return [];
  const lines: LrcLine[] = [];
  for (const line of raw.split('\n')) {
    const m = line.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (m) {
      const time = parseInt(m[1]) * 60 + parseFloat(m[2]);
      const text = m[3].trim();
      if (text) lines.push({ time, text });
    } else {
      const t = line.trim();
      if (t && !t.startsWith('[')) {
        lines.push({ time: 0, text: t });
      }
    }
  }
  return lines;
}

const streamProcesses = new Map<string, import('child_process').ChildProcess>();

function getContentType(filePath: string): string {
  if (filePath.endsWith('.webm')) return 'audio/webm';
  if (filePath.endsWith('.m4a')) return 'audio/mp4';
  if (filePath.endsWith('.opus')) return 'audio/opus';
  if (filePath.endsWith('.mp3')) return 'audio/mpeg';
  return 'audio/webm';
}

app.get('/api/stream', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim();
  if (!query) { res.status(400).json({ error: 'Query kosong' }); return; }

  const hash = crypto.createHash('md5').update(query).digest('hex');
  const outPath = path.join(TEMP_DIR, `${hash}.webm`);

  const serveFile = () => {
    const stat = fs.statSync(outPath);
    const fileSize = stat.size;
    const contentType = getContentType(outPath);

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunkSize,
      });
      fs.createReadStream(outPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Length': fileSize });
      fs.createReadStream(outPath).pipe(res);
    }
  };

  if (fs.existsSync(outPath)) {
    console.log('[stream] cache hit:', query);
    serveFile();
    return;
  }

  console.log('[stream]', query);

  const ytdlp = spawn('yt-dlp', [
    '--no-warnings', '--ignore-errors', '--no-playlist',
    '--socket-timeout', '10',
    '--retries', '3',
    '--concurrent-fragments', '4',
    '-f', 'bestaudio',
    '--match-filter', 'is_live!=true',
    '-o', '-',
    `ytsearch1:${query} official audio`,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  streamProcesses.set(hash, ytdlp);

  let headersSent = false;
  let done = false;
  const fileStream = fs.createWriteStream(outPath);

  const cleanup = () => {
    if (!fileStream.destroyed) fileStream.end();
    streamProcesses.delete(hash);
  };

  ytdlp.stdout.on('data', (chunk: Buffer) => {
    if (done) return;
    if (!headersSent) {
      headersSent = true;
      res.setHeader('Content-Type', 'audio/webm');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200);
      res.flushHeaders();
    }
    res.write(chunk);
    fileStream.write(chunk);
  });

  ytdlp.stdout.on('end', () => {
    fileStream.end();
    if (!done) {
      done = true;
      console.log('[stream] done');
      if (headersSent && !res.writableEnded) res.end();
    }
    cleanup();
  });

  ytdlp.on('close', (code) => {
    console.log('[stream] exit', code);
    if (!done) {
      done = true;
      if (!headersSent) res.status(500).json({ error: 'Tidak ada data audio' });
      else if (!res.writableEnded) res.end();
    }
    cleanup();
  });

  ytdlp.stderr.on('data', (d: Buffer) => {
    const m = d.toString();
    if (m.includes('ERROR')) console.error('[yt-dlp]', m.trim());
  });

  ytdlp.on('error', (err) => {
    console.error('[stream err]', err.message);
    if (!done) {
      done = true;
      if (!headersSent) res.status(500).json({ error: 'Gagal stream' });
      else res.end();
    }
    cleanup();
  });

  req.on('close', () => {
    if (!ytdlp.killed) {
      ytdlp.kill('SIGTERM');
      console.log('[stream] client disconnected');
    }
    cleanup();
  });
});

app.get('/api/trending', async (_req: Request, res: Response) => {
  const r = await deezerSearch('top hits indonesia 2025');
  res.json({ results: r, source: 'deezer' });
});

app.get('/api/chill', async (_req: Request, res: Response) => {
  const r = await deezerSearch('lofi hip hop chill');
  res.json({ results: r, source: 'deezer' });
});

app.get('/api/jpop', async (_req: Request, res: Response) => {
  const r = await deezerSearch('anime opening jpop');
  res.json({ results: r, source: 'deezer' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[1;32m  ♪ Orima running at http://localhost:${PORT}  \x1b[0m`);
});
