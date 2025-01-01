const ALBUM_URL =
  'https://striveschool-api.herokuapp.com/api/deezer/album/664052151';

let albumTracks = []; // Array globale per contenere le tracce dell'album
let playlist = [];
let currentTrackIndex = 0;
let idBase = 3068802251;
const audioElement = new Audio();

const playPauseButton = document.querySelector('#playPause');
const playPauseButton2 = document.querySelector('.play-pause');
const nextButton = document.querySelector('.bi-skip-end-fill');
const prevButton = document.querySelector('.bi-skip-start-fill');
const volumeControl = document.querySelector('.volume-control');
const volumeIcon = document.querySelector('.bi-volume-up');
const trackTitle = document.querySelector('#title');
const trackTitleLg = document.querySelector('#titleLg');
const trackArtistLg = document.querySelector('#artistLg');
const albumCover = document.querySelector('#albumCover img');
document.addEventListener('load', init());
function init() {
  updateHeartIcon();
  loadPlaylistFromLocalStorage();
  fetchSongs('664052151', idBase);
}

async function fetchSongs(albumId, id) {
  try {
    const response = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    );
    if (!response.ok) throw new Error('Errore nel recupero delle tracce');
    const data = await response.json();
    playlist = data.tracks.data;
    albumTracks = playlist;
    console.log(playlist);

    if (id) {
      currentTrackIndex = playlist.findIndex((track) => track.id === id);
      console.log(currentTrackIndex);

      loadTrack(currentTrackIndex);
    } else {
      loadTrack(currentTrackIndex);
    }
  } catch (error) {
    console.error('Errore:', error);
  }
}

function loadTrack(index) {
  const track = playlist[index];
  if (track) {
    audioElement.src = track.preview;
    trackTitle.innerText = `${track.title} - ${track.artist.name}`;
    trackTitleLg.innerHTML = `<a href="album.html?id=${track.album.id}" class="text-white">${track.title}</a>`;
    trackArtistLg.textContent = track.artist.name;
    albumCover.src = track.album.cover_medium;
    trackArtistLg.innerHTML = `<a href="artist.html?id=${track.artist.id}" class="text-white">${track.artist.name}</a>`;
  }
}

function updatePlayButton(isPlaying) {
  if (isPlaying) {
    playPauseButton.classList.remove('bi-play-fill');
    playPauseButton.classList.add('bi-pause-fill');
    playPauseButton2.classList.remove('bi-play-circle-fill');
    playPauseButton2.classList.remove('bi-play-fill');
    playPauseButton2.classList.add('bi-pause-fill');
  } else {
    playPauseButton.classList.remove('bi-pause-fill');
    playPauseButton.classList.add('bi-play-fill');
    playPauseButton2.classList.remove('bi-pause-fill');
    playPauseButton2.classList.add('bi-play-fill');
  }
}

function togglePlayPause() {
  if (audioElement.paused) {
    audioElement.play();
    updatePlayButton(true);
  } else {
    audioElement.pause();
    updatePlayButton(false);
  }
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  updateHeartIcon();
  console.log(savedPlaylist);
}

function prevTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  updateHeartIcon();
}

function updateHeartIcon() {
  const currentTrack = playlist[currentTrackIndex];
  const heartIcon = document.querySelectorAll('.heartIcon');

  heartIcon.forEach((element) => {
    if (savedPlaylist.some((track) => track.id === currentTrack.id)) {
      element.classList.remove('bi-heart');
      element.classList.add('bi-heart-fill');
      element.classList.add('text-success');
      element.classList.remove('text-white');
    } else {
      element.classList.add('bi-heart');
      element.classList.remove('bi-heart-fill');
      element.classList.remove('text-success');
      element.classList.add('text-white');
    }
  });

  const savedPlaylistContainer = document.getElementById('savedPlaylistItems');
  if (savedPlaylistContainer) {
    savedPlaylistContainer
      .querySelectorAll('.bi-heart-fill')
      .forEach((heart, index) => {
        if (savedPlaylist[index]) {
          heart.classList.add('text-success');
          heart.classList.remove('text-white');
        } else {
          heart.classList.remove('text-success');
          heart.classList.add('text-white');
        }
      });
  }
}

function handleVolumeChange() {
  audioElement.volume = volumeControl.value / 100;
}

function toggleMute() {
  if (audioElement.muted) {
    audioElement.muted = false;
    volumeControl.setAttribute('value', '100');
    volumeIcon.classList.remove('bi-volume-mute');
    volumeIcon.classList.add('bi-volume-up');
  } else {
    audioElement.muted = true;
    volumeControl.setAttribute('value', '0');

    volumeIcon.classList.remove('bi-volume-up');
    volumeIcon.classList.add('bi-volume-mute');
  }
}

volumeIcon.addEventListener('click', toggleMute);

playPauseButton.addEventListener('click', function () {
  togglePlayPause();
});

playPauseButton2.addEventListener('click', function () {
  togglePlayPause();
});

nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);
volumeControl.addEventListener('input', handleVolumeChange);

audioElement.addEventListener('ended', () => {
  nextTrackHandler();
});

const progressBar = document.createElement('input');
progressBar.type = 'range';
progressBar.min = 0;
progressBar.value = 0;
progressBar.className = 'progress-bar w-100';

const progressTime = document.createElement('span');
progressTime.textContent = '0:00';
progressTime.style.color = 'white';

const totalTime = document.createElement('span');
totalTime.textContent = '0:00';
totalTime.style.color = 'white';

const playerBar = document.querySelector('#playerBar .player-btns');
const timeContainer = document.createElement('div');
timeContainer.className = 'd-flex align-items-center text-white';
timeContainer.appendChild(progressTime);
timeContainer.appendChild(progressBar);
timeContainer.appendChild(totalTime);

playerBar.appendChild(timeContainer);

audioElement.addEventListener('timeupdate', () => {
  const currentTime = audioElement.currentTime;
  const duration = audioElement.duration || 0;

  progressBar.max = duration;
  progressBar.value = currentTime;

  progressTime.textContent = formatTime(currentTime);
  totalTime.textContent = formatTime(duration);
});

progressBar.addEventListener('input', () => {
  audioElement.currentTime = progressBar.value;
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

let isRandomActive = false;

const shuffleButton = document.querySelector('.bi-shuffle');

function getRandomTrackIndex() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * playlist.length);
  } while (randomIndex === currentTrackIndex);
  return randomIndex;
}

function nextTrackHandler() {
  if (isRandomActive) {
    currentTrackIndex = getRandomTrackIndex();
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  }
  loadTrack(currentTrackIndex);
  audioElement.play();
  updatePlayButton(true);
  updateHeartIcon();
}

shuffleButton.addEventListener('click', () => {
  isRandomActive = !isRandomActive;
  if (isRandomActive) {
    shuffleButton.classList.add('text-success');
  } else {
    shuffleButton.classList.remove('text-success');
  }
  console.log(`Modalità Random: ${isRandomActive ? 'ON' : 'OFF'}`);
});

let isRepeatActive = false;

const repeatButton = document.querySelector('.bi-repeat');

repeatButton.addEventListener('click', () => {
  isRepeatActive = !isRepeatActive;
  audioElement.loop = isRepeatActive;
  repeatButton.classList.toggle('text-success');
  console.log(`Modalità Repeat: ${isRepeatActive ? 'ON' : 'OFF'}`);
});

nextButton.removeEventListener('click', nextTrack);
nextButton.addEventListener('click', nextTrackHandler);

function savePlaylistToLocalStorage() {
  localStorage.setItem('savedPlaylist', JSON.stringify(savedPlaylist));
}

function loadPlaylistFromLocalStorage() {
  const savedData = localStorage.getItem('savedPlaylist');
  if (savedData) {
    try {
      savedPlaylist = JSON.parse(savedData);
    } catch (error) {
      console.error('Errore nel parsing di savedPlaylist:', error);
      savedPlaylist = [];
    }
    updateSavedPlaylistUI();
  } else {
    savedPlaylist = [];
  }
}

function updateSavedPlaylistUI() {
  const savedPlaylistContainer = document.getElementById('savedPlaylistItems');
  savedPlaylistContainer.innerHTML = '';

  savedPlaylist.forEach((track, index) => {
    const li = document.createElement('li');
    li.className =
      'text-white mb-2 d-flex align-items-center justify-content-between';

    const trackInfo = document.createElement('span');
    trackInfo.textContent = `• ${track.title} - ${track.artist.name}`;
    trackInfo.addEventListener('click', () => {
      const trackIndex = playlist.findIndex(
        (track) => track.id === savedPlaylist.id
      );
      if (trackIndex === -1) {
        playlist.push(track);
        currentTrackIndex = playlist.length - 1;
      } else {
        currentTrackIndex = trackIndex;
      }

      loadTrack(currentTrackIndex);
      audioElement.play();
      updatePlayButton(true);
      updateHeartIcon();
    });
    trackInfo.classList.add('trackInfo');

    const heart = document.createElement('i');
    heart.className = 'bi bi-heart-fill ms-3 text-success';
    heart.addEventListener('click', () => {
      removeTrackFromSavedPlaylist(index);
    });

    li.appendChild(trackInfo);
    li.appendChild(heart);

    savedPlaylistContainer.appendChild(li);
  });
}

function removeTrackFromSavedPlaylist(index) {
  const removedTrack = savedPlaylist.splice(index, 1)[0];

  savePlaylistToLocalStorage();
  updateSavedPlaylistUI();
  updateHeartIcon();
}