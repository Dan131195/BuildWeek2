const randomSong = document.getElementById('randomSong');
let randomImg = document.getElementById('randomImg');
let randomSongTitle = document.getElementById('randomSongTitle');
let randomArtist = document.getElementById('randomArtist');
const hideDiv = document.getElementById('hideDiv');
const randomSongBtn = document.getElementById('randomSongBtn');

hideDiv.addEventListener('click', function (e) {
  e.preventDefault();
  randomSong.classList.add('d-none');
});

function fetchAndDisplayData() {
  // Genera un numero intero casuale per 'query'
  let query = Math.floor(Math.random() * 1000 + 1);
  const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/artist/${query}/top?limit=1`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      const songs = data.data;
      if (songs.length === 0) {
        fetchAndDisplayData();
      }
      console.log(songs);

      //const songs = data;
      songs.forEach((item) => {
        randomImg.src = item.album.cover;
        randomImg.alt = item.album.title;
        randomSongTitle.textContent = item.album.title;
        randomArtist.textContent = item.artist.name;

        randomSongBtn.addEventListener('click', function () {
          fetchSongs(`${item.album.id}`);
          setTimeout(() => {
            audioElement.play();
            updatePlayButton(true); // Aggiorna bottone a "Pausa"
          }, 1000);
        });
        console.log(`ID: ${item.id}, Nome: ${item.album.title}`);
      });
    })
    .catch((error) => console.error('Errore:', error));
}

function fetchHomePage() {
  //FUNZIONE SCIANTAL

  fetchAndDisplayData();
}

fetchHomePage();

const classConfig = {
  containerClass: 'p-1',
  cardClass: 'card bg-dark text-white',
  imageClass: 'card-img-top',
  bodyClass: 'card-body',
  titleClass: 'card-title',
  textClass: 'card-text',
  footerClass: 'card-footer',
  buttonClass: '',
};

function fetchAndDisplayRandom() {
  // Genera un numero intero casuale per 'query'
  let query = Math.floor(Math.random() * 1000 + 2);
  const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/artist/${query}/albums`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data.data && data.data.length > 0) {
        // Seleziona un album casuale dall'elenco
        const randomIndex = Math.floor(Math.random() * data.data.length);
        const album = data.data[randomIndex];

        console.log('Album selezionato:', album);

        const mainContainer = document.getElementById('fetchCards');
        mainContainer.classList.add('row');

        // Crea un div per il contenitore della card
        const containerDiv = document.createElement('div');
        containerDiv.className = classConfig.containerClass;

        // Crea l'elemento della card
        const cardDiv = document.createElement('div');
        cardDiv.className = classConfig.cardClass;

        // Aggiungi l'immagine alla card
        const imgElement = document.createElement('img');
        imgElement.className = classConfig.imageClass;
        imgElement.src = album.cover; // Usa l'URL dell'immagine dal JSON
        imgElement.alt = album.title;
        cardDiv.appendChild(imgElement);

        // Crea il corpo della card
        const cardBody = document.createElement('div');
        cardBody.className = classConfig.bodyClass;

        // Aggiungi il titolo
        const titleElement = document.createElement('h5');
        titleElement.className = classConfig.titleClass;
        titleElement.textContent = album.title;
        cardBody.appendChild(titleElement);

        // Aggiungi il corpo alla card
        cardDiv.appendChild(cardBody);

        // Crea il footer della card
        const cardFooter = document.createElement('div');
        cardFooter.className = classConfig.footerClass;

        // Aggiungi un pulsante al footer
        const buttonElement = document.createElement('a');
        buttonElement.className = classConfig.buttonClass;
        buttonElement.href = album.link; // Link all'album su Deezer
        buttonElement.textContent = 'Ascolta ora';
        cardFooter.appendChild(buttonElement);

        // Aggiungi il footer alla card
        cardDiv.appendChild(cardFooter);

        // Aggiungi la card al contenitore
        containerDiv.appendChild(cardDiv);

        // Aggiungi il contenitore al mainContainer nel DOM
        mainContainer.appendChild(containerDiv);
      } else {
        console.warn('Nessun album trovato per questo artista.');
      }
    })
    .catch((error) => console.error('Errore:', error));
}

function fetchCardsMain() {
  //FUNZIONE SCIANTAL
  for (let i = 0; i < 20; i++) {
    fetchAndDisplayRandom();
  }
}

fetchCardsMain();