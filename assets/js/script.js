const cityStorage = [];
apiKey = '8e3b5c73ef1c4faa52421e586368e6e7'


var DateTime = luxon.DateTime;
    //    var localTime=DateTime.local();
    //    console.log(localTime.toString());

function fetchWeather(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
        .then(function (res) {
            return res.json()
        })

        .then(function (data) {
            // console.log(data)
            var iconLocation = data.weather[0].icon;
            var iconURL = `<img src="https://openweathermap.org/img/w/${iconLocation}.png" alt="Current Weather image" />`;

            var weatherToday = {
                temp: data.main.temp,
                cityName: data.name,
                icon: iconURL,
                wind: data.wind.speed,
                humidity: data.main.humidity
            }
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            uvIndex(lat, lon);


            
            var weatherTodayBox = (`
            <div id='forecast-main'>
            <h2 id="city-name"> ${weatherToday.cityName}</h2>
            <p> ${weatherToday.temp} °F</p>
            <h1> ${weatherToday.icon}</h1>
            <p> Wind: ${weatherToday.wind} MPH</p>
            <p> Humidity: ${weatherToday.humidity} \%</p>
            </div>
            `)
            $('#city-info').append(weatherTodayBox);

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
            let uv = data.current.uvi;
            let timezone = data.timezone
            // let currentTime = moment().tz(`${timezone}`).format('MMMM Do YYYY, h:mm:ss a');

            // console.log(currentTime);

            var addUv = (`
            <p id='uv-index'> UV Index: ${uv}</p>
            `)
            $('#city-info').append(addUv);
            for (let i = 0; i < 5; i++) {
                var eachDay = {
                    date: data.daily[i].dt,
                    icon: data.daily[i].weather[0].icon,
                    temp: data.daily[i].temp.day,
                    wind: data.daily[i].wind_speed,
                    humidity: data.daily[i].humidity,
                };

                var iconURL = `<img src="https://openweathermap.org/img/w/${eachDay.icon}.png" alt="${data.daily[i].weather[0].main}" />`;
                // <h5>${date}</h5>

                var eachDayCard = $(`
            <div class="pl-3" id="forecast-child">
                <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                    <div class="card-body">
                        <p>${iconURL}</p>
                        <p>Temp: ${eachDay.temp} °F</p>
                        <p>Wind: ${eachDay.wind} MPH</p>
                        <p>Humidity: ${eachDay.humidity}\%</p>
                    </div>
                </div>
            <div>
                `);

                $('#future-forecast').append(eachDayCard);

            }

        })

};



function getCityText(event) {
    event.preventDefault();
    $('div').remove('#forecast-child');
    $('div').remove('#forecast-main');
    $('p').remove('#uv-index');


    let city = document.getElementById('city-search-bar').value.trim()
    fetchWeather(city);
    cityStorage.push(city);
    var priorSearch = (`
        <li>${city}</li>
    `)
    $('#search-history').append(priorSearch);


    localStorage.setItem('Previous-cities', JSON.stringify(cityStorage));
};

function clearHistory() {
    localStorage.clear();
    console.log('Local Storage Cleared!!!')
    location.reload();
};


// jquery click handlers

$('#city-search').on('click', getCityText);
$('#clear-history').on('click', clearHistory);

// date needs to work for current weather and also we need to add style
// style to button
// 