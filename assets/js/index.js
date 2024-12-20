const randomSong = document.getElementById("randomSong");
let randomImg = document.getElementById("randomImg");
let randomSongTitle = document.getElementById("randomSongTitle");
let randomArtist = document.getElementById("randomArtist");
const hideDiv = document.getElementById("hideDiv");
const randomSongBtn = document.getElementById("randomSongBtn");

document.addEventListener("load", init());

function init() {
  fetchCardsMain();
  setTimeout(() => {
    updateHeartIcon();
  }, 1000);
}

hideDiv.addEventListener("click", function (e) {
  e.preventDefault();
  randomSong.classList.add("d-none");
});

//Klajdi non c'è
//è andato via
// klajdi non è più cosa mia

function fetchAndDisplayData() {
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

      songs.forEach((item) => {
        randomImg.src = item.album.cover;
        randomImg.alt = item.album.title;
        randomSongTitle.textContent = item.album.title;
        randomArtist.textContent = item.artist.name;

        randomSongBtn.addEventListener("click", function () {
          fetchSongs(`${item.album.id}`);
          setTimeout(() => {
            audioElement.play();
            updatePlayButton(true);
          }, 1000);
        });
        console.log(`ID: ${item.id}, Nome: ${item.album.title}`);
      });
    })
    .catch((error) => console.error("Errore:", error));
}

function fetchHomePage() {
  //FUNZIONE SCIANTAL

  fetchAndDisplayData();
}

fetchHomePage();

const classConfig = {
  containerClass: "p-1",
  cardClass: "card bg-dark text-white",
  imageClass: "card-img-top",
  bodyClass: "card-body",
  titleClass: "card-title",
  textClass: "card-text",
  footerClass: "card-footer",
  buttonClass: "",
};

function fetchAndDisplayRandom() {
  let query = Math.floor(Math.random() * 1000 + 2);
  const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/artist/${query}/albums`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data.data && data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.length);
        const album = data.data[randomIndex];

        console.log("Album selezionato:", album);

        const mainContainer = document.getElementById("fetchCards");
        mainContainer.classList.add("row");

        const containerDiv = document.createElement("div");
        containerDiv.className = classConfig.containerClass;

        const cardDiv = document.createElement("div");
        cardDiv.className = classConfig.cardClass;

        const cardImg = document.createElement("div");
        cardImg.className = "position-relative";

        const imgElement = document.createElement("img");
        imgElement.className = classConfig.imageClass;
        imgElement.src = album.cover;
        imgElement.alt = album.title;
        cardImg.appendChild(imgElement);

        const play = document.createElement("i");
        play.className =
          "bi bi-play-fill bg-success position-absolute d-flex align-items-center justify-content-center fs-4 d-none";
        play.style.bottom = "10px";
        play.style.right = "10px";
        play.style.width = "40px";
        play.style.height = "40px";
        play.style.borderRadius = "50%";
        play.style.cursor = "pointer";
        cardImg.appendChild(play);


        cardDiv.appendChild(cardImg);

        cardDiv.addEventListener("mouseover", () => {
          play.classList.remove("d-none");
        });

        cardDiv.addEventListener("mouseout", () => {
          play.classList.add("d-none");
        });

        const cardBody = document.createElement("div");
        cardBody.className = classConfig.bodyClass;

        const titleElement = document.createElement("h6");
        titleElement.className = classConfig.titleClass;
        titleElement.textContent = album.title;
        cardBody.appendChild(titleElement);

        cardDiv.appendChild(cardBody);

        containerDiv.appendChild(cardDiv);

        mainContainer.appendChild(containerDiv);
      } else {
        console.warn("Nessun album trovato per questo artista.");
      }
    })
    .catch((error) => console.error("Errore:", error));
}

function fetchCardsMain() {
  //FUNZIONE SCIANTAL
  for (let i = 0; i < 10; i++) {
    fetchAndDisplayRandom();
  }
}
