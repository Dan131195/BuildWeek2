/*-------------------------SCIANTAL------------------------------*/

/* Questa funzione serve a chiudere la Aside dopo il wrapper centrale 
il wrapper centraler si allarga occupando lo spazio della aside 
Codice da controllare */
let stateCollapse = false;
let expandeCollapse = document.getElementById('expandeCollapse');

function closeAside() {
  stateCollapse = !stateCollapse;
  expandeCollapse.classList.add('ms-1');
  if (stateCollapse === true) {
    document.getElementById('asideFriends').classList.remove('d-lg-block');
    document.getElementById('wrapperCentral').classList.remove('col-lg-7');
    document.getElementById('wrapperCentral').classList.add('col-lg-9');
    expandeCollapse.classList.remove('bi-arrows-angle-contract');
    expandeCollapse.classList.add('bi-arrows-angle-expand');
    const card = document.querySelectorAll('.card');
    card.forEach(element => {
      element.style.height = '350px';
    });
  } else {
    document.getElementById('asideFriends').classList.add('d-lg-block');
    document.getElementById('wrapperCentral').classList.add('col-lg-7');
    document.getElementById('wrapperCentral').classList.remove('col-lg-9');
    expandeCollapse.classList.remove('bi-arrows-angle-expand');
    expandeCollapse.classList.add('bi-arrows-angle-contract');
    const card = document.querySelectorAll('.card');
    card.forEach(element => {
      element.style.height = '300px';
    });
  }
}

document.getElementById('closeBtn').addEventListener('click', function (e) {
  e.preventDefault();
  closeAside();
});

document
  .getElementById('expandeCollapse')
  .addEventListener('click', function () {
    closeAside();
  });