const savedSongsContainer = document.getElementById('savedSongsContainer');

// Funzione per caricare le canzoni salvate nel localStorage
function loadSavedSongs() {
  const savedData = localStorage.getItem('savedPlaylist');
  if (savedData) {
    try {
      const savedPlaylist = JSON.parse(savedData);
      renderSavedSongs(savedPlaylist);
    } catch (error) {
      console.error('Errore nel parsing della playlist salvata:', error);
      savedSongsContainer.innerHTML =
        "<p class='text-white'>Errore nel caricamento della libreria</p>";
    }
  } else {
    savedSongsContainer.innerHTML =
      "<p class='text-white'>Nessuna canzone salvata nella libreria</p>";
  }
}

// Funzione per mostrare le canzoni salvate
function renderSavedSongs(songs) {
  savedSongsContainer.innerHTML = '';

  if (songs.length === 0) {
    savedSongsContainer.innerHTML =
      "<p class='text-white'>Nessuna canzone salvata</p>";
    return;
  }

  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';

  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginBottom = '15px';

    const img = document.createElement('img');
    img.src = song.album.cover_small;
    img.alt = song.title;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.marginRight = '15px';

    const details = document.createElement('div');
    details.style.flex = '1';

    const title = document.createElement('p');
    title.textContent = song.title;
    title.style.color = 'white';
    title.style.margin = '0';

    const author = document.createElement('p');
    author.textContent = song.artist.name;
    author.style.color = '#ccc';
    author.style.margin = '0';

    details.appendChild(title);
    details.appendChild(author);

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.style.marginLeft = '15px';
    playButton.style.backgroundColor = '#1db954';
    playButton.style.color = 'white';
    playButton.style.border = 'none';
    playButton.style.borderRadius = '5px';

    playButton.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      audioElement.play();
      updatePlayButton(true);
    });

    const heartIcon = document.createElement('i');
    heartIcon.className = 'bi bi-heart-fill ms-3 text-success';
    heartIcon.style.cursor = 'pointer';
    heartIcon.addEventListener('click', () => {
      removeTrackFromSavedPlaylist(index);
    });

    li.appendChild(img);
    li.appendChild(details);
    li.appendChild(playButton);
    li.appendChild(heartIcon);

    ul.appendChild(li);
  });

  savedSongsContainer.appendChild(ul);
}

// Rimuove un brano dalla playlist salvata
function removeTrackFromSavedPlaylist(index) {
  const savedData = localStorage.getItem('savedPlaylist');
  if (savedData) {
    let savedPlaylist = JSON.parse(savedData);
    savedPlaylist.splice(index, 1);
    localStorage.setItem('savedPlaylist', JSON.stringify(savedPlaylist));
    loadSavedSongs(); // Ricarica le canzoni salvate
  }
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
  console.log('Pagina La Mia Libreria inizializzata.');
  loadSavedSongs();
});