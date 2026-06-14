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

const audio = document.getElementById('audioEl') as HTMLAudioElement;
const landing = document.getElementById('landing') as HTMLDivElement;
const resultsPage = document.getElementById('resultsPage') as HTMLDivElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
const searchInput2 = document.getElementById('searchInput2') as HTMLInputElement;
const searchBtn2 = document.getElementById('searchBtn2') as HTMLButtonElement;
const goHome = document.getElementById('goHome') as HTMLDivElement;
const rBody = document.getElementById('rBody') as HTMLDivElement;
const rGrid = document.getElementById('rGrid') as HTMLDivElement;
const rTitle = document.getElementById('rTitle') as HTMLDivElement;
const rTabs = document.getElementById('rTabs') as HTMLDivElement;
const rNav = document.getElementById('rNav') as HTMLDivElement;
const rBack = document.getElementById('rBack') as HTMLButtonElement;
const rBackText = document.getElementById('rBackText') as HTMLSpanElement;
const loading = document.getElementById('loading') as HTMLDivElement;
const player = document.getElementById('player') as HTMLDivElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
const pBar = document.getElementById('pBar') as HTMLDivElement;
const pBarFill = document.getElementById('pBarFill') as HTMLDivElement;
const curTime = document.getElementById('curTime') as HTMLSpanElement;
const durTime = document.getElementById('durTime') as HTMLSpanElement;
const pTitle = document.getElementById('pTitle') as HTMLDivElement;
const pArtist = document.getElementById('pArtist') as HTMLDivElement;
const pThumb = document.getElementById('pThumb') as HTMLDivElement;
const volBtn = document.getElementById('volBtn') as HTMLButtonElement;
const pVol = document.getElementById('pVol') as HTMLDivElement;
const pVolFill = document.getElementById('pVolFill') as HTMLDivElement;
const playerBuffer = document.getElementById('playerBuffer') as HTMLDivElement;
const icoPlay = playBtn.querySelector('.ico-play') as SVGSVGElement;
const icoPause = playBtn.querySelector('.ico-pause') as SVGSVGElement;
const lyricsBtn = document.getElementById('lyricsBtn') as HTMLButtonElement;
const lyricsModal = document.getElementById('lyricsModal') as HTMLDivElement;
const lyricsBackdrop = document.getElementById('lyricsBackdrop') as HTMLDivElement;
const lyricsClose = document.getElementById('lyricsClose') as HTMLButtonElement;
const lyricsTitle = document.getElementById('lyricsTitle') as HTMLDivElement;
const lyricsArtist = document.getElementById('lyricsArtist') as HTMLDivElement;
const lyricsBody = document.getElementById('lyricsBody') as HTMLDivElement;
const fsPlayer = document.getElementById('fsPlayer') as HTMLDivElement;
const fsClose = document.getElementById('fsClose') as HTMLButtonElement;
const fsBgImg = document.getElementById('fsBgImg') as HTMLImageElement;
const fsCover = document.getElementById('fsCover') as HTMLImageElement;
const fsTitle = document.getElementById('fsTitle') as HTMLDivElement;
const fsArtist = document.getElementById('fsArtist') as HTMLDivElement;
const fsBar = document.getElementById('fsBar') as HTMLDivElement;
const fsBarFill = document.getElementById('fsBarFill') as HTMLDivElement;
const fsCurTime = document.getElementById('fsCurTime') as HTMLSpanElement;
const fsDurTime = document.getElementById('fsDurTime') as HTMLSpanElement;
const fsPlayBtn = document.getElementById('fsPlayBtn') as HTMLButtonElement;
const fsPrev = document.getElementById('fsPrev') as HTMLButtonElement;
const fsNext = document.getElementById('fsNext') as HTMLButtonElement;
const fsCoverWrap = document.getElementById('fsCoverWrap') as HTMLDivElement;
const fsLyricsScroll = document.getElementById('fsLyricsScroll') as HTMLDivElement;
const fsCoverOverlay = document.getElementById('fsCoverOverlay') as HTMLDivElement;
const fsLyricsToggle = document.getElementById('fsLyricsToggle') as HTMLButtonElement;
const fsLyricsToggleText = document.getElementById('fsLyricsToggleText') as HTMLSpanElement;
const fsIcoPlay = fsPlayBtn.querySelector('.fs-ico-play') as SVGSVGElement;
const fsIcoPause = fsPlayBtn.querySelector('.fs-ico-pause') as SVGSVGElement;

interface LrcLine { time: number; text: string; }

let queue: Track[] = [];
let queueIdx = -1;
let volume = 0.7;
let allTracks: Track[] = [];
let activeFilter: 'all' | 'artist' | 'album' = 'all';
let navStack: { filter: string; title: string }[] = [];
let currentLyrics: LrcLine[] = [];
let lyricsOpen = false;
let fsOpen = false;
let fsShowLyrics = false;
let currentActiveIdx = -1;
audio.volume = volume;

function fmt(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function esc(t: string): string {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

function showResults() {
  landing.classList.add('hidden');
  resultsPage.classList.remove('hidden');
}

function showLanding() {
  landing.classList.remove('hidden');
  resultsPage.classList.add('hidden');
  player.classList.add('hidden');
  audio.pause();
  audio.src = '';
}

function setLoading() {
  rGrid.innerHTML = '';
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showNav(label: string) {
  rNav.classList.remove('hidden');
  rBackText.textContent = label;
}

function hideNav() {
  rNav.classList.add('hidden');
  navStack = [];
}

function pushNav(label: string) {
  navStack.push({ filter: activeFilter, title: rTitle.textContent || '' });
  showNav(label);
}

function renderCards(tracks: Track[]) {
  rGrid.className = 'r-grid';
  rGrid.innerHTML = tracks.map((t, i) => `
    <div class="card" data-i="${i}">
      <div class="card-img-wrap">
        <img class="card-img" src="${t.thumb}" alt="" loading="lazy"
          onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
        <button class="card-play" data-i="${i}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="card-title">${esc(t.title)}</div>
      <div class="card-sub">${esc(t.artist)} · ${t.duration}</div>
    </div>`).join('');

  rGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      queue = [...tracks];
      queueIdx = i;
      playCurrent();
    });
  });

  highlightPlaying();
}

function renderArtists(tracks: Track[]) {
  rGrid.className = 'r-grid artist-grid';
  const map = new Map<string, { name: string; img: string; count: number; tracks: Track[] }>();
  tracks.forEach(t => {
    const key = t.artist.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      existing.tracks.push(t);
    } else {
      map.set(key, { name: t.artist, img: t.artistImg, count: 1, tracks: [t] });
    }
  });
  const artists = [...map.values()].sort((a, b) => b.count - a.count);

  rGrid.innerHTML = artists.map((a, i) => `
    <div class="artist-card" data-i="${i}">
      <img class="ac-img" src="${a.img}" alt="" loading="lazy"
        onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
      <div class="ac-name">${esc(a.name)}</div>
      <div class="ac-sub">${a.count} lagu</div>
    </div>`).join('');

  rGrid.querySelectorAll('.artist-card').forEach(card => {
    card.addEventListener('click', () => {
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      const artist = artists[i];
      pushNav('Artis');
      rTitle.textContent = artist.name;
      renderAlbums(artist.tracks, artist.name);
    });
  });
}

function renderAlbums(tracks: Track[], artistName?: string) {
  rGrid.className = 'r-grid album-grid';
  const map = new Map<string, { name: string; img: string; artist: string; albumId: number; count: number; tracks: Track[] }>();
  tracks.forEach(t => {
    const key = t.album.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      existing.tracks.push(t);
    } else {
      map.set(key, { name: t.album, img: t.thumb, artist: t.artist, albumId: t.albumId, count: 1, tracks: [t] });
    }
  });
  const albums = [...map.values()].sort((a, b) => b.count - a.count);

  rGrid.innerHTML = albums.map((a, i) => `
    <div class="album-card" data-i="${i}">
      <img class="ac-img" src="${a.img}" alt="" loading="lazy"
        onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
      <div class="ac-name">${esc(a.name)}</div>
      <div class="ac-sub">${artistName ? esc(artistName) + ' · ' : ''}${a.count} lagu</div>
    </div>`).join('');

  rGrid.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', async () => {
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      const album = albums[i];
      pushNav('Album');
      rTitle.textContent = album.name;
      if (album.albumId) {
        rGrid.innerHTML = '<div class="loading-text">Memuat tracklist album...</div>';
        try {
          const res = await fetch(`/api/album/${album.albumId}`);
          const data = await res.json();
          if (data.tracks && data.tracks.length) {
            renderCards(data.tracks);
            return;
          }
        } catch (e) {
          console.error('[album fetch]', e);
        }
      }
      renderCards(album.tracks);
    });
  });
}

function applyFilter(f: 'all' | 'artist' | 'album') {
  activeFilter = f;
  hideNav();
  rTabs.querySelectorAll('.r-tab').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.f === f);
  });
  if (!allTracks.length) return;
  if (f === 'all') renderCards(allTracks);
  else if (f === 'artist') renderArtists(allTracks);
  else renderAlbums(allTracks);
}

function highlightPlaying() {
  rGrid.querySelectorAll('.card').forEach((c, i) => {
    c.classList.toggle('playing', i === queueIdx);
  });
}

async function playCurrent() {
  if (queueIdx < 0 || queueIdx >= queue.length) return;
  const track = queue[queueIdx];

  player.classList.remove('hidden');
  pTitle.textContent = track.title;
  pArtist.textContent = track.artist;
  (pThumb.querySelector('img') as HTMLImageElement).src = track.thumb;
  icoPlay.style.display = 'none';
  icoPause.style.display = '';
  highlightPlaying();
  playerBuffer.classList.remove('hidden');
  fetchLyrics(track.title, track.artist);
  if (fsOpen) {
    fsCover.src = track.thumb;
    fsBgImg.src = track.thumb;
    fsTitle.textContent = track.title;
    fsArtist.textContent = track.artist;
  }

  audio.src = `/api/stream?q=${encodeURIComponent(track.title + ' ' + track.artist)}`;

  try {
    await audio.play();
    playerBuffer.classList.add('hidden');
    icoPlay.style.display = 'none';
    icoPause.style.display = '';
  } catch (e) {
    console.error('Play error:', e);
    playerBuffer.classList.add('hidden');
    icoPlay.style.display = '';
    icoPause.style.display = 'none';
  }
}

async function fetchLyrics(track: string, artist: string) {
  currentLyrics = [];
  currentActiveIdx = -1;
  lyricsTitle.textContent = track;
  lyricsArtist.textContent = artist;
  lyricsBody.innerHTML = '<div class="lyrics-loading">Memuat lyrics...</div>';
  fsLyricsScroll.innerHTML = '<div class="fs-lyrics-empty">Memuat lyrics...</div>';

  try {
    const params = new URLSearchParams({ track, artist });
    const res = await fetch(`/api/lyrics?${params}`);
    const data = await res.json();
    currentLyrics = data.lyrics || [];
    console.log('[lyrics]', data.source, currentLyrics.length, 'lines');
  } catch (e) {
    console.error('[lyrics] error', e);
    currentLyrics = [];
  }

  if (currentLyrics.length > 1 && currentLyrics.every(l => l.time === 0)) {
    const tryDistribute = () => {
      const dur = audio.duration;
      if (dur && dur > 0 && isFinite(dur)) {
        const gap = dur / currentLyrics.length;
        currentLyrics.forEach((l, i) => { l.time = i * gap; });
      }
    };
    tryDistribute();
    if (currentLyrics[0].time === 0) {
      audio.addEventListener('loadedmetadata', () => {
        tryDistribute();
        renderLyrics();
        renderFsLyrics();
        syncAllLyrics();
      }, { once: true });
    }
  }

  renderLyrics();
  renderFsLyrics();
  syncAllLyrics();
}

function renderLyrics() {
  if (!currentLyrics.length) {
    lyricsBody.innerHTML = '<div class="lyrics-empty">Lyrics tidak tersedia untuk lagu ini</div>';
    return;
  }
  lyricsBody.innerHTML = currentLyrics.map((l, i) =>
    `<div class="lyrics-line" data-i="${i}" data-t="${l.time}">${esc(l.text)}</div>`
  ).join('');
}

function syncAllLyrics() {
  if (!currentLyrics.length) return;
  const t = audio.currentTime;
  let idx = -1;
  for (let i = currentLyrics.length - 1; i >= 0; i--) {
    if (t >= currentLyrics[i].time - 0.3) { idx = i; break; }
  }
  if (idx < 0) idx = 0;
  currentActiveIdx = idx;

  const lines = lyricsBody.querySelectorAll('.lyrics-line');
  lines.forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.classList.toggle('past', i < idx);
  });
  if (lyricsOpen && lines[idx]) {
    const bodyRect = lyricsBody.getBoundingClientRect();
    const lineRect = (lines[idx] as HTMLElement).getBoundingClientRect();
    lyricsBody.scrollBy({ top: lineRect.top - bodyRect.top - bodyRect.height / 2, behavior: 'smooth' });
  }

  const fsLines = fsLyricsScroll.querySelectorAll('.lyrics-line');
  fsLines.forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.classList.toggle('past', i < idx);
  });
  if (fsOpen && fsShowLyrics && fsLines[idx]) {
    const target = fsLines[idx] as HTMLElement;
    const targetY = target.offsetTop + target.offsetHeight / 2 - fsLyricsScroll.clientHeight / 2;
    fsLyricsScroll.scrollTo({ top: targetY, behavior: 'smooth' });
  }
}

function renderFsLyrics() {
  if (!currentLyrics.length) {
    fsLyricsScroll.innerHTML = '<div class="fs-lyrics-empty">Lyrics tidak tersedia</div>';
    return;
  }
  fsLyricsScroll.innerHTML = currentLyrics.map((l, i) =>
    `<div class="lyrics-line" data-i="${i}">${esc(l.text)}</div>`
  ).join('');
}

function openLyrics() {
  lyricsOpen = true;
  lyricsModal.classList.remove('hidden');
  renderLyrics();
  syncAllLyrics();
}

function closeLyrics() {
  lyricsOpen = false;
  lyricsModal.classList.add('hidden');
}

let fsLyricsAnimId = 0;

function syncFsLyricsLoop() {
  if (!fsOpen || !fsShowLyrics) { fsLyricsAnimId = 0; return; }
  syncAllLyrics();
  fsLyricsAnimId = requestAnimationFrame(syncFsLyricsLoop);
}

function toggleFsLyrics() {
  fsShowLyrics = !fsShowLyrics;
  fsCoverWrap.classList.toggle('show-lyrics', fsShowLyrics);
  fsLyricsToggle.classList.toggle('active', fsShowLyrics);
  fsLyricsToggleText.textContent = fsShowLyrics ? 'Lihat Sampul' : 'Lihat Lirik';
  if (fsShowLyrics) {
    renderFsLyrics();
    if (fsLyricsAnimId) cancelAnimationFrame(fsLyricsAnimId);
    fsLyricsAnimId = requestAnimationFrame(syncFsLyricsLoop);
  } else {
    if (fsLyricsAnimId) { cancelAnimationFrame(fsLyricsAnimId); fsLyricsAnimId = 0; }
  }
}

function openFs() {
  if (queueIdx < 0) return;
  const track = queue[queueIdx];
  fsOpen = true;
  fsPlayer.classList.remove('hidden');
  fsCover.src = track.thumb;
  fsBgImg.src = track.thumb;
  fsTitle.textContent = track.title;
  fsArtist.textContent = track.artist;
  fsIcoPlay.style.display = audio.paused ? '' : 'none';
  fsIcoPause.style.display = audio.paused ? 'none' : '';
  fsShowLyrics = false;
  fsCoverWrap.classList.remove('show-lyrics');
  fsLyricsToggle.classList.remove('active');
  fsLyricsToggleText.textContent = 'Lihat Lirik';
  syncFs();
}

function closeFs() {
  fsOpen = false;
  fsShowLyrics = false;
  fsCoverWrap.classList.remove('show-lyrics');
  fsPlayer.classList.add('hidden');
  if (fsLyricsAnimId) { cancelAnimationFrame(fsLyricsAnimId); fsLyricsAnimId = 0; }
}

function syncFs() {
  if (!fsOpen) return;
  if (audio.duration) {
    fsBarFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    fsCurTime.textContent = fmt(audio.currentTime);
  }
  fsIcoPlay.style.display = audio.paused ? '' : 'none';
  fsIcoPause.style.display = audio.paused ? 'none' : '';
  const volPct = Math.round(audio.volume * 100);
  fsVolFill.style.width = volPct + '%';
}

async function doSearch(q: string) {
  if (!q.trim()) return;
  showResults();
  setLoading();
  rTitle.textContent = `"${q}"`;
  searchInput2.value = q;

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    hideLoading();

    if (data.results?.length) {
      rTitle.textContent = `Hasil: "${q}"`;
      allTracks = data.results;
      applyFilter(activeFilter);
    } else {
      rTitle.textContent = '';
      allTracks = [];
      rGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666">Tidak ditemukan hasil</div>';
    }
  } catch {
    hideLoading();
    rGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666">Gagal memuat</div>';
  }
}

rTabs.addEventListener('click', (e: MouseEvent) => {
  const tab = (e.target as HTMLElement).closest('.r-tab') as HTMLElement;
  if (!tab) return;
  const f = tab.dataset.f as 'all' | 'artist' | 'album';
  if (f) applyFilter(f);
});

rBack.addEventListener('click', () => {
  if (navStack.length === 0) return;
  const prev = navStack.pop()!;
  activeFilter = prev.filter as any;
  rTabs.querySelectorAll('.r-tab').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.f === activeFilter);
  });
  rTitle.textContent = prev.title;
  if (navStack.length === 0) hideNav();
  else showNav(navStack[navStack.length - 1].title === prev.title ? 'Kembali' : prev.title);
  if (activeFilter === 'all') renderCards(allTracks);
  else if (activeFilter === 'artist') renderArtists(allTracks);
  else renderAlbums(allTracks);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch(searchInput.value);
});

searchBtn.addEventListener('click', () => doSearch(searchInput.value));

searchInput2.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch(searchInput2.value);
});

searchBtn2.addEventListener('click', () => doSearch(searchInput2.value));

goHome.addEventListener('click', showLanding);

playBtn.addEventListener('click', () => {
  if (!audio.src) return;
  if (audio.paused) {
    audio.play();
    icoPlay.style.display = 'none';
    icoPause.style.display = '';
  } else {
    audio.pause();
    icoPlay.style.display = '';
    icoPause.style.display = 'none';
  }
});

prevBtn.addEventListener('click', () => {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (queueIdx > 0) { queueIdx--; playCurrent(); }
});

nextBtn.addEventListener('click', () => {
  if (queueIdx < queue.length - 1) { queueIdx++; playCurrent(); }
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    pBarFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    curTime.textContent = fmt(audio.currentTime);
    syncFs();
    syncAllLyrics();
  }
});

audio.addEventListener('loadedmetadata', () => {
  durTime.textContent = fmt(audio.duration);
  if (fsOpen) fsDurTime.textContent = fmt(audio.duration);
});

audio.addEventListener('ended', () => {
  if (queueIdx < queue.length - 1) { queueIdx++; playCurrent(); }
  else {
    icoPlay.style.display = '';
    icoPause.style.display = 'none';
    pBarFill.style.width = '0%';
    curTime.textContent = '0:00';
  }
});

pBar.addEventListener('click', (e: MouseEvent) => {
  if (!audio.duration) return;
  const r = pBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

pVol.addEventListener('click', (e: MouseEvent) => {
  const r = pVol.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  volume = p;
  audio.volume = volume;
  pVolFill.style.width = (p * 100) + '%';
});

volBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (audio.muted) pVolFill.style.width = '0%';
  else pVolFill.style.width = (volume * 100) + '%';
});

lyricsBtn.addEventListener('click', openLyrics);
lyricsClose.addEventListener('click', closeLyrics);
lyricsBackdrop.addEventListener('click', closeLyrics);

player.addEventListener('click', (e: MouseEvent) => {
  const t = e.target as HTMLElement;
  if (t.closest('.pb') || t.closest('.p-bar') || t.closest('.p-bar-fill') || t.closest('.p-vol') || t.closest('.player-buffer')) return;
  openFs();
});

fsClose.addEventListener('click', closeFs);

fsPlayBtn.addEventListener('click', () => {
  if (!audio.src) return;
  if (audio.paused) audio.play(); else audio.pause();
});

fsPrev.addEventListener('click', () => {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (queueIdx > 0) { queueIdx--; playCurrent(); }
});

fsNext.addEventListener('click', () => {
  if (queueIdx < queue.length - 1) { queueIdx++; playCurrent(); }
});

fsBar.addEventListener('click', (e: MouseEvent) => {
  if (!audio.duration) return;
  const r = fsBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

fsLyricsToggle.addEventListener('click', toggleFsLyrics);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (fsOpen) closeFs();
    else if (lyricsOpen) closeLyrics();
  }
});
