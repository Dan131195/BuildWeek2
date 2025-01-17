const albumId = new URLSearchParams(window.location.search).get('id');

const songsContainer = document.getElementById('songsContainer');

const albumImg = document.getElementById('albumImage');
const albumTitle = document.getElementById('albumTitle');
const artistName = document.getElementById('artistName');
const albumReleaseSm = document.getElementById('albumReleaseSm');
const albumReleaseLg = document.getElementById('albumReleaseLg');
const songsNum = document.getElementById('songsNum');
const albumDuration = document.getElementById('albumDuration');
const albumHeart = document.querySelector('.albumHeart');

async function fetchAlbum(albumId) {
  try {
    const response = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    );
    if (!response.ok) throw new Error('Errore nel recupero delle tracce');
    const data = await response.json();
    playlist = data.tracks.data;
    albumTracks = playlist;
    console.log(playlist);
    loadTrack(currentTrackIndex);
    printAlbum(data);
    renderSongs(playlist);
  } catch (error) {
    console.error('Errore:', error);
  }
}

function printAlbum(data) {
  albumImg.src = data.cover_medium || data.cover;
  albumTitle.textContent = data.title;
  artistName.textContent = data.artist.name;
  const year = data.release_date.substring(0, 4);
  albumReleaseSm.textContent = year;
  albumReleaseLg.innerText = year;
  songsNum.textContent = data.tracks.data.length;
  albumDuration.textContent = formatDuration(data.duration);
}

function renderSongs(songs) {
  songsContainer.innerHTML = '';

  if (songs.length === 0) {
    songsContainer.innerHTML =
      "<p class='text-white'>Nessuna canzone trovata</p>";
    return;
  }

  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.classList.add('container-fluid');
  ul.style.padding = '0';
  let i = 0;
  songs.forEach((song) => {
    const li = document.createElement('li');
    li.classList.add('container-fluid', 'row');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginBottom = '15px';

    const index = document.createElement('div');
    index.classList.add('col-1');
    const newP = document.createElement('p');
    i++;
    newP.innerText = i;

    index.appendChild(newP);

    const details = document.createElement('div');
    details.classList.add('col-6');

    const title = document.createElement('p');
    title.textContent = `${song.title}`;
    title.style.color = 'white';
    title.style.margin = '0';
    title.classList.add('songTitleInAlbum');
    title.addEventListener('click', () => {
      const trackIndex = playlist.findIndex((track) => track.id === song.id);
      if (trackIndex === -1) {
        playlist.push(song);
        currentTrackIndex = playlist.length - 1;
      } else {
        currentTrackIndex = trackIndex;
      }

      loadTrack(currentTrackIndex);
      audioElement.play();
      updatePlayButton(true);
      updateHeartIcon();
    });

    const artist = document.createElement('p');
    artist.textContent = song.artist.name;
    artist.style.color = '#aaa';
    artist.style.margin = '0';

    const reproduction = document.createElement('div');
    reproduction.classList.add('col-3');

    const totalP = document.createElement('p');
    totalP.textContent = Math.floor(Math.random() * 9999999);
    reproduction.appendChild(totalP);

    const duration = document.createElement('div');
    duration.classList.add('col-2');

    const durationP = document.createElement('p');
    durationP.textContent = formatDuration(song.duration);
    duration.appendChild(durationP);

    details.appendChild(title);
    details.appendChild(artist);

    li.appendChild(index);
    li.appendChild(details);
    li.appendChild(reproduction);
    li.appendChild(duration);
    ul.appendChild(li);
  });

  songsContainer.appendChild(ul);
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

function init() {
  console.log('Inizializzazione...');
  fetchAlbum(albumId);
  setTimeout(() => {
    updateHeartIcon();
  }, 500);
}
const playAlbumButton = document.getElementById('playAlbum');

playAlbumButton.addEventListener('click', () => {
  if (!playlist || playlist.length === 0) {
    console.error('Playlist non trovata o vuota!');
    return;
  }

  playlist = [...albumTracks];
  currentTrackIndex = 0;
  renderSongs(playlist);
  loadTrack(currentTrackIndex);
  audioElement.play();
  updatePlayButton(true);
  updateHeartIcon();
});

document.addEventListener('DOMContentLoaded', init);

albumHeart.addEventListener('click', function () {
  albumHeart.classList.toggle('text-success');
});