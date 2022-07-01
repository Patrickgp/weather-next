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
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    for (i = 0; i < 5; i++) {
      var date = new Date(
        response.list[(i + 1) * 8 - 1].dt * 1000
      ).toLocaleDateString();
      var temp = response.list[(i + 1) * 8 - 5].main.temp_max; //using equation to display temperature at noon
      var humidity = response.list[(i + 1) * 8 - 1].main.humidity;

      $("#futureDate" + i).html(date);
      $("#futureTemp" + i).html(temp + "&#8457");
      $("#futureHumidity" + i).html(humidity + "%");
    }

    console.log(response);
    var lat = response.city.coord.lat;
    var lon = response.city.coord.lon;
    var date = new Date(response.list[0].dt * 1000).toLocaleDateString();
    $(currentCity).html(response.city.name + " (" + date + ")");
    var temp = response.list[0].main.temp;
    $(currentTemperature).html(temp.toFixed(2) + "&#8457");
    $(currentHumidity).html(response.list[0].main.humidity + "%");
    var ws = response.list[0].wind.speed;
    var windSpeedMPH = (ws * 2.237).toFixed(1);
    $(currentWindSpeed).html(windSpeedMPH + "MPH");
    // forecast(response.city);
    UVIndex(response.city.coord.lon, response.city.coord.lat);
    if (response.ok) {
      savedCities = JSON.parse(localStorage.getItem("cityname"));
      console.log(savedCities);
      if (savedCities == null) {
        savedCities = [];
        savedCities.push(city.toUpperCase());
        localStorage.setItem("cityname", JSON.stringify(savedCities));
        addToList(city);
      } else {
        if (find(city) > 0) {
          savedCities.push(city.toUpperCase());
          localStorage.setItem("cityname", JSON.stringify(savedCities));
          addToList(city);
        }
      }
    }
  });
}

function UVIndex(lon, lat) {
  var UVIndexURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
  $.ajax({
    url: UVIndexURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $(currentUVIndex).html(response.current.uvi);
    if (response.current.uvi <= 2) {
      $(currentUVIndex).attr("class", "low");
    } else if (response.current.uvi > 2 && response.current.uvi <= 5) {
      $(currentUVIndex).attr("class", "moderate");
    } else if (response.current.uvi > 5 && response.current.uvi <= 8) {
      $(currentUVIndex).attr("class", "high");
    } else {
      $(currentUVIndex).attr("class", "danger");
    }
  });
}

// Add city to search history
function addToList(city) {
  var listEl = $("<li>" + city.toUpperCase() + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", city.toUpperCase());
  $(".list-group").append(listEl);
}

// Display past search items
function pastSearch(event) {
  var liEl = event.target;
  if (event.target.matches("li")) {
    city = liEl.textContent.trim();
    currentWeather(city);
  }
}

// Start function
function previousCity() {
  $("ul").empty();
  var savedCities = JSON.parse(localStorage.getItem("cityname"));
  if (savedCities !== null) {
    savedCities = JSON.parse(localStorage.getItem("cityname"));
    for (i = 0; i < savedCities.length; i++) {
      addToList(savedCities[i]);
    }
    city = savedCities[i - 1];
    currentWeather(city);
  }
}

// Clear previous search history
function clearHistory(event) {
  event.preventDefault();
  savedCities = [];
  localStorage.removeItem("cityname");
  document.location.reload();
}

// On Click Handlers
$("#searchButton").on("click", displayWeather);
$(document).on("click", pastSearch);
$(window).on("load", previousCity);
$("#clear-history").on("click", clearHistory);
