const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';
const weatherWidget = document.getElementById('weather-widget');
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');

cityForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const city = cityInput.value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const temperature = Math.round(data.main.temp - 273.15);
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const location = data.name;

            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
            const icon = document.createElement('img');
            icon.src = iconUrl;

            const temperatureElement = document.createElement('p');
            temperatureElement.classList.add('temperature');
            temperatureElement.textContent = `${temperature}°C`;

            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('description');
            descriptionElement.textContent = description;

            const locationElement = document.createElement('p');
            locationElement.classList.add('location');
            locationElement.textContent = location;

            weatherWidget.innerHTML = '';
            weatherWidget.appendChild(icon);
            weatherWidget.appendChild(temperatureElement);
            weatherWidget.appendChild(descriptionElement);
            weatherWidget.appendChild(locationElement);
        })
        .catch(error => {
            console.log('Error:', error);
            weatherWidget.textContent = 'Failed to fetch weather data.';
        });
});
