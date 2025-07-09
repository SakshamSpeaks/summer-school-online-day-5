// Hooking the click event to our button
document.getElementById("getWeather").addEventListener("click", () => {
    const displayBox = document.getElementById("weatherResult");
    const unitCheckbox = document.getElementById("unitToggle");

    // Figuring out if we're using Fahrenheit
    const wantsFahrenheit = unitCheckbox.checked;
    const selectedUnit = wantsFahrenheit ? "f" : "c"; // could’ve used this later, left in just in case
    const tempSymbol = wantsFahrenheit ? "°F" : "°C";

    // Some quick user feedback while things load
    displayBox.innerHTML = "<p>Fetching weather...</p>";

    // Just double-checking geolocation is even a thing
    if (!navigator.geolocation) {
        displayBox.innerHTML = "<p>Geolocation not supported by this browser.</p>";
        return;
    }

    // Grab the user's current location
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

    // When we get the location successfully
    function handleSuccess(positionInfo) {
        const latitude = positionInfo.coords.latitude;
        const longitude = positionInfo.coords.longitude;

        const apiKey = "b559911eff7345c0b5a102615250907"; // yeah, this should be in env vars really
        const endpoint = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

        // Fetch the weather from the API
        fetch(endpoint)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Something went wrong with the weather API...");
                }
                return res.json(); // still need to parse JSON
            })
            .then((weatherData) => {
                // Extracting stuff we care about
                const place = weatherData.location.name;
                const region = weatherData.location.region;
                const temp = wantsFahrenheit ? weatherData.current.temp_f : weatherData.current.temp_c;
                const skyStatus = weatherData.current.condition.text;
                const iconUrl = weatherData.current.condition.icon;

                // Populating the output div with actual weather info
                displayBox.innerHTML = `
                    <h3>${place}, ${region}</h3>
                    <img src="https:${iconUrl}" alt="Weather Icon" />
                    <p><strong>${temp} ${tempSymbol}</strong></p>
                    <p>${skyStatus}</p>
                `;
            })
            .catch((err) => {
                console.warn("Weather fetch error:", err);
                displayBox.innerHTML = "<p>Could not fetch weather data. Try again later?</p>";
            });
    }

    // If geolocation fails (user says no, or some error)
    function handleError() {
        displayBox.innerHTML = "<p>Permission denied or location unavailable.</p>";
    }
});
