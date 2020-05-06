// Weather conditions https://openweathermap.org/weather-conditions
// Api Documentation

// Open with San Diego weather



$(document).ready(function () {

  var api = "api.openweathermap.org/data/2.5/weather?q={city name}&appid=" + apiKey
  var apiKey = "b0d36754b058f6a0166bf74f6a5ebe40"

  $("#search-btn").on("click", function() {
    event.preventDefault();
    // Search for a city on click

    

    // Add city to list (if city != null)
    addCity();

    function addCity () {
      var search = $("#search").val()
      $("#past-searches").prepend($("<button>").attr("type", "button").addClass("past text-muted list-group-item list-group-item-action").text(search))
      $("#search").val("")
    }

    
    

  });



});
// Add it to the list of cities
// Pull the weather conditions for today
// Pull weather conditions for 5 days 
// Pull dates for next 5 days
// On click search for past searches btns