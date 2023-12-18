$(document).ready(function () {
  $("#search-button").on("click", function (event) {
    event.preventDefault();
    var searchInput = $("#search-input").val();
    console.log(searchInput);
    var directLocation =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      searchInput +
      "&limit=1&appid=8b2153158617cd9459d1ae44448a1c63";
    console.log(directLocation);
    fetch(directLocation)
      .then(function (responce) {
        return responce.json();
      })
      .then(function (data) {
        console.log(data[0].lat);
        var lat = data[0].lat;
        var lon = data[0].lon;

        var queryURL =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=8b2153158617cd9459d1ae44448a1c63&units=metric";

        fetch(queryURL)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data.city);
            var cityName = data.city.name;
            // var history = data.city
            var history = $("#history");
            history.text(cityName);

            console.log(history);
          });
      });
  });

  function currentDay() {
    const currentDay = dayjs().format("hh:mma, dddd, MMMM D, YYYY");
    $("#today").text(currentDay);
  }
  currentDay();
});
