// This variable will hold the city searched by the user.
var city = "";

// Defining my variables
var searchCity = $("#searchCity");
var searchButton = $("#searchButton");
var clearButton = $("#clear-history");
var currentCity = $("#currentCity");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#windSpeed");
var currentUVIndex = $("#uv-index");
var savedCities = [];

// This loop searches the city to see if it exists in the "saved city search"
function find(c) {
  for (var i = 0; i < savedCities.length; i++) {
    if (c.toUpperCase() === savedCities[i]) {
      return -1;
    }
  }
  return 1;
}

// API Key
var APIKey = "3f4c7d14daab872155f896009f745a0a";

// Get the city from user entry and tie to weather forecast
function displayWeather(event) {
  event.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}

// AJAX Call
function currentWeather(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}&units=imperial`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var date = new Date(response.dt * 1000).toLocaleDateString();
    $(currentCity).html(response.name + "(" + date + ")");
    var temp = response.main.temp;
    $(currentTemperature).html(temp.toFixed(2) + "&#8457");
    $(currentHumidity).html(response.main.humidity + "%");
    var ws = response.wind.speed;
    var windSpeedMPH = (ws * 2.237).toFixed(1);
    $(currentWindSpeed).html(windsmph + "MPH");
  });
}
