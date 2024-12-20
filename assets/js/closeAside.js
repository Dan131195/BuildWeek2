/* Questa funzione serve a chiudere la Aside dopo il wrapper centrale 
il wrapper centraler si allarga occupando lo spazio della aside 
Codice da controllare */
let stateCollapse = false;
const wrapper = document.getElementById('wrapperCentral');
const expandeCollapse = document.getElementById('expandeCollapse');
const asideFriends = document.getElementById('asideFriends');
const closeBtn = document.getElementById('closeBtn');

function closeAside() {
  stateCollapse = !stateCollapse;
  expandeCollapse.classList.add('ms-1');
  if (stateCollapse === true) {
    asideFriends.classList.remove('d-lg-block');
    wrapper.classList.remove('col-lg-7');
    wrapper.classList.add('col-lg-9');
    expandeCollapse.classList.remove('bi-arrows-angle-contract');
    expandeCollapse.classList.add('bi-arrows-angle-expand');
    // const card = document.querySelectorAll('.card');
    // card.forEach(element => {
    //   element.style.height = '350px';
    // });
  } else {
    asideFriends.classList.add('d-lg-block');
    wrapper.classList.add('col-lg-7');
    wrapper.classList.remove('col-lg-9');
    expandeCollapse.classList.remove('bi-arrows-angle-expand');
    expandeCollapse.classList.add('bi-arrows-angle-contract');
    // const card = document.querySelectorAll('.card');
    // card.forEach(element => {
    //   element.style.height = '300px';
    // });
  }
}

closeBtn.addEventListener('click', function () {
  closeAside();
});

expandeCollapse.addEventListener('click', function () {
  closeAside();
});
