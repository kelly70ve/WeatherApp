// Weather conditions https://openweathermap.org/weather-conditions
// Api Documentation
// Current https://openweathermap.org/current 
// UV https://openweathermap.org/api/uvi 

// Open with San Diego weather



$(document).ready(function () {
  var apiKey = "b0d36754b058f6a0166bf74f6a5ebe40";
  var city;

  init();

  // Listen for search btn click

  $("#search-btn").on("click", function() {
    event.preventDefault();
    // Search for a city on click 
    if ($("#search").val() !== "") {
      city = $("#search").val().trim()
      addCity();
    }
    getWeather();
  });

  // Update weather tables
  function getWeather() {
    var apiCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
      url: apiCurrent,
      method: "GET"
    }).then(function(response) {
      console.log(response)
      $("#city").text(response.name);
      $("#temp").text(`${response.main.temp} °F`);
      $("#hum").text(`${response.main.humidity} %`);
      $("#wind").text(`${response.wind.speed} MPH`);
      $("#uv").text(``);

    });
  }

  // Initialize with SD
  function init() {
    city = "San Diego"
    getWeather();
  }

  // Add city buttons
  function addCity () {
    $("#past-searches").prepend($("<button>").attr("type", "button").addClass("past text-muted list-group-item list-group-item-action").text(city))
    $("#search").val("")
  }

});

// Pull the weather conditions for today
// Pull weather conditions for 5 days 
// Pull dates for next 5 days
// On click search for past searches btns