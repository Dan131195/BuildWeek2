function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
  }
  
  const artistId = new URLSearchParams(window.location.search).get('id');
  console.log(artistId);
  
  const topSongs = document.getElementById('topSongs');
  
  async function fetchArtist(id) {
    try {
      const response = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`
      );
      const data = await response.json();
      console.log('Artista ricevuto:', data);
      printArtist(data);
      await topSongsPrint(data);
    } catch (error) {
      console.error('Errore nel caricamento delle canzoni:', error);
    }
  }
  
  async function topSongsPrint(artist) {
    try {
      const response = await fetch(`${artist.tracklist}`);
      const data = await response.json();
      console.log('Tracce ricevute:', data);
  
      topSongs.innerHTML = '';
  
      for (let i = 0; i < 6; i++) {
        let listener1 = Math.floor(Math.random() * 3 + 1);
        let listener2 = Math.floor(Math.random() * 999)
          .toString()
          .padStart(3, '0');
        let listener3 = Math.floor(Math.random() * 999)
          .toString()
          .padStart(3, '0');
  
        const duration = formatDuration(data.data[i].duration);
  
        topSongs.innerHTML += `
          <div class="d-flex justify-content-between align-items-center py-2">
            <div class="d-flex align-items-center col-lg-7">
              <p id="trackNumber" class="text-secondary">${i + 1}</p>
              <img
                src="${data.data[i].album.cover_small}"
                class="imgArtist rounded-0 mx-3"
                alt="${data.data[i].title}"
              />
              <div>
                <p id="artistTrackTitle">${data.data[i].title}</p>
              </div>
            </div>
            <div class="d-none d-lg-flex col-lg-5 justify-content-between align-items-center text-secondary">
              <p class="durationAndListening">${listener1}.${listener2}.${listener3}</p>
              <p class="durationAndListening">${duration}</p>
            </div>
            <i class="bi bi-three-dots-vertical d-lg-none"></i>
          </div>`;
      }
    } catch (error) {
      console.error('Errore nel caricamento delle canzoni:', error);
      topSongs.innerHTML =
        '<p class="text-white">Errore nel caricamento delle tracce</p>';
    }
  }
  
  function printArtist(data) {
    artistCover.src = data.picture_big;
    artistName.textContent = data.name;
  
    let num1 = Math.floor(Math.random() * 9 + 1);
    let num2 = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0');
    let num3 = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0');
  
    monthly.innerHTML = `<span>${num1}</span>.<span>${num2}</span>.<span>${num3}</span>`;
  }
  
  function init() {
    console.log('Inizializzazione...');
    fetchArtist(artistId);
    setTimeout(() => {
      updateHeartIcon();
    }, 1000);
  }
  
  document.addEventListener('DOMContentLoaded', init);