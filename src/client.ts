import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rymjroodmcfmaobsagqn.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bWpyb29kbWNmbWFvYnNhZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTI4MTQsImV4cCI6MjA5ODM4ODgxNH0.6pI6WrHee5rNfyhGF2P6oIQ8j1IMtsxV1boXZc715u0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ===== TYPES =====
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

interface LrcLine { time: number; text: string; }

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
}

interface Playlist {
  id: string;
  name: string;
  created_at: string;
}

interface PlaylistSong {
  id: string;
  playlist_id: string;
  track_id: string;
  title: string;
  artist: string;
  album: string;
  thumb: string;
  duration: string;
  position: number;
}

// ===== DOM ELEMENTS =====
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
const shuffleBtn = document.getElementById('shuffleBtn') as HTMLButtonElement;
const repeatBtn = document.getElementById('repeatBtn') as HTMLButtonElement;
const repeatBadge = document.getElementById('repeatBadge') as HTMLSpanElement;
const fsShuffleBtn = document.getElementById('fsShuffleBtn') as HTMLButtonElement;
const fsRepeatBtn = document.getElementById('fsRepeatBtn') as HTMLButtonElement;
const fsRepeatBadge = document.getElementById('fsRepeatBadge') as HTMLSpanElement;
const rActions = document.getElementById('rActions') as HTMLDivElement;
const playAllBtn = document.getElementById('playAllBtn') as HTMLButtonElement;
const shuffleAllBtn = document.getElementById('shuffleAllBtn') as HTMLButtonElement;
const viewToggle = document.getElementById('viewToggle') as HTMLDivElement;

// Auth elements
const authPage = document.getElementById('authPage') as HTMLDivElement;
const loginForm = document.getElementById('loginForm') as HTMLDivElement;
const registerForm = document.getElementById('registerForm') as HTMLDivElement;
const forgotForm = document.getElementById('forgotForm') as HTMLDivElement;
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
const loginError = document.getElementById('loginError') as HTMLDivElement;
const regName = document.getElementById('regName') as HTMLInputElement;
const regUsername = document.getElementById('regUsername') as HTMLInputElement;
const regPassword = document.getElementById('regPassword') as HTMLInputElement;
const registerBtn = document.getElementById('registerBtn') as HTMLButtonElement;
const registerError = document.getElementById('registerError') as HTMLDivElement;
const registerSuccess = document.getElementById('registerSuccess') as HTMLDivElement;
const forgotUsername = document.getElementById('forgotUsername') as HTMLInputElement;
const forgotBtn = document.getElementById('forgotBtn') as HTMLButtonElement;
const forgotError = document.getElementById('forgotError') as HTMLDivElement;
const forgotSuccess = document.getElementById('forgotSuccess') as HTMLDivElement;
const showRegisterBtn = document.getElementById('showRegister') as HTMLAnchorElement;
const showLoginBtn = document.getElementById('showLogin') as HTMLAnchorElement;
const forgotPassLink = document.getElementById('forgotPassLink') as HTMLAnchorElement;
const backToLoginLink = document.getElementById('backToLogin') as HTMLAnchorElement;

// User menu elements
const userBtn = document.getElementById('userBtn') as HTMLButtonElement;
const userDropdown = document.getElementById('userDropdown') as HTMLDivElement;
const userNameDisplay = document.getElementById('userName') as HTMLSpanElement;
const likedSongsMenuBtn = document.getElementById('likedSongsMenuBtn') as HTMLButtonElement;
const playlistsMenuBtn = document.getElementById('playlistsMenuBtn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;

// New page elements
const likedPage = document.getElementById('likedPage') as HTMLDivElement;
const likedGrid = document.getElementById('likedGrid') as HTMLDivElement;
const likedBack = document.getElementById('likedBack') as HTMLButtonElement;
const playlistsPage = document.getElementById('playlistsPage') as HTMLDivElement;
const playlistsGrid = document.getElementById('playlistsGrid') as HTMLDivElement;
const playlistsBack = document.getElementById('playlistsBack') as HTMLButtonElement;
const createPlaylistBtn = document.getElementById('createPlaylistBtn') as HTMLButtonElement;
const playlistDetailPage = document.getElementById('playlistDetailPage') as HTMLDivElement;
const playlistDetailGrid = document.getElementById('playlistDetailGrid') as HTMLDivElement;
const playlistDetailBack = document.getElementById('playlistDetailBack') as HTMLButtonElement;
const playlistDetailTitle = document.getElementById('playlistDetailTitle') as HTMLDivElement;
const playlistDetailPlay = document.getElementById('playlistDetailPlay') as HTMLButtonElement;
const playlistDetailShuffle = document.getElementById('playlistDetailShuffle') as HTMLButtonElement;

// Modal elements
const addPlaylistModal = document.getElementById('addPlaylistModal') as HTMLDivElement;
const addPlaylistBackdrop = document.getElementById('addPlaylistBackdrop') as HTMLDivElement;
const addPlaylistList = document.getElementById('addPlaylistList') as HTMLDivElement;
const addPlaylistClose = document.getElementById('addPlaylistClose') as HTMLButtonElement;
const createPlaylistModal = document.getElementById('createPlaylistModal') as HTMLDivElement;
const createPlaylistBackdrop = document.getElementById('createPlaylistBackdrop') as HTMLDivElement;
const createPlaylistClose = document.getElementById('createPlaylistClose') as HTMLButtonElement;
const newPlaylistName = document.getElementById('newPlaylistName') as HTMLInputElement;
const savePlaylistBtn = document.getElementById('savePlaylistBtn') as HTMLButtonElement;

// Player like/playlist buttons
const pLikeBtn = document.getElementById('pLikeBtn') as HTMLButtonElement;
const pPlaylistBtn = document.getElementById('pPlaylistBtn') as HTMLButtonElement;
const fsLikeBtn = document.getElementById('fsLikeBtn') as HTMLButtonElement;
const fsPlaylistBtn = document.getElementById('fsPlaylistBtn') as HTMLButtonElement;

// Sidebar elements
const sidebarOverlay = document.getElementById('sidebarOverlay') as HTMLDivElement;
const sidebar = document.getElementById('sidebar') as HTMLDivElement;
const sidebarClose = document.getElementById('sidebarClose') as HTMLButtonElement;
const sidebarName = document.getElementById('sidebarName') as HTMLDivElement;
const sidebarLikedBtn = document.getElementById('sidebarLikedBtn') as HTMLButtonElement;
const sidebarPlaylistsBtn = document.getElementById('sidebarPlaylistsBtn') as HTMLButtonElement;
const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn') as HTMLButtonElement;
const hamburgerBtn = document.getElementById('hamburgerBtn') as HTMLButtonElement;

// Safe null check helper
function safe(id: string): HTMLElement | null { return document.getElementById(id); }
function on(el: HTMLElement | null, evt: string, fn: any) { if (el) el.addEventListener(evt, fn); else console.warn('Missing element:', el); }

// ===== STATE =====
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
let shuffleOn = false;
let repeatMode: 'off' | 'all' | 'one' = 'off';
let viewMode: 'grid' | 'list' = 'grid';
let isSeeking = false;
audio.volume = volume;

// Auth state
let currentUser: any = null;
let userProfile: UserProfile | null = null;

// Liked songs state
let likedSongIds = new Set<string>();
let likedTracks: Track[] = [];

// Playlists state
let userPlaylists: Playlist[] = [];
let currentPlaylistId: string | null = null;
let currentPlaylistTracks: PlaylistSong[] = [];

// Add to playlist state
let addToPlaylistTrack: Track | null = null;

// ===== UTILITY =====
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

// ===== AUTH =====
async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    await loadProfile();
    hideAuthPage();
    updateUIForAuth();
  } else {
    showAuthPage();
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      currentUser = session.user;
      await loadProfile();
      hideAuthPage();
      updateUIForAuth();
    } else {
      currentUser = null;
      userProfile = null;
      showAuthPage();
      updateUIForAuth();
    }
  });
}

async function loadProfile() {
  if (!currentUser) return;
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
    if (data) {
      userProfile = data;
      userNameDisplay.textContent = userProfile.display_name || userProfile.username;
    } else {
      userProfile = { id: currentUser.id, username: currentUser.user_metadata?.username || '', display_name: currentUser.user_metadata?.display_name || '' };
      userNameDisplay.textContent = userProfile.display_name || userProfile.username;
    }
  } catch (e) {
    console.error('[loadProfile]', e);
    userProfile = { id: currentUser.id, username: '', display_name: '' };
  }
}

function showAuthPage() {
  authPage.classList.remove('hidden');
  landing.classList.add('hidden');
  resultsPage.classList.add('hidden');
  player.classList.add('hidden');
  likedPage.classList.add('hidden');
  playlistsPage.classList.add('hidden');
  playlistDetailPage.classList.add('hidden');
}

function hideAuthPage() {
  authPage.classList.add('hidden');
  landing.classList.remove('hidden');
  resultsPage.classList.add('hidden');
  likedPage.classList.add('hidden');
  playlistsPage.classList.add('hidden');
  playlistDetailPage.classList.add('hidden');
}

function updateUIForAuth() {
  if (currentUser && userProfile) {
    userBtn.classList.remove('hidden');
    hamburgerBtn.classList.remove('hidden');
    userNameDisplay.textContent = userProfile.display_name || userProfile.username;
    sidebarName.textContent = userProfile.display_name || userProfile.username;
  } else {
    userBtn.classList.add('hidden');
    hamburgerBtn.classList.add('hidden');
    userDropdown.classList.add('hidden');
    closeSidebar();
  }
}

function openSidebar() {
  if (!currentUser) return;
  sidebarName.textContent = userProfile?.display_name || userProfile?.username || '';
  sidebar.classList.remove('hidden');
  sidebarOverlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
  });
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  setTimeout(() => {
    sidebar.classList.add('hidden');
    sidebarOverlay.classList.add('hidden');
  }, 300);
}

function showAuthView(view: 'login' | 'register' | 'forgot') {
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  forgotForm.classList.add('hidden');
  loginError.textContent = '';
  registerError.textContent = '';
  registerSuccess.textContent = '';
  forgotError.textContent = '';
  forgotSuccess.textContent = '';

  if (view === 'login') loginForm.classList.remove('hidden');
  else if (view === 'register') registerForm.classList.remove('hidden');
  else forgotForm.classList.remove('hidden');
}

async function handleLogin() {
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    loginError.textContent = 'Username dan password harus diisi';
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Masuk...';
  loginError.textContent = '';

  const email = `${username}@orima.app`;
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  loginBtn.disabled = false;
  loginBtn.textContent = 'Login';

  if (error) {
    const msg = error.message || 'Username atau password salah';
    if (msg.includes('Invalid') || msg.includes('invalid') || msg.includes('credentials')) {
      loginError.textContent = 'Username atau password salah';
    } else {
      loginError.textContent = msg;
    }
  } else {
    loginUsername.value = '';
    loginPassword.value = '';
    currentUser = (await supabase.auth.getUser()).data.user;
    await loadProfile();
    hideAuthPage();
    updateUIForAuth();
    await loadLikedSongs();
  }
}

async function handleRegister() {
  const name = regName.value.trim();
  const username = regUsername.value.trim().toLowerCase();
  const password = regPassword.value;

  if (!name || !username || !password) {
    registerError.textContent = 'Semua kolom harus diisi';
    return;
  }

  if (username.length < 3) {
    registerError.textContent = 'Username minimal 3 karakter';
    return;
  }

  if (password.length < 6) {
    registerError.textContent = 'Password minimal 6 karakter';
    return;
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    registerError.textContent = 'Username hanya boleh huruf kecil, angka, dan underscore';
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = 'Mendaftar...';
  registerError.textContent = '';

  const email = `${username}@orima.app`;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: name }
    }
  });

  registerBtn.disabled = false;
  registerBtn.textContent = 'Register';

  if (error) {
    const msg = error.message || error.error_description || 'Terjadi error, coba lagi';
    if (msg.includes('already') || msg.includes('exists') || msg.includes('duplicate')) {
      registerError.textContent = 'Username sudah digunakan';
    } else {
      registerError.textContent = msg;
    }
  } else if (data?.user?.identities?.length === 0) {
    registerError.textContent = 'Username sudah digunakan';
  } else {
    registerSuccess.textContent = 'Registrasi berhasil! Sedang login...';
    regName.value = '';
    regUsername.value = '';
    regPassword.value = '';
    // Auto login after register
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!loginErr) {
      currentUser = (await supabase.auth.getUser()).data.user;
      await loadProfile();
      hideAuthPage();
      updateUIForAuth();
      await loadLikedSongs();
    } else {
      setTimeout(() => showAuthView('login'), 1500);
    }
  }
}

async function handleForgotPassword() {
  const username = forgotUsername.value.trim().toLowerCase();

  if (!username) {
    forgotError.textContent = 'Username harus diisi';
    return;
  }

  forgotBtn.disabled = true;
  forgotBtn.textContent = 'Mengirim...';
  forgotError.textContent = '';
  forgotSuccess.textContent = '';

  const email = `${username}@orima.app`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  forgotBtn.disabled = false;
  forgotBtn.textContent = 'Reset Password';

  if (error) {
    forgotError.textContent = 'Gagal mengirim reset password. Pastikan username benar.';
  } else {
    forgotSuccess.textContent = 'Link reset password telah dikirim ke email terdaftar.';
    forgotUsername.value = '';
  }
}

async function handleLogout() {
  await supabase.auth.signOut();
  currentUser = null;
  userProfile = null;
  likedSongIds.clear();
  likedTracks = [];
  userPlaylists = [];
  audio.pause();
  audio.src = '';
  player.classList.add('hidden');
  showLanding();
}

// ===== LIKED SONGS =====
async function loadLikedSongs() {
  if (!currentUser) return;
  const { data } = await supabase
    .from('liked_songs')
    .select('track_id')
    .eq('user_id', currentUser.id);

  likedSongIds.clear();
  if (data) data.forEach((r: any) => likedSongIds.add(r.track_id));
  updateAllLikeButtons();
}

async function loadLikedTracks() {
  if (!currentUser) return;
  const { data } = await supabase
    .from('liked_songs')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  if (data) {
    likedTracks = data.map((r: any) => ({
      id: r.track_id,
      title: r.title || 'Unknown',
      artist: r.artist || 'Unknown',
      artistImg: '',
      album: r.album || '',
      albumId: 0,
      duration: r.duration || '',
      durSec: 0,
      thumb: r.thumb || '',
      preview: '',
      views: 0,
      viewsText: '',
      link: '',
      isOfficial: false,
    }));
  }
}

async function toggleLike(track: Track) {
  if (!currentUser) {
    showAuthPage();
    return;
  }

  if (likedSongIds.has(track.id)) {
    likedSongIds.delete(track.id);
    await supabase
      .from('liked_songs')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('track_id', track.id);
  } else {
    likedSongIds.add(track.id);
    await supabase.from('liked_songs').insert({
      user_id: currentUser.id,
      track_id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      thumb: track.thumb,
      duration: track.duration,
    });
  }
  updateAllLikeButtons();
}

function updateAllLikeButtons() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    const trackId = (btn as HTMLElement).dataset.trackId;
    if (trackId) {
      btn.classList.toggle('liked', likedSongIds.has(trackId));
    }
  });
  updatePlayerLikeBtn();
}

function updatePlayerLikeBtn() {
  if (queueIdx < 0 || queueIdx >= queue.length) return;
  const track = queue[queueIdx];
  const isLiked = likedSongIds.has(track.id);
  pLikeBtn.classList.toggle('liked', isLiked);
  fsLikeBtn.classList.toggle('liked', isLiked);
}

async function showLikedSongsPage() {
  if (!currentUser) { showAuthPage(); return; }

  // Determine current page for back navigation
  if (resultsPage.classList.contains('hidden')) pushPage('landing');
  else pushPage('results');

  hideAllPages();
  likedPage.classList.remove('hidden');
  rTitle.textContent = 'Liked Songs';
  likedGrid.innerHTML = '<div class="loading-text">Memuat liked songs...</div>';

  await loadLikedTracks();

  if (likedTracks.length === 0) {
    likedGrid.innerHTML = '<div class="empty-state">Belum ada lagu yang disukai.<br>Klik hati pada lagu untuk menambahkannya.</div>';
    return;
  }

  renderLikedTracks();
}

function renderLikedTracks() {
  likedGrid.className = 'r-grid';
  likedGrid.innerHTML = likedTracks.map((t, i) => `
    <div class="card" data-i="${i}">
      <div class="card-img-wrap">
        <img class="card-img" src="${t.thumb}" alt="" loading="lazy"
          onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
        <button class="card-play" data-i="${i}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button class="like-btn liked" data-track-id="${t.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div class="card-title">${esc(t.title)}</div>
      <div class="card-sub">${esc(t.artist)} · ${t.duration}</div>
    </div>`).join('');

  likedGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.like-btn')) return;
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      queue = [...likedTracks];
      queueIdx = i;
      playCurrent();
    });
  });

  likedGrid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const trackId = (btn as HTMLElement).dataset.trackId!;
      const track = likedTracks.find(t => t.id === trackId);
      if (track) {
        await toggleLike(track);
        if (likedSongIds.has(trackId)) {
          btn.classList.add('liked');
        } else {
          btn.classList.remove('liked');
          likedTracks = likedTracks.filter(t => t.id !== trackId);
          renderLikedTracks();
        }
      }
    });
  });
}

// ===== PLAYLISTS =====
async function loadPlaylists() {
  if (!currentUser) return;
  const { data } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  userPlaylists = data || [];
}

async function handleCreatePlaylist(name: string) {
  if (!currentUser || !name.trim()) return;

  const { data, error } = await supabase
    .from('playlists')
    .insert({ user_id: currentUser.id, name: name.trim() })
    .select()
    .single();

  if (!error && data) {
    userPlaylists.unshift(data);
    return data;
  }
  return null;
}

async function handleDeletePlaylist(id: string) {
  if (!currentUser) return;
  await supabase.from('playlists').delete().eq('id', id).eq('user_id', currentUser.id);
  userPlaylists = userPlaylists.filter(p => p.id !== id);
}

async function handleAddSongToPlaylist(playlistId: string, track: Track) {
  if (!currentUser) return;

  const { data: existing } = await supabase
    .from('playlist_songs')
    .select('id')
    .eq('playlist_id', playlistId)
    .eq('track_id', track.id)
    .limit(1);

  if (existing && existing.length > 0) return;

  const { data: maxPos } = await supabase
    .from('playlist_songs')
    .select('position')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: false })
    .limit(1);

  const nextPos = maxPos && maxPos.length > 0 ? (maxPos[0] as any).position + 1 : 0;

  await supabase.from('playlist_songs').insert({
    playlist_id: playlistId,
    track_id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    thumb: track.thumb,
    duration: track.duration,
    position: nextPos,
  });
}

async function handleRemoveSongFromPlaylist(playlistId: string, trackId: string) {
  if (!currentUser) return;
  await supabase
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('track_id', trackId);
}

async function loadPlaylistTracks(playlistId: string) {
  if (!currentUser) return [];
  const { data } = await supabase
    .from('playlist_songs')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: true });

  return (data || []) as PlaylistSong[];
}

async function showPlaylistsPage() {
  if (!currentUser) { showAuthPage(); return; }

  // Only push to history if not going back from detail
  if (playlistDetailPage.classList.contains('hidden')) {
    if (resultsPage.classList.contains('hidden')) pushPage('landing');
    else pushPage('results');
  }

  hideAllPages();
  playlistsPage.classList.remove('hidden');

  await loadPlaylists();

  if (userPlaylists.length === 0) {
    playlistsGrid.innerHTML = '<div class="empty-state">Belum ada playlist.<br>Buat playlist baru untuk menyimpan lagu favoritmu.</div>';
    return;
  }

  playlistsGrid.innerHTML = userPlaylists.map(p => `
    <div class="playlist-card" data-id="${p.id}">
      <div class="playlist-card-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>
      </div>
      <div class="playlist-card-info">
        <div class="playlist-card-name">${esc(p.name)}</div>
        <div class="playlist-card-sub">Playlist</div>
      </div>
      <button class="playlist-card-delete" data-id="${p.id}" title="Hapus playlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </button>
    </div>`).join('');

  playlistsGrid.querySelectorAll('.playlist-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.playlist-card-delete')) return;
      const id = (card as HTMLElement).dataset.id!;
      showPlaylistDetailPage(id);
    });
  });

  playlistsGrid.querySelectorAll('.playlist-card-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id!;
      if (confirm('Hapus playlist ini?')) {
        await handleDeletePlaylist(id);
        showPlaylistsPage();
      }
    });
  });
}

async function showPlaylistDetailPage(playlistId: string) {
  if (!currentUser) return;

  currentPlaylistId = playlistId;
  const playlist = userPlaylists.find(p => p.id === playlistId);
  if (!playlist) return;

  hideAllPages();
  playlistDetailPage.classList.remove('hidden');
  playlistDetailTitle.textContent = playlist.name;
  playlistDetailGrid.innerHTML = '<div class="loading-text">Memuat lagu...</div>';

  currentPlaylistTracks = await loadPlaylistTracks(playlistId);

  if (currentPlaylistTracks.length === 0) {
    playlistDetailGrid.innerHTML = '<div class="empty-state">Playlist ini kosong.<br>Tambahkan lagu dari player atau pencarian.</div>';
    return;
  }

  renderPlaylistTracks();
}

function renderPlaylistTracks() {
  const tracks: Track[] = currentPlaylistTracks.map(ps => ({
    id: ps.track_id,
    title: ps.title || 'Unknown',
    artist: ps.artist || 'Unknown',
    artistImg: '',
    album: ps.album || '',
    albumId: 0,
    duration: ps.duration || '',
    durSec: 0,
    thumb: ps.thumb || '',
    preview: '',
    views: 0,
    viewsText: '',
    link: '',
    isOfficial: false,
  }));

  playlistDetailGrid.className = 'r-grid';
  playlistDetailGrid.innerHTML = tracks.map((t, i) => `
    <div class="card" data-i="${i}">
      <div class="card-img-wrap">
        <img class="card-img" src="${t.thumb}" alt="" loading="lazy"
          onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
        <button class="card-play" data-i="${i}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button class="like-btn ${likedSongIds.has(t.id) ? 'liked' : ''}" data-track-id="${t.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
        <button class="card-remove-from-playlist" data-track-id="${t.id}" title="Hapus dari playlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div class="card-title">${esc(t.title)}</div>
      <div class="card-sub">${esc(t.artist)} · ${t.duration}</div>
    </div>`).join('');

  playlistDetailGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.like-btn') || (e.target as HTMLElement).closest('.card-remove-from-playlist')) return;
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      queue = [...tracks];
      queueIdx = i;
      playCurrent();
    });
  });

  playlistDetailGrid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const trackId = (btn as HTMLElement).dataset.trackId!;
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        await toggleLike(track);
        btn.classList.toggle('liked', likedSongIds.has(trackId));
      }
    });
  });

  playlistDetailGrid.querySelectorAll('.card-remove-from-playlist').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const trackId = (btn as HTMLElement).dataset.trackId!;
      if (currentPlaylistId && confirm('Hapus lagu dari playlist?')) {
        await handleRemoveSongFromPlaylist(currentPlaylistId, trackId);
        currentPlaylistTracks = currentPlaylistTracks.filter(ps => ps.track_id !== trackId);
        renderPlaylistTracks();
      }
    });
  });
}

function showAddToPlaylistModal(track: Track) {
  if (!currentUser) { showAuthPage(); return; }
  addToPlaylistTrack = track;
  addPlaylistModal.classList.remove('hidden');
  renderPlaylistModalList();
}

function hideAddToPlaylistModal() {
  addPlaylistModal.classList.add('hidden');
  addToPlaylistTrack = null;
}

async function renderPlaylistModalList() {
  await loadPlaylists();

  if (userPlaylists.length === 0) {
    addPlaylistList.innerHTML = '<div class="empty-state-sm">Belum ada playlist</div>';
    return;
  }

  addPlaylistList.innerHTML = userPlaylists.map(p => `
    <button class="playlist-modal-item" data-id="${p.id}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>
      <span>${esc(p.name)}</span>
    </button>`).join('');

  addPlaylistList.querySelectorAll('.playlist-modal-item').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.id!;
      if (addToPlaylistTrack) {
        await handleAddSongToPlaylist(id, addToPlaylistTrack);
        hideAddToPlaylistModal();
      }
    });
  });
}

function showCreatePlaylistModalFromButton() {
  createPlaylistModal.classList.remove('hidden');
  newPlaylistName.value = '';
  newPlaylistName.focus();
}

function hideCreatePlaylistModal() {
  createPlaylistModal.classList.add('hidden');
}

async function handleCreatePlaylistFromModal() {
  const name = newPlaylistName.value.trim();
  if (!name) return;

  savePlaylistBtn.disabled = true;
  const created = await handleCreatePlaylist(name);
  savePlaylistBtn.disabled = false;

  if (created) {
    hideCreatePlaylistModal();
    if (addToPlaylistTrack) {
      await handleAddSongToPlaylist(created.id, addToPlaylistTrack);
      hideAddToPlaylistModal();
    } else {
      showPlaylistsPage();
    }
  }
}

// Page navigation stack
let pageHistory: string[] = [];

function pushPage(page: string) {
  pageHistory.push(page);
}

function popPage(): string {
  return pageHistory.pop() || 'landing';
}
function showResults() {
  hideAllPages();
  landing.classList.add('hidden');
  resultsPage.classList.remove('hidden');
}

function showLanding() {
  hideAllPages();
  landing.classList.remove('hidden');
  resultsPage.classList.add('hidden');
  player.classList.add('hidden');
  audio.pause();
  audio.src = '';
  pageHistory = [];
}

function showLikedPage() {
  hideAllPages();
  likedPage.classList.remove('hidden');
}

function showPlaylistsPageView() {
  hideAllPages();
  playlistsPage.classList.remove('hidden');
}

function showPlaylistDetailView() {
  hideAllPages();
  playlistDetailPage.classList.remove('hidden');
}

function hideAllPages() {
  landing.classList.add('hidden');
  resultsPage.classList.add('hidden');
  likedPage.classList.add('hidden');
  playlistsPage.classList.add('hidden');
  playlistDetailPage.classList.add('hidden');
  authPage.classList.add('hidden');
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

function renderCards(tracks: Track[], container?: HTMLElement) {
  const grid = container || rGrid;
  if (viewMode === 'list' && !container) {
    renderList(tracks);
    return;
  }
  grid.className = 'r-grid';
  grid.innerHTML = tracks.map((t, i) => `
    <div class="card" data-i="${i}">
      <div class="card-img-wrap">
        <img class="card-img" src="${t.thumb}" alt="" loading="lazy"
          onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
        <button class="card-play" data-i="${i}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button class="like-btn ${likedSongIds.has(t.id) ? 'liked' : ''}" data-track-id="${t.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div class="card-title">${esc(t.title)}</div>
      <div class="card-sub">${esc(t.artist)} · ${t.duration}</div>
    </div>`).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.like-btn')) return;
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      queue = [...tracks];
      queueIdx = i;
      playCurrent();
    });
  });

  grid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const trackId = (btn as HTMLElement).dataset.trackId!;
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        await toggleLike(track);
        btn.classList.toggle('liked', likedSongIds.has(trackId));
      }
    });
  });

  if (!container) highlightPlaying();
}

function renderList(tracks: Track[]) {
  rGrid.className = 'r-grid list-view';
  rGrid.innerHTML = tracks.map((t, i) => `
    <div class="card" data-i="${i}">
      <div class="card-num">${i + 1}</div>
      <div class="card-img-wrap">
        <img class="card-img" src="${t.thumb}" alt="" loading="lazy"
          onerror="this.style.background='#1a1a2e'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%231a1a2e%22 width=%221%22 height=%221%22/></svg>'">
        <button class="card-play" data-i="${i}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button class="like-btn ${likedSongIds.has(t.id) ? 'liked' : ''}" data-track-id="${t.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div class="card-info">
        <div class="card-title">${esc(t.title)}</div>
        <div class="card-sub">${esc(t.artist)}</div>
      </div>
      <div class="card-dur">${t.duration}</div>
    </div>`).join('');

  rGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.like-btn')) return;
      const i = parseInt((card as HTMLElement).dataset.i || '0');
      queue = [...tracks];
      queueIdx = i;
      playCurrent();
    });
  });

  rGrid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const trackId = (btn as HTMLElement).dataset.trackId!;
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        await toggleLike(track);
        btn.classList.toggle('liked', likedSongIds.has(trackId));
      }
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

// ===== PLAYER =====
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
  updatePlayerLikeBtn();

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

// ===== LYRICS =====
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
  updatePlayerLikeBtn();
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
}

// ===== SEARCH =====
async function doSearch(q: string) {
  if (!q.trim()) return;
  if (!currentUser) {
    showAuthPage();
    return;
  }
  showResults();
  setLoading();
  rTitle.textContent = `"${q}"`;
  searchInput2.value = q;
  activeFilter = 'all';
  rTabs.querySelectorAll('.r-tab').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.f === 'all');
  });

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    hideLoading();

    if (data.results?.length) {
      rTitle.textContent = `Hasil: "${q}"`;
      allTracks = data.results;
      rActions.classList.remove('hidden');
      applyFilter(activeFilter);
    } else {
      rTitle.textContent = '';
      allTracks = [];
      rActions.classList.add('hidden');
      rGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666">Tidak ditemukan hasil</div>';
    }
  } catch {
    hideLoading();
    rGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666">Gagal memuat</div>';
  }
}

// ===== EVENT LISTENERS =====

// Auth events
loginBtn.addEventListener('click', handleLogin);
loginPassword.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
registerBtn.addEventListener('click', handleRegister);
regPassword.addEventListener('keydown', e => { if (e.key === 'Enter') handleRegister(); });
forgotBtn.addEventListener('click', handleForgotPassword);
forgotUsername.addEventListener('keydown', e => { if (e.key === 'Enter') handleForgotPassword(); });
showRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthView('register'); });
showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthView('login'); });
forgotPassLink.addEventListener('click', (e) => { e.preventDefault(); showAuthView('forgot'); });
backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showAuthView('login'); });
logoutBtn.addEventListener('click', handleLogout);

// User menu
hamburgerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openSidebar();
});

userBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle('hidden');
});

document.addEventListener('click', () => {
  userDropdown.classList.add('hidden');
  closeSidebar();
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

sidebarLikedBtn.addEventListener('click', () => {
  closeSidebar();
  showLikedSongsPage();
});

sidebarPlaylistsBtn.addEventListener('click', () => {
  closeSidebar();
  showPlaylistsPage();
});

sidebarLogoutBtn.addEventListener('click', () => {
  closeSidebar();
  handleLogout();
});

// Desktop dropdown listeners
likedSongsMenuBtn.addEventListener('click', () => {
  userDropdown.classList.add('hidden');
  showLikedSongsPage();
});

playlistsMenuBtn.addEventListener('click', () => {
  userDropdown.classList.add('hidden');
  showPlaylistsPage();
});

logoutBtn.addEventListener('click', handleLogout);

// Player like/playlist buttons
pLikeBtn.addEventListener('click', async () => {
  if (queueIdx < 0 || queueIdx >= queue.length) return;
  await toggleLike(queue[queueIdx]);
});

pPlaylistBtn.addEventListener('click', () => {
  if (queueIdx < 0 || queueIdx >= queue.length) return;
  showAddToPlaylistModal(queue[queueIdx]);
});

fsLikeBtn.addEventListener('click', async () => {
  if (queueIdx < 0 || queueIdx >= queue.length) return;
  await toggleLike(queue[queueIdx]);
});

fsPlaylistBtn.addEventListener('click', () => {
  if (queueIdx < 0 || queueIdx >= queue.length) return;
  showAddToPlaylistModal(queue[queueIdx]);
});

// Back buttons
likedBack.addEventListener('click', () => {
  const prev = popPage();
  if (prev === 'results') showResults();
  else showLanding();
});

playlistsBack.addEventListener('click', () => {
  const prev = popPage();
  if (prev === 'results') showResults();
  else showLanding();
});

playlistDetailBack.addEventListener('click', () => {
  showPlaylistsPage();
});

// Create playlist button in playlists page
createPlaylistBtn.addEventListener('click', showCreatePlaylistModalFromButton);

// Playlist detail play all / shuffle
playlistDetailPlay.addEventListener('click', async () => {
  if (!currentPlaylistId) return;
  const tracks = currentPlaylistTracks.map(ps => ({
    id: ps.track_id, title: ps.title || 'Unknown', artist: ps.artist || 'Unknown',
    artistImg: '', album: ps.album || '', albumId: 0, duration: ps.duration || '',
    durSec: 0, thumb: ps.thumb || '', preview: '', views: 0, viewsText: '',
    link: '', isOfficial: false,
  }));
  if (tracks.length === 0) return;
  queue = tracks;
  queueIdx = 0;
  playCurrent();
});

playlistDetailShuffle.addEventListener('click', async () => {
  if (!currentPlaylistId) return;
  const tracks = currentPlaylistTracks.map(ps => ({
    id: ps.track_id, title: ps.title || 'Unknown', artist: ps.artist || 'Unknown',
    artistImg: '', album: ps.album || '', albumId: 0, duration: ps.duration || '',
    durSec: 0, thumb: ps.thumb || '', preview: '', views: 0, viewsText: '',
    link: '', isOfficial: false,
  }));
  if (tracks.length === 0) return;
  queue = [...tracks];
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  queueIdx = 0;
  playCurrent();
});

// Modals
addPlaylistClose.addEventListener('click', hideAddToPlaylistModal);
addPlaylistBackdrop.addEventListener('click', hideAddToPlaylistModal);
createPlaylistClose.addEventListener('click', hideCreatePlaylistModal);
createPlaylistBackdrop.addEventListener('click', hideCreatePlaylistModal);
savePlaylistBtn.addEventListener('click', handleCreatePlaylistFromModal);
newPlaylistName.addEventListener('keydown', e => { if (e.key === 'Enter') handleCreatePlaylistFromModal(); });

// Search
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
  if (isSeeking) return;
  if (repeatMode === 'one') {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  if (queueIdx < queue.length - 1) {
    queueIdx++;
    playCurrent();
  } else if (repeatMode === 'all') {
    queueIdx = 0;
    playCurrent();
  } else {
    icoPlay.style.display = '';
    icoPause.style.display = 'none';
    pBarFill.style.width = '0%';
    curTime.textContent = '0:00';
  }
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
  if (t.closest('.pb') || t.closest('.p-bar') || t.closest('.p-bar-fill') || t.closest('.p-vol') || t.closest('.player-buffer') || t.closest('.p-like-btn') || t.closest('.p-playlist-btn')) return;
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

fsLyricsToggle.addEventListener('click', toggleFsLyrics);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (addPlaylistModal && !addPlaylistModal.classList.contains('hidden')) {
      hideAddToPlaylistModal();
      return;
    }
    if (createPlaylistModal && !createPlaylistModal.classList.contains('hidden')) {
      hideCreatePlaylistModal();
      return;
    }
    if (fsOpen) closeFs();
    else if (lyricsOpen) closeLyrics();
  }
});

// ===== SHUFFLE =====
function toggleShuffle() {
  shuffleOn = !shuffleOn;
  shuffleBtn.classList.toggle('active', shuffleOn);
  fsShuffleBtn.classList.toggle('active', shuffleOn);
  if (shuffleOn && queue.length > 1) {
    const current = queue[queueIdx];
    const rest = queue.filter((_, i) => i !== queueIdx);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    queue = [current, ...rest];
    queueIdx = 0;
  }
}

shuffleBtn.addEventListener('click', toggleShuffle);
fsShuffleBtn.addEventListener('click', toggleShuffle);

// ===== REPEAT =====
function updateRepeatUI() {
  repeatBtn.classList.toggle('active', repeatMode !== 'off');
  fsRepeatBtn.classList.toggle('active', repeatMode !== 'off');
  repeatBadge.classList.toggle('hidden', repeatMode !== 'one');
  fsRepeatBadge.classList.toggle('hidden', repeatMode !== 'one');
}

function toggleRepeat() {
  if (repeatMode === 'off') repeatMode = 'all';
  else if (repeatMode === 'all') repeatMode = 'one';
  else repeatMode = 'off';
  updateRepeatUI();
}

repeatBtn.addEventListener('click', toggleRepeat);
fsRepeatBtn.addEventListener('click', toggleRepeat);

// ===== PLAY ALL / SHUFFLE ALL =====
playAllBtn.addEventListener('click', () => {
  if (!allTracks.length) return;
  queue = [...allTracks];
  queueIdx = 0;
  playCurrent();
});

shuffleAllBtn.addEventListener('click', () => {
  if (!allTracks.length) return;
  queue = [...allTracks];
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  queueIdx = 0;
  playCurrent();
});

// ===== VIEW TOGGLE =====
viewToggle.addEventListener('click', (e: MouseEvent) => {
  const btn = (e.target as HTMLElement).closest('.vt-btn') as HTMLElement;
  if (!btn) return;
  const v = btn.dataset.v as 'grid' | 'list';
  if (v === viewMode) return;
  viewMode = v;
  viewToggle.querySelectorAll('.vt-btn').forEach(b => b.classList.toggle('active', (b as HTMLElement).dataset.v === v));
  if (allTracks.length) {
    if (activeFilter === 'all') renderCards(allTracks);
  }
});

// ===== DRAG / SCRUB PROGRESS BAR =====
function initBarDrag(bar: HTMLElement, onSeek: (pct: number) => void) {
  let dragging = false;

  function seek(e: MouseEvent | TouchEvent) {
    const r = bar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(0.995, (clientX - r.left) / r.width));
    onSeek(pct);
  }

  bar.addEventListener('mousedown', (e) => {
    dragging = true;
    isSeeking = true;
    bar.classList.add('dragging');
    seek(e);
  });

  bar.addEventListener('touchstart', (e) => {
    dragging = true;
    isSeeking = true;
    bar.classList.add('dragging');
    seek(e);
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    seek(e);
  });

  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    seek(e);
  }, { passive: true });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      bar.classList.remove('dragging');
      setTimeout(() => { isSeeking = false; }, 200);
    }
  });

  document.addEventListener('touchend', () => {
    if (dragging) {
      dragging = false;
      bar.classList.remove('dragging');
      setTimeout(() => { isSeeking = false; }, 200);
    }
  });
}

initBarDrag(pBar, (pct) => {
  if (!audio.duration) return;
  audio.currentTime = pct * audio.duration;
});

initBarDrag(fsBar, (pct) => {
  if (!audio.duration) return;
  audio.currentTime = pct * audio.duration;
});

// ===== INIT =====
(async () => {
  await initAuth();
  if (currentUser) {
    await loadLikedSongs();
  }
})();
