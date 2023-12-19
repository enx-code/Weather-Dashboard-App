$(document).ready(function () {
  function getWeather(city) {
    var directLocation =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=8b2153158617cd9459d1ae44448a1c63";

    fetch(directLocation)
      .then(function (response) {
        return response.json();
      })
      .then(function (geoData) {
        var lat = geoData[0].lat;
        var lon = geoData[0].lon;

        var currentWeatherURL =
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=8b2153158617cd9459d1ae44448a1c63&units=metric";

        var forecastURL =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=8b2153158617cd9459d1ae44448a1c63&units=metric";

        fetch(currentWeatherURL)
          .then(function (currentResponse) {
            return currentResponse.json();
          })
          .then(function (currentData) {
            displayCurrentWeather(currentData, city);
          });

        fetch(forecastURL)
          .then(function (forecastResponse) {
            return forecastResponse.json();
          })
          .then(function (forecastData) {
            displayForecast(forecastData);
          });
      });
  }

  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    var searchInput = $("#search-input").val();

    if (searchInput.trim() !== "") {
      getWeather(searchInput);

      addCityToHistory(searchInput);

      $("#search-input").val("");
    }
  });
  $("#history").on("click", "button", function () {
    var city = $(this).data("city");
    getWeather(city);
  });

  function displayCurrentWeather(data, cityName) {
    var date = dayjs().format("hh:mma, D ddd, MMMM, YYYY");
    var icon = data.weather[0].icon;
    console.log("icon", icon, "icon")
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    $("#today").html(`
      <h2>${cityName} - ${date}</h2>
      <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `);
  }

  function displayForecast(data) {
    var forecastList = data.list;
    var forecastHTML = "";

    for (var i = 0; i < forecastList.length; i += 8) {
      var forecastDate = dayjs(forecastList[i].dt_txt).format(
        "hh:mma, D ddd, MMMM, YYYY"
      );
      var forecastIcon = forecastList[i].weather[0].icon;
      var forecastTemp = forecastList[i].main.temp;
      var forecastHumidity = forecastList[i].main.humidity;

      forecastHTML += `
        <div class="col-md-2">
          <h4>${forecastDate}</h4>
          <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="Weather Icon">
          <p>Temperature: ${forecastTemp}°C</p>
          <p>Humidity: ${forecastHumidity}%</p>
        </div>
      `;
    }

    $("#forecast").html(forecastHTML);
  }

  function addCityToHistory(city) {
    $("#history").append(
      `<button class="list-group-item list-group-item-action" data-city="${city}">${city}</button>`
    );
  }

  function currentDay() {
    const currentDate = dayjs().format("hh:mma, D ddd, MMMM, YYYY");
    $("#today").html(`<h2>${currentDate}</h2>`);
  }

  currentDay();
});
