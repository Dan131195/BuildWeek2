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
    li.classList.add('favList');

    const img = document.createElement('img');
    img.src = song.album.cover_small;
    img.alt = song.title;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.marginRight = '15px';

    const details = document.createElement('div');
    details.style.flex = '1';

    // Titolo della canzone
    const title = document.createElement('p');
    title.textContent = song.title;
    title.style.color = 'white';
    title.style.margin = '0';
    title.style.cursor = 'pointer'; // Cambia il cursore al passaggio del mouse
    title.style.textDecoration = 'none'; // Rimuove l'underline di default

    title.addEventListener('mouseover', () => {
      title.style.textDecoration = 'underline';
      title.style.textDecorationColor = 'white'; // Colore bianco per l'underline
    });

    title.addEventListener('mouseout', () => {
      title.style.textDecoration = 'none';
    });

    title.addEventListener('click', () => {
      const savedData = localStorage.getItem('savedPlaylist');
      if (savedData) {
        try {
          const savedPlaylist = JSON.parse(savedData);

          if (savedPlaylist.length === 0) {
            console.log('Nessuna canzone salvata nella playlist.');
            return;
          }

          playlist = [...savedPlaylist];
          currentTrackIndex = index;

          loadTrack(currentTrackIndex);
          audioElement.play();
          updatePlayButton(true);
          updateHeartIcon();
          console.log('Riproduzione della playlist salvata avviata.');
        } catch (error) {
          console.error('Errore nel parsing della playlist salvata:', error);
        }
      } else {
        console.log('Nessuna playlist salvata trovata in localStorage.');
      }
    });

    // Artista della canzone
    const author = document.createElement('p');
    author.textContent = song.artist.name;
    author.style.color = '#ccc';
    author.style.margin = '0';
    author.style.cursor = 'pointer'; // Cambia il cursore al passaggio del mouse
    author.style.textDecoration = 'none'; // Rimuove l'underline di default

    author.addEventListener('mouseover', () => {
      author.style.textDecoration = 'underline';
      author.style.textDecorationColor = 'white'; // Colore bianco per l'underline
    });

    author.addEventListener('mouseout', () => {
      author.style.textDecoration = 'none';
    });

    author.addEventListener('click', () => {
      // Reindirizza alla pagina dell'artista
      window.location.href = `artist.html?id=${song.artist.id}`;
    });

    details.appendChild(title);
    details.appendChild(author);

    const heartIcon = document.createElement('i');
    heartIcon.className = 'bi bi-heart-fill ms-3 text-success';
    heartIcon.style.cursor = 'pointer';
    heartIcon.addEventListener('click', () => {
      removeTrackFromSavedPlaylist(index);
    });

    li.appendChild(img);
    li.appendChild(details);
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