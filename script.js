$(document).ready(function () {
  var apiKey = "b0d36754b058f6a0166bf74f6a5ebe40";
  var city;
  var weatherId;
  var weather;
  var lat;
  var lon;
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
    }
    getToday();
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
      method: "GET",
      error: function () {
        alert("City not found. Please check spelling and search again.");
        $("#search").val("");
      }
    }).then(function (response) {
      checkPast();
      weatherId = response.weather[0].id;
      decodeWeatherId();

      $("#city").text(response.name);
      $("#temp").text(`${response.main.temp} °F`);
      $("#hum").text(`${response.main.humidity} %`);
      $("#wind").text(`${response.wind.speed} MPH`);
      $("#today-img").attr("src", `./Assets/${weather}.png`).attr("alt", weather);

      lat = response.coord.lat;
      lon = response.coord.lon;

      getUV();
      getFiveDay();
    });
  }

  // Get UV
  function getUV() {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
      method: "GET"
    }).then(function (response) {
      uvIndex = response.value;
      decodeUV();
      $("#uv").text(uvIndex).css("background-color", uv);
    })
  }

  // FIVE DAY -----------------------------------------------------------------------

  
  function getFiveDay() {
    var apiFive = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current&appid=${apiKey}&units=imperial`
    $.ajax({
      url: apiFive,
      method: "GET"
    }).then(function (response) {
      for (var i = 0; i < 5; i++) {
        var unixTime = response.daily[i].dt
        $(`#day${i}`).text(moment.unix(unixTime).format('l'))
        $(`#temp${i}`).text(`${response.daily[i].temp.day} °F`);
        $(`#hum${i}`).text(`${response.daily[i].humidity} %`);
        weatherId = response.daily[i].weather[0].id
        decodeWeatherId();
        $(`#img${i}`).attr("src", `./Assets/${weather}.png`).attr("alt", weather)
      }
    })
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
      addCity();
    }
  }

  // Clear Storage 

  $("#clear").on("click", function () {
    localStorage.clear();
    savedCities = [];
    $("#past-searches").empty();
    city = "San Diego";
    init();
  })

  // INIT -----------------------------------------------------------------------

  // Initialize with SD
  function init() {
    getToday();
  }

});