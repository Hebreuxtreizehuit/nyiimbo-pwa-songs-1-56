const songListEl = document.getElementById('songList');
const searchInput = document.getElementById('searchInput');
const songNumberEl = document.getElementById('songNumber');
const songTitleEl = document.getElementById('songTitle');
const lyricsEl = document.getElementById('lyrics');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const showAllBtn = document.getElementById('showAllBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const increaseFontBtn = document.getElementById('increaseFontBtn');
const decreaseFontBtn = document.getElementById('decreaseFontBtn');
const installBtn = document.getElementById('installBtn');

let currentIndex = 0;
let filteredSongs = [...SONGS];
let showingFavorites = false;
let fontSize = Number(localStorage.getItem('lyricsFontSize') || 18);
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let deferredPrompt;

document.documentElement.style.setProperty('--lyrics-size', fontSize + 'px');

function saveFavorites(){ localStorage.setItem('favorites', JSON.stringify(favorites)); }
function isFavorite(number){ return favorites.includes(number); }

function renderList(){
  songListEl.innerHTML = '';
  filteredSongs.forEach(song => {
    const btn = document.createElement('button');
    btn.className = 'songItem' + (SONGS[currentIndex].number === song.number ? ' active' : '');
    btn.innerHTML = `<strong>${song.number}. ${song.title}</strong><small>${isFavorite(song.number) ? '★ Favorite' : 'Tap to open'}</small>`;
    btn.onclick = () => openSongByNumber(song.number);
    songListEl.appendChild(btn);
  });
}

function openSongByNumber(number){
  const idx = SONGS.findIndex(s => s.number === number);
  if(idx >= 0){ currentIndex = idx; renderSong(); renderList(); }
}

function renderSong(){
  const song = SONGS[currentIndex];
  songNumberEl.textContent = `Song ${song.number}`;
  songTitleEl.textContent = song.title;
  lyricsEl.textContent = song.lyrics;
  favoriteBtn.textContent = isFavorite(song.number) ? '★' : '☆';
  favoriteBtn.classList.toggle('on', isFavorite(song.number));
}

function applySearch(){
  const q = searchInput.value.trim().toLowerCase();
  filteredSongs = SONGS.filter(song => {
    const inFavorites = !showingFavorites || isFavorite(song.number);
    const matches = !q || String(song.number).includes(q) || song.title.toLowerCase().includes(q) || song.lyrics.toLowerCase().includes(q);
    return inFavorites && matches;
  });
  renderList();
}

favoriteBtn.onclick = () => {
  const n = SONGS[currentIndex].number;
  favorites = isFavorite(n) ? favorites.filter(x => x !== n) : [...favorites, n];
  saveFavorites(); renderSong(); applySearch();
};

favoritesBtn.onclick = () => { showingFavorites = true; applySearch(); };
showAllBtn.onclick = () => { showingFavorites = false; searchInput.value = ''; applySearch(); };
searchInput.oninput = applySearch;
prevBtn.onclick = () => { currentIndex = (currentIndex - 1 + SONGS.length) % SONGS.length; renderSong(); renderList(); };
nextBtn.onclick = () => { currentIndex = (currentIndex + 1) % SONGS.length; renderSong(); renderList(); };
increaseFontBtn.onclick = () => { fontSize = Math.min(30, fontSize + 2); localStorage.setItem('lyricsFontSize', fontSize); document.documentElement.style.setProperty('--lyrics-size', fontSize + 'px'); };
decreaseFontBtn.onclick = () => { fontSize = Math.max(14, fontSize - 2); localStorage.setItem('lyricsFontSize', fontSize); document.documentElement.style.setProperty('--lyrics-size', fontSize + 'px'); };

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; installBtn.classList.remove('hidden'); });
installBtn.onclick = async () => { if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt = null; installBtn.classList.add('hidden'); } };

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('sw.js')); }

renderSong();
renderList();
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}
