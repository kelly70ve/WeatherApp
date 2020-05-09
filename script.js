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
  var noon = [2, 10, 18, 26, 34];
  var days;
  var uvIndex = "";
  var uv;
  var savedCities= [];

  loadCities();

  init();

  
  // SEARCH -----------------------------------------------------------------------

  // Listen for search btn click

  $("#search-btn").on("click", function () {
    event.preventDefault();
    // Search for a city on click 
    if ($("#search").val() !== "") {
      city = $("#search").val().trim();
      checkPast()
    }
    getToday();
    getFiveDay();
  });

  // Add city buttons
  function addCity() {
    $("#past-searches").prepend($("<button>").attr("type", "button").attr("data-city", city).addClass("past text-muted list-group-item list-group-item-action").text(city));
    $("#search").val("");
  }

  // Past search button listen 

  $("#past-searches").on("click",".past",function () {
    event.preventDefault();
    city = $(this).attr("data-city");
    getToday();
    getFiveDay();
  });

  // Check if city has been searched for before
  function checkPast () {
    if ( $(`#past-searches button[data-city="${city}"]`).length ) { 
      $("#search").val("");
    } else {
      addCity();
      savedCities.push(city);
      localStorage.setItem("cities", JSON.stringify(savedCities))
    }
  }
  

  // TODAY -----------------------------------------------------------------------


  // Get today's weather 
  function getToday() {
    var apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: apiCurrent,
      method: "GET"
    }).then(function (response) {
      weatherId = response.weather[0].id;
      decodeWeatherId();

      $("#city").text(response.name);
      $("#temp").text(`${response.main.temp} °F`);
      $("#hum").text(`${response.main.humidity} %`);
      $("#wind").text(`${response.wind.speed} MPH`);
      $("#today-img").attr("src", `./Assets/${weather}.png`).attr("alt", weather);

      // Get UV
      $.ajax({
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`,
        method: "GET"
      }).then(function (response) {
        uvIndex = response.value;
        decodeUV();
        $("#uv").text(uvIndex).css("background-color", uv);
      })

    });
  }


  // FIVE DAY -----------------------------------------------------------------------


  function getFiveDay() {
    var apiFive = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
    $.ajax({
      url: apiFive,
      method: "GET"
    }).then(function (response) {
      days = [];

      for (var i = 0; i < noon.length; i++) {
        weatherId = response.list[noon[i]].weather[0].id
        decodeWeatherId();

        var day = {
          temp: response.list[noon[i]].main.temp,
          hum: response.list[noon[i]].main.humidity,
          weather: weather
        }
        days.push(day);
      }
      displayFiveDay();
    })
  }

  function displayFiveDay() {
    for (var i = 0; i < days.length; i++) {
      $(`#day${i}`).text(moment().add(i + 1, 'day').format('l'))
      $(`#temp${i}`).text(`${days[i].temp} °F`);
      $(`#hum${i}`).text(`${days[i].hum} %`);
      $(`#img${i}`).attr("src", `./Assets/${days[i].weather}.png`).attr("alt", weather)
    }
  }

  // WEATHER DECODERS -----------------------------------------------------------------------

  // Change img for weather 
  function decodeWeatherId() {
    switch (true) {
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

  function decodeUV() {
    uv = "";
    switch (true) {
      case (uvIndex >= 0 && uvIndex < 3):
        uv = "green";
        break;
      case (uvIndex >= 3 && uvIndex < 6):
        uv = "darkkhaki";
        break;
      case (uvIndex >= 6 && uvIndex < 8):
        uv = "orange";
        break;
      case (uvIndex >= 8 && uvIndex < 11):
        uv = "red";
        break;
      case (uvIndex >= 11):
        uv = "violet"
    }
  }


  // LOCAL STORAGE -----------------------------------------------------------------------

  // Load Cities
  function loadCities() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
      savedCities = storedCities;
      renderCities();
    } else {
      city = "San Diego"
      checkPast();
    }
  }

  function renderCities() {
    for (var i = 0; i < savedCities.length; i++) {
      city = savedCities[i];
      console.log (city)
      addCity();
    }
  }

  // INIT -----------------------------------------------------------------------

  // Initialize with SD
  function init() {
    getToday();
    getFiveDay();
  }

});

// Pull weather conditions for 5 days 
// Pull dates for next 5 days
// On click search for past searches btns