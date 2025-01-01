const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const generateRandomListeners = () => {
  return {
    millions: Math.floor(Math.random() * 3 + 1),
    thousands1: Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0'),
    thousands2: Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0'),
  };
};

const API_BASE_URL = 'https://striveschool-api.herokuapp.com/api/deezer';
const MAX_TOP_SONGS = 6;

const elements = {
  topSongs: document.getElementById('topSongs'),
  artistCover: document.getElementById('artistCover'),
  artistName: document.getElementById('artistName'),
  monthly: document.getElementById('monthly'),
  playButton: document.getElementById('playButton'),
  artistImgRounded: document.getElementById('artistImgRounded'),
};
class ArtistPage {
  constructor() {
    this.artistId = new URLSearchParams(window.location.search).get('id');
    this.tracks = [];
  }

  async init() {
    try {
      console.log('Inizializzazione...');
      await this.loadArtistData();
      this.setupEventListeners();
    } catch (error) {
      console.error("Errore durante l'inizializzazione:", error);
    }
  }

  setupEventListeners() {
    elements.playButton.addEventListener('click', () => {
      if (this.tracks.length > 0) {
        if (playlist.length === 0) {
          playlist = [...this.tracks];
        }
        togglePlayPause();
      }
    });
  }

  async loadArtistData() {
    try {
      const artist = await this.fetchArtist();
      this.renderArtist(artist);
      await this.renderTopSongs(artist);
    } catch (error) {
      console.error("Errore nel caricamento dei dati dell'artista:", error);
    }
  }

  async fetchArtist() {
    const response = await fetch(`${API_BASE_URL}/artist/${this.artistId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Artista ricevuto:', data);
    return data;
  }

  renderArtist(artist) {
    const { millions, thousands1, thousands2 } = generateRandomListeners();

    elements.artistCover.src = artist.picture_big;
    elements.artistName.textContent = artist.name;
    elements.monthly.innerHTML = `<span>${millions}</span>.<span>${thousands1}</span>.<span>${thousands2}</span>`;
    elements.artistImgRounded.src = artist.picture;
    const artistSideName = document.getElementById('artistSideName');
    artistSideName.textContent = artist.name;
  }

  async renderTopSongs(artist) {
    try {
      const response = await fetch(artist.tracklist);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Tracce ricevute:', data);

      this.tracks = data.data.slice(0, MAX_TOP_SONGS);

      // Inizializza la playlist globale con le tracce dell'artista
      playlist = [...this.tracks];
      currentTrackIndex = 0;

      elements.topSongs.innerHTML = this.tracks
        .map((track, index) => this.createTrackHTML(track, index))
        .join('');

      this.tracks.forEach((track, index) => {
        const trackElement = document.getElementById(`track-${index}`);
        if (trackElement) {
          trackElement.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            audioElement.play();
            updatePlayButton(true);
            this.updateTrackStyles();
          });
        }
      });

      loadTrack(0);
      updateHeartIcon();
    } catch (error) {
      console.error('Errore nel caricamento delle canzoni:', error);
      elements.topSongs.innerHTML =
        '<p class="text-white">Errore nel caricamento delle tracce</p>';
    }
  }

  createTrackHTML(track, index) {
    const { millions, thousands1, thousands2 } = generateRandomListeners();
    const duration = formatDuration(track.duration);

    return `
      <div id="track-${index}" class="d-flex justify-content-between align-items-center py-2 track-item" style="cursor: pointer;">
        <div class="d-flex align-items-center col-lg-7">
          <p class="text-secondary track-number">${index + 1}</p>
          <img
            src="${track.album.cover_small}"
            class="imgArtist rounded-0 mx-3"
            alt="${track.title}"
          />
          <div>
            <p class="track-title">${track.title}</p>
          </div>
        </div>
        <div class="d-none d-lg-flex col-lg-5 justify-content-between align-items-center text-secondary">
          <p class="durationAndListening">${millions}.${thousands1}.${thousands2}</p>
          <p class="durationAndListening">${duration}</p>
        </div>
        <i class="bi bi-three-dots-vertical d-lg-none"></i>
      </div>
    `;
  }

  updateTrackStyles() {
    this.tracks.forEach((_, index) => {
      const trackElement = document.getElementById(`track-${index}`);
      if (trackElement) {
        trackElement.classList.remove('playing');
        trackElement.querySelector('.track-title').style.color = '';
        trackElement.querySelector('.track-number').style.color = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const artistPage = new ArtistPage();
  artistPage.init();
});

audioElement.addEventListener('play', () => {
  const artistPage = window.artistPage;
  if (artistPage) {
    artistPage.updateTrackStyles();
    artistPage.highlightCurrentTrack();
  }
});