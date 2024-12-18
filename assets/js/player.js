const ALBUM_URL =
  'https://striveschool-api.herokuapp.com/api/deezer/album/75621062';

let playlist = []; // Array delle tracce
let currentTrackIndex = 0; // Indice della traccia corrente
const audioElement = new Audio(); // Elemento audio

// Selezione degli elementi HTML
const playPauseButton = document.querySelector('#playPause'); // Bottone Play/Pause
const playPauseButton2 = document.querySelector('.play-pause'); // Bottone Play/Pause
const nextButton = document.querySelector('.bi-skip-end-fill'); // Successivo
const prevButton = document.querySelector('.bi-skip-start-fill'); // Precedente
const volumeControl = document.querySelector('.volume-control'); // Controllo volume
const volumeIcon = document.querySelector('.bi-volume-up');
const trackTitle = document.querySelector('#title'); // Titolo
const trackTitleLg = document.querySelector('#titleLg'); // Titolo
const trackArtistLg = document.querySelector('#artistLg'); // Artista
const albumCover = document.querySelector('#albumCover img'); // Copertina album
const heartIcon = document.getElementById('filledHeart');

// Funzione per recuperare le tracce dall'API
async function fetchSongs() {
  try {
    const response = await fetch(ALBUM_URL);
    if (!response.ok) throw new Error('Errore nel recupero delle tracce');
    const data = await response.json();
    playlist = data.tracks.data; // Salva le tracce
    loadTrack(currentTrackIndex);
  } catch (error) {
    console.error('Errore:', error);
  }
}

// Carica una traccia nella UI e nel player
function loadTrack(index) {
  const track = playlist[index];
  if (track) {
    audioElement.src = track.preview; // Imposta la sorgente audio
    trackTitle.innerText = `${track.title} - ${track.artist.name}`;
    trackTitleLg.textContent = track.title; // Aggiorna il titolo
    trackArtistLg.textContent = track.artist.name; // Aggiorna l'artista
    albumCover.src = track.album.cover_medium; // Aggiorna la copertina
  }
}

// Aggiorna lo stato del bottone Play/Pause
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

// Gestisce Play/Pause
function togglePlayPause() {
  if (audioElement.paused) {
    audioElement.play();
    updatePlayButton(true); // Aggiorna bottone a "Pausa"
  } else {
    audioElement.pause();
    updatePlayButton(false); // Aggiorna bottone a "Play"
  }
}

// Passa al brano successivo
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  updateHeartIcon();
  console.log(savedPlaylist);
}

// Passa al brano precedente
function prevTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  updateHeartIcon();
}

function updateHeartIcon() {
  const currentTrack = playlist[currentTrackIndex];

  if (savedPlaylist.some((track) => track.id === currentTrack.id)) {
    heartIcon.classList.add('text-success'); // Cuore verde
    heartIcon.classList.remove('text-white');
  } else {
    heartIcon.classList.remove('text-success');
    heartIcon.classList.add('text-white');
  }
}

// Gestisce il controllo del volume
function handleVolumeChange() {
  audioElement.volume = volumeControl.value / 100;
}

// Funzione per gestire il muto
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

// Event listeners
playPauseButton.addEventListener('click', function () {
  togglePlayPause();
});

playPauseButton2.addEventListener('click', function () {
  togglePlayPause();
});

nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);
volumeControl.addEventListener('input', handleVolumeChange);

// Passa automaticamente alla prossima traccia quando la canzone finisce
audioElement.addEventListener('ended', () => {
  nextTrackHandler();
});

// Caricamento iniziale delle tracce
fetchSongs();

// Creazione della barra del tempo
const progressBar = document.createElement('input');
progressBar.type = 'range';
progressBar.min = 0;
progressBar.value = 0;
progressBar.className = 'progress-bar w-100';

// Elementi aggiuntivi per tempo trascorso e durata totale
const progressTime = document.createElement('span');
progressTime.textContent = '0:00'; // Tempo iniziale
progressTime.style.color = 'white';

const totalTime = document.createElement('span');
totalTime.textContent = '0:00'; // Durata iniziale
totalTime.style.color = 'white';

// Aggiunta al DOM nel container esistente
const playerBar = document.querySelector('#playerBar .player-btns');
const timeContainer = document.createElement('div');
timeContainer.className = 'd-flex align-items-center text-white';
timeContainer.appendChild(progressTime);
timeContainer.appendChild(progressBar);
timeContainer.appendChild(totalTime);

playerBar.appendChild(timeContainer);

// Funzione per aggiornare la barra del tempo
audioElement.addEventListener('timeupdate', () => {
  const currentTime = audioElement.currentTime;
  const duration = audioElement.duration || 0;

  progressBar.max = duration;
  progressBar.value = currentTime;

  progressTime.textContent = formatTime(currentTime);
  totalTime.textContent = formatTime(duration);
});

// Permette di saltare a un punto specifico della traccia
progressBar.addEventListener('input', () => {
  audioElement.currentTime = progressBar.value;
});

// Funzione per formattare il tempo in mm:ss
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

let isRandomActive = false;

const shuffleButton = document.querySelector('.bi-shuffle'); // Bottone Shuffle esistente

// Funzione per ottenere un indice casuale diverso da quello corrente
function getRandomTrackIndex() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * playlist.length);
  } while (randomIndex === currentTrackIndex); // Evita di ripetere la traccia corrente
  return randomIndex;
}

// Modifica del comportamento del pulsante Next
function nextTrackHandler() {
  if (isRandomActive) {
    currentTrackIndex = getRandomTrackIndex(); // Seleziona una traccia casuale
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length; // Traccia successiva normale
  }
  loadTrack(currentTrackIndex);
  audioElement.play();
  updatePlayButton(true);
  updateHeartIcon();
}

// Attiva/disattiva la modalità Random
shuffleButton.addEventListener('click', () => {
  isRandomActive = !isRandomActive; // Cambia lo stato random
  if (isRandomActive) {
    shuffleButton.classList.add('text-success'); // Aggiunge il verde
  } else {
    shuffleButton.classList.remove('text-success'); // Rimuove il verde
  }
  console.log(`Modalità Random: ${isRandomActive ? 'ON' : 'OFF'}`);
});

let isRepeatActive = false; // Stato per il bottone Repeat

// Selezione del bottone Repeat
const repeatButton = document.querySelector('.bi-repeat');

// Gestione del pulsante Repeat
repeatButton.addEventListener('click', () => {
  isRepeatActive = !isRepeatActive; // Toggle stato repeat
  audioElement.loop = isRepeatActive; // Attiva/disattiva la proprietà loop
  repeatButton.classList.toggle('text-success'); // Cambia colore per indicare stato attivo
  console.log(`Modalità Repeat: ${isRepeatActive ? 'ON' : 'OFF'}`);
});

// Rimuovi l'evento esistente e aggiorna Next
nextButton.removeEventListener('click', nextTrack); // Rimuovi il vecchio evento
nextButton.addEventListener('click', nextTrackHandler); // Aggiungi il nuovo evento