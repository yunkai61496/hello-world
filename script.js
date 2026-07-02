const playlist = [
  {
    title: "Moonlit Drift",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Velvet Skyline",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Midnight Echo",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

const audio = document.getElementById("audio");
const playlistList = document.getElementById("playlistList");
const titleElement = document.getElementById("trackTitle");
const artistElement = document.getElementById("trackArtist");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("duration");
const progressElement = document.getElementById("progress");
const volumeElement = document.getElementById("volume");

let currentTrackIndex = 0;
let isPlaying = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderPlaylist() {
  playlistList.innerHTML = playlist
    .map((track, index) => {
      const activeClass = index === currentTrackIndex ? "active" : "";
      return `
        <li>
          <button class="playlist-item ${activeClass}" type="button" data-index="${index}">
            <span class="track-meta">
              <strong>${track.title}</strong>
              <span>${track.artist}</span>
            </span>
            <span class="track-badge">0${index + 1}</span>
          </button>
        </li>
      `;
    })
    .join("");
}

function updateTrackInfo() {
  const track = playlist[currentTrackIndex];
  titleElement.textContent = track.title;
  artistElement.textContent = track.artist;
}

function updatePlayButton() {
  playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
  playPauseBtn.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
}

function loadTrack(index, autoplay = false) {
  currentTrackIndex = index;
  const track = playlist[currentTrackIndex];
  audio.src = track.src;
  updateTrackInfo();
  renderPlaylist();

  if (autoplay) {
    audio.play().catch(() => {
      isPlaying = false;
      updatePlayButton();
    });
  }
}

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {
      isPlaying = false;
      updatePlayButton();
    });
  } else {
    audio.pause();
  }
});

prevBtn.addEventListener("click", () => {
  const index = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(index, isPlaying);
});

nextBtn.addEventListener("click", () => {
  const index = (currentTrackIndex + 1) % playlist.length;
  loadTrack(index, isPlaying);
});

playlistList.addEventListener("click", (event) => {
  const button = event.target.closest(".playlist-item");
  if (!button) {
    return;
  }

  const index = Number(button.dataset.index);
  loadTrack(index, true);
});

progressElement.addEventListener("input", (event) => {
  audio.currentTime = Number(event.target.value);
});

volumeElement.addEventListener("input", (event) => {
  audio.volume = Number(event.target.value);
});

audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayButton();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayButton();
});

audio.addEventListener("timeupdate", () => {
  progressElement.value = audio.currentTime;
  currentTimeElement.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  durationElement.textContent = formatTime(audio.duration);
  progressElement.max = audio.duration || 100;
});

audio.addEventListener("ended", () => {
  const index = (currentTrackIndex + 1) % playlist.length;
  loadTrack(index, true);
});

renderPlaylist();
updateTrackInfo();
updatePlayButton();
audio.volume = Number(volumeElement.value);
loadTrack(0, false);
