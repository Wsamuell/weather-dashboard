const cityStorage = [];
const days = [];
// const citySearchText = $('#city-search-bar');
// const citySearchBtn = $('#city-search');
// const clearHistory = $('#clear-history');
// const cityName = $('#city-name')
// const cityTemp = $('#city-temperature')
// const cityWind = $('#city-wind')
// const cityHumid = $('#city-humidity')
// const cityUv = $('#city-uv-index')

apiKey = '8e3b5c73ef1c4faa52421e586368e6e7'
// secondApiKey = '37fe49a773225ac5cc711f4133df4df7'

function fetchWeather(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
        .then(function (res) {
            // console.log(res)
            return res.json()
        })

        .then(function (data) {
            // console.log(data)
            let mainInfo = data.main;
            let cityName = data.name;
            let wind = data.wind.speed;
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            uvIndex(lat, lon);
            document.getElementById('city-name').innerText = cityName;
            document.getElementById('city-temperature').innerText = mainInfo.temp;
            document.getElementById('city-wind').innerText = wind;
            document.getElementById('city-humidity').innerText = mainInfo.humidity;

        });

};

function uvIndex(futureLat, futureLon) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${futureLat}&lon=${futureLon}&units=imperial&exclude=hourly,minutely&appid=${apiKey}`
    fetch(apiUrl)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.log(data)
            let uv = data.current.uvi
            document.getElementById('city-uv-index').innerText = uv;
            for (let i = 0; i < 6; i++) {
                var eachDay = {
                    date: data.daily[i].dt,
                    icon: data.daily[i].weather[0].icon,
                    temp: data.daily[i].temp.day,
                    wind: data.daily[i].wind_speed,
                    humidity: data.daily[i].humidity
                };
                var iconURL = `<img src="https://openweathermap.org/img/w/${eachDay.icon}.png" alt="${data.daily[i].weather[0].main}" />`;

                var eachDayCard = $(`
                <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                    <div class="card-body">
                        <h5>${date}</h5>
                        <p>${iconURL}</p>
                        <p>Temp: ${eachDay.temp} °F</p>
                        <p>Wind: ${eachDay.wind} mph</p>
                        <p>Humidity: ${eachDay.humidity}\%</p>
                    </div>
                </div>
            <div>
                `);

            $('#future-forecast').append(eachDayCard);

            }

        })

};

// function fiveDay(futureLat, futureLon ) {
//     let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${futureLat}&lon=${futureLon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

//     fetch(apiUrl)
//     .then(function (res) {
//         return res.json()
//     })
//     .then(function (data) {
//         console.log(data)

//     });

// };



function getCityText(event) {
    event.preventDefault();

    let city = document.getElementById('city-search-bar').value.trim()
    fetchWeather(city);
};





// jquery click handlers

$('#city-search').on('click', getCityText)
