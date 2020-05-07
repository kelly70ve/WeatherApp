// Weather conditions https://openweathermap.org/weather-conditions
// Api Documentation
// Current https://openweathermap.org/current 
// UV https://openweathermap.org/api/uvi 

// Open with San Diego weather



$(document).ready(function () {
  var apiKey = "b0d36754b058f6a0166bf74f6a5ebe40";
  var city;
  var weatherId;
  var weather;

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
    var apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: apiCurrent,
      method: "GET"
    }).then(function(response) {
      weatherId = response.weather[0].id;
      decodeWeatherId();

      $("#city").text(response.name);
      $("#temp").text(`${response.main.temp} °F`);
      $("#hum").text(`${response.main.humidity} %`);
      $("#wind").text(`${response.wind.speed} MPH`);
      $("#today-img").attr("src", `./Assets/${weather}.png`)

      // Get UV
      $.ajax({
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`,
        method: "GET"
      }).then(function(response){

        $("#uv").text(response.value);
      })
      

    });
  }

  // Change img for weahter 
  function decodeWeatherId() {

    switch(true) {
      case (weatherId > 199 && weatherId < 299):
        weather = "Thunderstorm";
          break;
      case (weatherId > 299 && weatherId < 599):
        weather = "Rain";
          break;
      case (weatherId > 599 && weatherId < 699):
        weather = "Snow";
          break;
      case (weatherId > 699 && weatherId < 799):
        weather = "Atmostphere";
          break;
      case weatherId === 800:
        weather = "Clear";
          break;
      case weatherId > 800:
        weather = "Clouds"
    }
  }

  // function displayWeather() {
  //   if (weather === )
  // }


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


// Weather IDs

// 200-232 = Thunderstorm 

// 300-321 = Drizzle

// 500-531 = Rain

// 600-622 = Snow

// 701-781 = Atmosphere

// 800 = Clear

// 801-804 = Clouds 