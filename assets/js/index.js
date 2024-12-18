let savedPlaylist = []; // Array per i brani preferiti

// Funzione per aggiungere o rimuovere il brano dalla playlist
function togglePlaylist() {
  const currentTrack = playlist[currentTrackIndex];

  // Controlla se il brano è già nella playlist
  const trackIndex = savedPlaylist.findIndex(
    (track) => track.id === currentTrack.id
  );

  if (trackIndex === -1) {
    // Se non è nella playlist, lo aggiunge
    savedPlaylist.push(currentTrack);
    console.log(`Aggiunto alla playlist: ${currentTrack.title}`);
  } else {
    // Se è già nella playlist, lo rimuove
    savedPlaylist.splice(trackIndex, 1);
    console.log(`Rimosso dalla playlist: ${currentTrack.title}`);
  }

  // Aggiorna lo stile dell'icona
  updateHeartIcon(trackIndex === -1);
}

// Funzione per aggiornare lo stile del cuore
function updateHeartIcon(isAdded) {
  if (isAdded) {
    heartIcon.classList.add('text-success'); // Cuore verde dopo il click
    heartIcon.classList.remove('text-white');
  } else {
    heartIcon.classList.remove('text-success');
    heartIcon.classList.add('text-white'); // Torna bianco se rimosso
  }
}

// Aggiunge o rimuove il brano preferito al click sull'icona
heartIcon.addEventListener('click', togglePlaylist);

const randomSong = document.getElementById('randomSong');