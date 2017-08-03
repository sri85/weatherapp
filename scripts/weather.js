$('document').ready(function() {

  let getUserPosition = new Promise((resolve, reject) => {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(data => {
        resolve(data);
      }, error => {
        reject(error);
      }, options);

    } else {
      reject({
        error: 'browser doesn\'t support geolocation'
      });
    };

  });

  $('#getweather').click(function() {
    return getUserPosition
      .then(data => {
        return getWeather(data.coords.latitude, data.coords.longitude);
      })
      .catch(error => {
        console.log('Error', error);
      });

  });

  function getWeather(lat, long) {
    let apiUrl = "https://fcc-weather-api.glitch.me/api/current?" + "lat=" + lat + '&' + 'lon=' + long;

    let x = $.ajax({
      url: apiUrl,
      success: (weatherData) => {
      console.log(weatherData);
        if (($("div#temperature").has("h3")).length === 0) {
          let temperature = Math.round((weatherData["main"]["temp"] * 10) / 10);
          $("#temperature").append("<h3>" + temperature + " &deg;<a href='#'>C</a>" + "</h3>");
        }
        $('#city').text(weatherData["name"] + " ," + weatherData["sys"]["country"]);
        if (($("div#description").has("h4")).length === 0) {
          $("#description").append("<h4>" + weatherData["weather"][0]["main"] + "</h4>");
          $("#description").append(displayWeatherIcon(weatherData["weather"][0]["main"]));
        }

      },
      dataType: "json"
    });

  }
  

  $('#temperature').click(function() {
    let temperatureScale = $("#temperature > h3 > a").text();
    if (temperatureScale === 'C') {
      let temperatureValue = getTemperature();
      $("#temperature").html("<h3>" + temperatureConversion(temperatureValue, "Celsius") + " &deg;<a href='#'>F</a>" + "</h3>");
    } else if (temperatureScale === 'F') {
      let temperatureValue = getTemperature();
      $("#temperature").html("<h3>" + temperatureConversion(temperatureValue, "Fahrenheit") + " &deg;<a href='#'>C</a>" + "</h3>");
    }
  });

  function getTemperature() {
    return parseFloat($("#temperature").text());
  }


  function temperatureConversion(value, type) {

    switch (type) {
      case "Celsius":
        return Math.round(value * 9 / 5 + 32);
        break;
      case "Fahrenheit":
        return Math.round((value - 32) / 1.8);
        break;
    }
  }

  function displayWeatherIcon(description) {
    switch (description) {
      case "Drizzle":
      case "Mist":
        $("#description").append("<i class=' wrap wi wi-sprinkle'></i>");
        break;

      case "Sunny":
        $("#description").append("<i class='wi wi-day-sunny'></i>");
        break;

      case "Rain":
        $("#description").append("<i class='wi wi-rain'></i>");

        break;
      default:
      // Because i live in  London and its cloudy by default :P
      $("#description").append("<i class='wi wi-day-cloudy-high'></i>");

    }
  }


});
