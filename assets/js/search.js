const searchApiUrl =
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=';

const searchInput = document.querySelector('input[type="text"]');
const searchResultsContainer = document.getElementById('searchResults');
const audioPlayer = new Audio();

document.addEventListener('load', init());
function init() {
  changeColor();
  setTimeout(() => {
    updateHeartIcon();
  }, 500);
}
function getRandomColor() {
  const colors = [
    '#E13300',
    '#1E3264',
    '#E8115C',
    '#158A08',
    '#BC5800',
    '#8C67AC',
    '#777777',
    '#503750',
    '#0D73EC',
    '#8400E7',
    '#006450',
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function changeColor() {
  const cards = document.querySelectorAll('.searchCard');

  cards.forEach((card) => {
    const randomColor = getRandomColor();
    card.style.backgroundColor = randomColor;
  });
}

async function searchSongs(query) {
  try {
    const response = await fetch(`${searchApiUrl}${query}`);
    const data = await response.json();
    console.log('Canzoni trovate:', data.data);
    return data.data;
  } catch (error) {
    console.error('Errore nella ricerca delle canzoni:', error);
    return [];
  }
}

async function handleSearch(event) {
  const query = event.target.value.trim();
  const browseSection = document.getElementById('browseSection');
  const browseContainer = document.getElementById('browseContainer');

  browseSection.style.display = 'none';
  browseContainer.style.display = 'none';
  if (!query) {
    searchResultsContainer.innerHTML = '';
    browseSection.style.display = 'block';
    browseContainer.style.display = 'flex';
    return;
  }

  const results = await searchSongs(query);

  renderSearchResults(results);
}

function renderSearchResults(results) {
  searchResultsContainer.innerHTML = '';

  if (results.length === 0) {
    searchResultsContainer.innerHTML =
      "<p class='text-white'>Nessun risultato trovato</p>";
    return;
  }
  i;
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';

  results.forEach((song) => {
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
    title.textContent = `Titolo: ${song.title}`;
    title.style.color = 'white';
    title.style.margin = '0';

    const author = document.createElement('p');
    author.textContent = `Autore: ${song.artist.name}`;
    author.style.color = '#ccc';
    author.style.margin = '0';

    const duration = document.createElement('p');
    const minutes = Math.floor(song.duration / 60);
    const seconds = song.duration % 60;
    duration.textContent = `Durata: ${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
    duration.style.color = '#aaa';
    duration.style.margin = '0';

    details.appendChild(title);
    details.appendChild(author);
    details.appendChild(duration);

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.style.marginLeft = '15px';
    playButton.style.backgroundColor = '#1db954';
    playButton.style.color = 'white';
    playButton.style.border = 'none';
    playButton.style.borderRadius = '5px';

    playButton.addEventListener('click', () => {
      let id = song.id;
      fetchSongs(`${song.album.id}`, id);
      console.log(playlist);
      updateHeartIcon();

      console.log(`Riproduzione di: ${song.title} - ${song.artist.name}`);
    });

    li.appendChild(img);
    li.appendChild(details);
    li.appendChild(playButton);

    ul.appendChild(li);
  });

  searchResultsContainer.appendChild(ul);
}

searchInput.addEventListener('input', handleSearch);