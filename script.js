const wrapper = document.querySelector('.wrapper');
const searchInput = wrapper.querySelector('.search-input');
const inputField = searchInput.querySelector('input');
const searchButton = searchInput.querySelector('button');

const infoTxt = wrapper.querySelector('.info-txt');

const apiKey = 'YOUR API KEY HERE';
let api;

inputField.addEventListener('keyup', (e) => {
  if (e.key == 'Enter' && inputField.value !== '') {
    requestApi(inputField.value);
  }
});

searchButton.addEventListener('click', () => {
  if (inputField.value === '') {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert('Your browser not support geolocation api');
    }
  } else {
    requestApi(inputField.value);
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&&appid=${apiKey}`;
  console.log('success');
  fetchData();
}

function onError(err) {
  infoTxt.innerText = err.message;
  infoTxt.classList.add('error');
  console.log('error');
}

async function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${apiKey}`;
  fetchData();
}

async function fetchData() {
  infoTxt.innerText = 'Getting weather details...';
  infoTxt.classList.add('pending');

  const res = await fetch(api);
  const data = await res.json();
  setTimeout(() => {
    weatherDetails(data);
  }, 500);
}

function weatherDetails(data) {
  infoTxt.classList.replace('pending', 'error');
  if (data.cod === '404') {
    infoTxt.innerText = data.message;
  } else {
    infoTxt.classList.remove('pending', 'error');
    const { description, id } = data.weather[0];
    const { name } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(data);
    wrapper.querySelector('.weather .city').innerText = 'Weather in ' + name;
    wrapper.querySelector('.weather .temp').innerText = Math.floor(temp) + '°C';
    wrapper.querySelector('.weather .description').innerText = description;
    wrapper.querySelector('.weather .humidity').innerText = 'Humidity: ' + humidity + '%';
    wrapper.querySelector('.weather .wind').innerText = 'Wind speed: ' + speed + 'km/h';
  }
}
