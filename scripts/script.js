// DOM References
const form = document.querySelector('form');
const det1 = document.querySelector('.det1');
const det2 = document.querySelector('.det2');
const det3 = document.querySelector('.det3');
const det4 = document.querySelector('.det4');
const p = document.querySelector('.error');
const details = document.querySelector('.details');
const spinner = document.querySelector('.spinner');
const infos = document.querySelectorAll('.details div');

// Functions

const getIPDetails = async (ip) => {
  const apikey = 'at_Rxcc3KbPOJFHuarmAmalvziT6LFZ9';

  const base = 'https://geo.ipify.org/api/v1'
  const query = `?apiKey=${apikey}&ipAddress=${ip}`
  const response = await fetch(base + query);
  const data = await response.json();
  return data;
}

const showLocation = async (IPLocation) => {
  const location = [IPLocation.lat, IPLocation.lng];
  myMap.setView(location, 13);

  marker.setLatLng(location);
}

function spinnerAnimation(){
  if(spinner.classList.contains('spinner-hide')){
    spinner.classList.remove('spinner-hide')
    spinner.classList.add('spinner-show')
    details.classList.remove('spinner-details-hide');
    details.classList.add('spinner-details-show');
    infos.forEach(info => {
      info.style.display = 'none';
    })
  }
  else{
    spinner.classList.add('spinner-hide')
    spinner.classList.remove('spinner-show')
    details.classList.add('spinner-details-hide');
    details.classList.remove('spinner-details-show');
    infos.forEach(info => {
      info.style.display = 'flex';
    })
  }
}

function showError(){
  if(form.search.classList.contains('hidden-search')){
    form.search.classList.remove('hidden-search')
    form.search.classList.add('show-search')
    p.classList.remove('hidden-text')
    p.classList.add('show-text')
  }
}

function removeError(){
  if(form.search.classList.contains('show-search')){
    form.search.classList.add('hidden-search')
    form.search.classList.remove('show-search')
    p.classList.add('hidden-text')
    p.classList.remove('show-text')
  }
}
function resetFields(){
  det1.lastElementChild.textContent = '-'
  det2.lastElementChild.textContent = '-'
  det3.lastElementChild.textContent = '-'
  det4.lastElementChild.textContent = '-'
}

function fillUp(data){ 
  det1.lastElementChild.textContent = data.ip;
  det2.lastElementChild.textContent = data.location.region;
  det3.lastElementChild.textContent = data.location.timezone;
  det4.lastElementChild.textContent = data.as.name;
}

// Event Listener

form.addEventListener('submit', e => {
  e.preventDefault();

  // Loading Animation
  spinnerAnimation();

  // Get the ip from the user and reset the form
  const ip = form.search.value.trim();
  form.reset();

  getIPDetails(ip)
    .then(data => {
      fillUp(data); 
      spinnerAnimation();  
      showLocation(data.location);
      removeError();
    })
    .catch((err) => {
      console.log(err);
      showError();
      resetFields();
      spinnerAnimation();
    })

});

// Map Things

// Initializing the map
var myMap = L.map('mapid')

 // Custom Icon for marker
 var myIcon = L.icon({
  iconUrl : 'images/icon-location.svg',
})
// Setting the Marker
let marker = L.marker([0, 0],  {icon: myIcon}).addTo(myMap);

// Add a Tile Layer to our map
let id = 'mapbox/streets-v11';
let accessToken = 'pk.eyJ1IjoiZ2FtYjE0IiwiYSI6ImNraW0xbGdjNDA4aXEyeW81d29tczlnNDcifQ.iNJ_h-xNafCoBlaAqH6I4Q'

L.tileLayer(`https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,{
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZ2FtYjE0IiwiYSI6ImNraW0xbGdjNDA4aXEyeW81d29tczlnNDcifQ.iNJ_h-xNafCoBlaAqH6I4Q'
  }).addTo(myMap);

// Setting zoom control to the top left
myMap.zoomControl.setPosition('topleft');
