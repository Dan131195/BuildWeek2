function getRandomColor() {
  const colors = [
    "#E13300",
    "#1E3264",
    "#E8115C",
    "#158A08",
    "#BC5800",
    "#8C67AC",
    "#777777",
    "#503750",
    "#0D73EC",
    "#8400E7",
    "#006450",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".searchCard");
  
  cards.forEach((card) => {
    const randomColor = getRandomColor();
    card.style.backgroundColor = randomColor;
  });
});

/* ------------------ */

const searchApiUrl =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=";

// Elementi della pagina
const searchInput = document.querySelector('input[type="text"]');
const searchResultsContainer = document.getElementById("searchResults"); // Contenitore per i risultati
const audioPlayer = new Audio(); // Creazione del player audio

// Funzione per cercare le canzoni basandosi sulla query dell'utente
async function searchSongs(query) {
  try {
    const response = await fetch(`${searchApiUrl}${query}`);
    const data = await response.json();
    console.log("Canzoni trovate:", data.data); // Debug per verificare i risultati
    return data.data; // Restituisce l'array delle canzoni trovate
  } catch (error) {
    console.error("Errore nella ricerca delle canzoni:", error);
    return [];
  }
}

// Funzione per gestire la ricerca
async function handleSearch(event) {
  const query = event.target.value.trim();

  // Se la query è vuota, svuota i risultati
  if (!query) {
    searchResultsContainer.innerHTML = "";
    return;
  }

  // Cerca le canzoni basandosi sulla query
  const results = await searchSongs(query);

  // Mostra i risultati della ricerca
  renderSearchResults(results);
}

// Funzione per mostrare i risultati della ricerca
function renderSearchResults(results) {
  // Svuota i risultati precedenti
  searchResultsContainer.innerHTML = "";

  if (results.length === 0) {
    searchResultsContainer.innerHTML =
      "<p class='text-white'>Nessun risultato trovato</p>";
    return;
  }

  // Creazione di una lista dei risultati
  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";

  results.forEach((song) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "15px";

    // Immagine dell'album
    const img = document.createElement("img");
    img.src = song.album.cover_small;
    img.alt = song.title;
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.marginRight = "15px";

    // Dettagli della canzone
    const details = document.createElement("div");
    details.style.flex = "1";

    const title = document.createElement("p");
    title.textContent = `Titolo: ${song.title}`;
    title.style.color = "white";
    title.style.margin = "0";

    const author = document.createElement("p");
    author.textContent = `Autore: ${song.artist.name}`;
    author.style.color = "#ccc";
    author.style.margin = "0";

    const duration = document.createElement("p");
    const minutes = Math.floor(song.duration / 60);
    const seconds = song.duration % 60;
    duration.textContent = `Durata: ${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    duration.style.color = "#aaa";
    duration.style.margin = "0";

    details.appendChild(title);
    details.appendChild(author);
    details.appendChild(duration);

    // Pulsante play
    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.style.marginLeft = "15px";
    playButton.style.backgroundColor = "#1db954";
    playButton.style.color = "white";
    playButton.style.border = "none";
    playButton.style.borderRadius = "5px";

    // Evento click per riprodurre la traccia
    playButton.addEventListener("click", () => {
      fetchSongs(`${song.album.id}`);
      setTimeout(() => {
        audioElement.play();
        updatePlayButton(true); // Aggiorna bottone a "Pausa"
      }, 1000);
      console.log(`Riproduzione di: ${song.title} - ${song.artist.name}`);
    });

    li.appendChild(img);
    li.appendChild(details);
    li.appendChild(playButton);

    ul.appendChild(li);
  });

  searchResultsContainer.appendChild(ul);
}

// Aggiungi evento input per la ricerca
searchInput.addEventListener("input", handleSearch);
