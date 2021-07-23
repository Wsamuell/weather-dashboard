const cityStorage = [];
const apiKey = '8e3b5c73ef1c4faa52421e586368e6e7'

function fetchWeather(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
        .then(function (res) {
            return res.json()
        })

        .then(function (data) {
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
            var date = new Date().toDateString()



            // console.log(date)



            var weatherTodayBox = (`
            <div id='forecast-main'>
            <h2 id="city-name font-weight-bold"> ${weatherToday.cityName}</h2>
            <div class="container" id="current-time">${date}</div>
            <p> ${weatherToday.temp} °F</p>
            <h1 class="today-icon"> ${weatherToday.icon}</h1>
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
            let uv = data.current.uvi;
            console.log(uv)
            var addUv = (`
            <p id='uv-index'> UV Index: ${uv}</p>
            `)
            $('#city-info').append(addUv);
            if (uv < 4) {
                $('#uv-index').attr('class', 'badge badge-success')
            } else if (uv < 8) {
                $('#uv-index').attr('class', 'badge badge-warning')
            } else {
                $('#uv-index').attr('class', 'badge badge-danger')
            }

            for (let i = 0, j = 1; i < 5, j < 6; i++, j++) {
                var date = new Date();
                date.setDate(date.getDate() + j);
                let futureDates = date.toDateString()
                var eachDay = {
                    icon: data.daily[i].weather[0].icon,
                    temp: data.daily[i].temp.day,
                    wind: data.daily[i].wind_speed,
                    humidity: data.daily[i].humidity,
                };

                var iconURL = `<img src="https://openweathermap.org/img/w/${eachDay.icon}.png" alt="${data.daily[i].weather[0].main}" />`;

                var eachDayCard = $(`
            <div class="pl-3" id="forecast-child">
                <div class="card pt-3 mb-3 text-light five-day" style="width: 15rem;">
                    <div class="card-body five-day">
                        <p>${iconURL}</p>
                        <p> ${futureDates}</p>
                        <p>Temp: ${eachDay.temp} °F</p>
                        <p>Wind: ${eachDay.wind} MPH</p>
                        <p>Humidity: ${eachDay.humidity}\%</p>
                    </div>
                </div>
            </div>
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
    $('#div').remove('current-time');




    let city = document.getElementById('city-search-bar').value.trim()
    fetchWeather(city);
    cityStorage.push(city);
    var priorSearch = (`
        <button class="alert" id="research" onClick='history()'>${city}</button>
    `)
    $('#search-history').append(priorSearch);



    localStorage.setItem('Previous-cities', cityStorage);
};
function history() {
    let city = document.getElementById('research').innerHTML.trim()
    console.log(city)
    fetchWeather(city);
    $('div').remove('#forecast-child');
    $('div').remove('#forecast-main');
    $('p').remove('#uv-index');
    $('#div').remove('current-time');
    $('button').remove('#city')

}

function clearHistory() {
    localStorage.clear();
    alert('Local Storage Cleared!!!')
    location.reload();
};


// jquery click handlers

$('#city-search').on('click', getCityText);
$('#clear-history').on('click', clearHistory);
$('#research').on('click', history);

