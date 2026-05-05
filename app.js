let currentSongIndex = 0;
let fontSize = 18;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const songListEl = document.getElementById("songList");
const songNumberEl = document.getElementById("songNumber");
const songTitleEl = document.getElementById("songTitle");
const songContentEl = document.getElementById("songContent");
const searchInput = document.getElementById("searchInput");
const favoriteBtn = document.getElementById("favoriteBtn");

function renderSongList(list = songs) {
  songListEl.innerHTML = "";

  list.forEach((song, index) => {
    const item = document.createElement("div");
    item.className = "song-item";
    item.innerHTML = `
      <strong>${song.number}. ${song.title}</strong>
      <small>Tap to open</small>
    `;

    item.onclick = () => {
      currentSongIndex = songs.findIndex(s => s.number === song.number);
      renderSong();
      renderSongList(list);
    };

    if (songs[currentSongIndex]?.number === song.number) {
      item.classList.add("active");
    }

    songListEl.appendChild(item);
  });
}

function renderSong() {
  const song = songs[currentSongIndex];

  if (!song) return;

  songNumberEl.textContent = "Song " + song.number;
  songTitleEl.textContent = song.title;
  songContentEl.textContent = song.lyrics;
  songContentEl.style.fontSize = fontSize + "px";

  favoriteBtn.textContent = favorites.includes(song.number) ? "★" : "☆";
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(value) ||
    String(song.number).includes(value) ||
    song.lyrics.toLowerCase().includes(value)
  );

  renderSongList(filtered);
});

document.getElementById("prevBtn").onclick = () => {
  if (currentSongIndex > 0) {
    currentSongIndex--;
    renderSong();
    renderSongList();
  }
};

document.getElementById("nextBtn").onclick = () => {
  if (currentSongIndex < songs.length - 1) {
    currentSongIndex++;
    renderSong();
    renderSongList();
  }
};

favoriteBtn.onclick = () => {
  const song = songs[currentSongIndex];

  if (favorites.includes(song.number)) {
    favorites = favorites.filter(id => id !== song.number);
  } else {
    favorites.push(song.number);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderSong();
};

document.getElementById("allBtn").onclick = () => {
  renderSongList(songs);
};

document.getElementById("favoritesBtn").onclick = () => {
  const favSongs = songs.filter(song => favorites.includes(song.number));
  renderSongList(favSongs);
};

document.getElementById("increaseFont").onclick = () => {
  fontSize += 2;
  renderSong();
};

document.getElementById("decreaseFont").onclick = () => {
  if (fontSize > 12) fontSize -= 2;
  renderSong();
};

// Start app
renderSongList();
renderSong();