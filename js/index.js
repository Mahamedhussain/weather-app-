const locationInput = document.getElementById("locationinput");
const locationBtn = document.getElementById("locationbtn");
const contactLink = document.getElementById("contactlink");
let currentLocation = "";
let data = {};

let futureData = {
  tomorow: {},
  afterTomorow: {},
};

let dates = {
  daysName: [], // Array of day names: ["Saturday", "Sunday", "Monday"]
  day: [], // Array of numeric day values: [5, 6, 7]
  monthName: "", // Month name: "July"
};

let airDirection = "";

let searchingCityName = "";

contactLink.addEventListener("click", function () {
  window.location.href = "contact.html";
});

locationInput.addEventListener("input", async function () {
  await getNewCityRes();
  await getCityWeatherRes(searchingCityName);
  await getFutuareWeatherRes(searchingCityName);
  getAirDirection(data.current.wind_dir);
  displayWeather();
});

async function getNewCityRes() {
  try {
    regex = /^[a-zA-Z]+$/;
    if (regex.test(locationInput.value)) {
      let response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=b4d0582e709742feaf0103219252906&q=${locationInput.value}`
      );
      if (response.ok) {
        let data = await response.json();
        if (data[0].name != null) searchingCityName = data[0].name;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//     get live location

async function getLiveLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    currentLocation = data.city;
  } catch (error) {
    console.log("Error fetching live location:", error);
  }
}

//    get data of this city

async function getCityWeatherRes(city) {
  try {
    let response = await fetch(
      ` https://api.weatherapi.com/v1/current.json?key=b4d0582e709742feaf0103219252906&q=${city}`
    );
    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    console.log(error);
  }
}

//       function   to get  date

function fillDates() {
  let numDate = data.current.last_updated;
  let dateObj = new Date(numDate);

  // Clear existing values
  dates.daysName = [];
  dates.day = [];

  // Fill daysName and day
  for (let i = 0; i < 3; i++) {
    let nextDate = new Date(dateObj);
    nextDate.setDate(dateObj.getDate() + i);

    let dayName = nextDate.toLocaleString("en-US", { weekday: "long" });
    let dayNumber = nextDate.getDate();

    dates.daysName.push(dayName);
    dates.day.push(dayNumber);
  }

  // Set month name
  dates.monthName = dateObj.toLocaleString("en-US", { month: "long" });
}

// function get air directions

function getAirDirection(direction) {
  if (direction[0] === "N") {
    airDirection = "North";
  } else if (direction[0] === "E") {
    airDirection = "East";
  } else if (direction[0] === "W") {
    airDirection = "West";
  } else if (direction[0] === "s") {
    airDirection = "South";
  }
}

//       display functions

function displayWeather() {
  let cartona = `

              <div class="col-12 col-md-4 first rounded-start-4 mb-4">
                <div class="today-title p-1">
                  <span>${dates.daysName[0]}</span>
                  <span>${dates.day[0]} ${dates.monthName}</span>
                </div>

                <div class="todayweather_data">
                  <div class="location"><span>${data.location.name}</span></div>
                  <div
                    class="degree d-flex flex-column justify-content-center align-content-center"
                  >
                    <span class="ps-4 pe-1">${data.current.temp_c}°C</span>
                    <div class="img ps-5">
                      <img
                        src="https:${data.current.condition.icon}"
                        width="80px"
                        alt="weather-icon"
                      />
                    </div>
                  </div>

                  <div class="statues"><span>${data.current.condition.text}</span></div>
                  <div class="air_speed">
                    <span
                      ><img src="images/icon-umberella.png" alt="" />${data.current.humidity}%</span
                    >
                    <span><img src="images/icon-wind.png" alt="" />${data.current.wind_kph}km/h</span>
                    <span
                      ><img src="images/icon-compass.png" alt="" />${airDirection}</span
                    >
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4 mb-4 tomorow-color">
                <div class="tomorowtitle p-1"><span>${dates.daysName[1]}</span></div>
                <div class="icon mt-6 d-flex justify-content-center">
                  <img
                    src="https:${futureData.tomorow.day.condition.icon}"
                    width="80px"
                    alt="weather_icon"
                  />
                </div>
                <div class="mornning_degree d-flex justify-content-center pt-4">
                  <span>${futureData.tomorow.day.maxtemp_c}°C</span>
                </div>
                <div class="night_degree d-flex justify-content-center pt-2">
                  <span>${futureData.tomorow.day.mintemp_c}°C</span>
                </div>
                <div class="statues d-flex justify-content-center">
                  <span>${futureData.tomorow.day.condition.text}</span>
                </div>
              </div>

              <div
                class="col-12 col-md-4 mb-4 rounded-end-4 aftertomorow-color"
              >
                <div class="tomorowtitle p-1"><span>${dates.daysName[2]}</span></div>
                <div class="icon mt-6 d-flex justify-content-center">
                  <img
                    src="https:${futureData.afterTomorow.day.condition.icon}"
                    width="80px"
                    alt="weather_icon"
                  />
                </div>
                <div class="mornning_degree d-flex justify-content-center pt-4">
                  <span>${futureData.afterTomorow.day.maxtemp_c}°C</span>
                </div>
                <div class="night_degree d-flex justify-content-center pt-2">
                  <span>${futureData.afterTomorow.day.mintemp_c}°C</span>
                </div>
                <div class="statues d-flex justify-content-center">
                  <span>${futureData.afterTomorow.day.condition.text}</span>
                </div>
              </div>

`;

  document.getElementById("datacolums").innerHTML = cartona;
}

//      here is calling of programe

(async function () {
  await getLiveLocation();
  await getCityWeatherRes(currentLocation);
  await getFutuareWeatherRes(currentLocation);
  fillDates();
  getAirDirection(data.current.wind_dir);
  displayWeather();
})();

// funcation to get forcast response

async function getFutuareWeatherRes(city) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=b4d0582e709742feaf0103219252906&q=${city}&days=3`
    );

    if (response.ok) {
      let Data = await response.json();

      futureData.tomorow = Data.forecast.forecastday[0];
      futureData.afterTomorow = Data.forecast.forecastday[2];
    }
  } catch (error) {
    console.log(error);
  }
}
