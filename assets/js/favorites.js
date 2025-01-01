let savedPlaylist = [];
const heartIcon = document.querySelectorAll('.filledHeart');

const favoritesSong = document.querySelector('.openCloseFav');
const savedPlaylistContainer = document.getElementById(
  'savedPlaylistContainer'
);
favoritesSong.addEventListener('click', function () {
  savedPlaylistContainer.classList.toggle('d-none');
  savedPlaylistContainer.classList.toggle('d-block');
});

function togglePlaylist() {
  const currentTrack = playlist[currentTrackIndex];

  const trackIndex = savedPlaylist.findIndex(
    (track) => track.id === currentTrack.id
  );

  if (trackIndex === -1) {
    savedPlaylist.push(currentTrack);
    console.log(`Aggiunto alla playlist: ${currentTrack.title}`);
  } else {
    savedPlaylist.splice(trackIndex, 1);
    console.log(`Rimosso dalla playlist: ${currentTrack.title}`);
  }

  savePlaylistToLocalStorage();

  updateHeartIcon();

  updateSavedPlaylistUI();
}

heartIcon.forEach((element) => {
  element.addEventListener('click', togglePlaylist);
});