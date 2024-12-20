let savedPlaylist = []; // Array per i brani preferiti
const heartIcon = document.querySelectorAll('.filledHeart');

// Funzione per aggiungere o rimuovere il brano dalla playlist
function togglePlaylist() {
  const currentTrack = playlist[currentTrackIndex];

  // Controlla se il brano è già nella playlist
  const trackIndex = savedPlaylist.findIndex(
    (track) => track.id === currentTrack.id
  );

  if (trackIndex === -1) {
    // Aggiungi il brano alla lista preferiti
    savedPlaylist.push(currentTrack);
    console.log(`Aggiunto alla playlist: ${currentTrack.title}`);
  } else {
    // Rimuovi il brano dalla lista preferiti
    savedPlaylist.splice(trackIndex, 1);
    console.log(`Rimosso dalla playlist: ${currentTrack.title}`);
  }

  // Salva la playlist nel localStorage
  savePlaylistToLocalStorage();

  // Aggiorna le icone dei cuori
  updateHeartIcon();

  // Aggiorna la lista salvata
  updateSavedPlaylistUI();
}

// Aggiunge o rimuove il brano preferito al click sull'icona
heartIcon.forEach((element) => {
  element.addEventListener('click', togglePlaylist);
});
