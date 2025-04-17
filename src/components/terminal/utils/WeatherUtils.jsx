// WeatherUtils.js - Generate weather forecast with ASCII art

/**
 * Generate a weather forecast for a location
 * @param {string} location - Location for forecast
 * @returns {string} Formatted weather forecast with ASCII art
 */
export const generateWeatherForecast = (location) => {
    // Generate random weather conditions
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Windy', 'Foggy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    // Generate random temperature
    const temp = Math.floor(Math.random() * 35) + 40; // 40-75 degrees F

    // Generate random humidity
    const humidity = Math.floor(Math.random() * 40) + 30; // 30-70%

    // Generate random wind speed
    const wind = Math.floor(Math.random() * 20) + 1; // 1-20 mph

    // Generate random precipitation chance based on condition
    let precipChance = 0;
    switch (condition) {
        case 'Rainy':
            precipChance = Math.floor(Math.random() * 50) + 50; // 50-100%
            break;
        case 'Stormy':
            precipChance = Math.floor(Math.random() * 40) + 60; // 60-100%
            break;
        case 'Snowy':
            precipChance = Math.floor(Math.random() * 40) + 60; // 60-100%
            break;
        case 'Cloudy':
            precipChance = Math.floor(Math.random() * 30) + 10; // 10-40%
            break;
        default:
            precipChance = Math.floor(Math.random() * 10); // 0-10%
    }

    // Generate ASCII art based on condition
    let asciiArt = '';
    switch (condition) {
        case 'Sunny':
            asciiArt = `
    \\   |   /
     \\  |  /
      \\ | /
        o
      / | \\
     /  |  \\
    /   |   \\
                `;
            break;
        case 'Cloudy':
            asciiArt = `
      .--.
   .-(    ).
  (___.__)__)
                `;
            break;
        case 'Rainy':
            asciiArt = `
      .--.
   .-(    ).
  (___.__)__)
   ' ' ' ' '
  ' ' ' ' '
                `;
            break;
        case 'Stormy':
            asciiArt = `
      .--.
   .-(    ).
  (___.__)__)
   ' ' ' ' '
  ' ' / ' '
     /
    /
                `;
            break;
        case 'Snowy':
            asciiArt = `
      .--.
   .-(    ).
  (___.__)__)
   * * * * *
  * * * * *
                `;
            break;
        case 'Windy':
            asciiArt = `
    \\       /
     \\~~~~~/ 
      \\   /
       \\ /
        V
                `;
            break;
        case 'Foggy':
            asciiArt = `
  _ - _ - _ -
 _ - _ - _ - 
  - _ - _ - _
 _ - _ - _ - 
                `;
            break;
        default:
            asciiArt = `
    \\   |   /
        o
                `;
    }

    // Generate forecast for next few days
    const upcomingDays = generateUpcomingForecast(condition);

    return `=== Weather Forecast for ${location} ===\n` +
        `Condition: ${condition}\n` +
        `Temperature: ${temp}°F\n` +
        `Humidity: ${humidity}%\n` +
        `Wind: ${wind} mph\n` +
        `Precipitation: ${precipChance}%\n` +
        asciiArt +
        `\n=== 3-Day Forecast ===\n` +
        upcomingDays;
};

/**
 * Generate forecast for upcoming days based on current condition
 * @param {string} currentCondition - Current weather condition
 * @returns {string} 3-day forecast
 */
const generateUpcomingForecast = (currentCondition) => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Windy', 'Foggy'];
    const days = ['Tomorrow', 'Day 2', 'Day 3'];

    // Get current condition index
    const currentIndex = conditions.indexOf(currentCondition);

    let forecast = '';

    // Generate forecast for each day with some weather continuity
    for (let i = 0; i < 3; i++) {
        const dayName = days[i];
        let deviation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

        // Avoid array bounds
        let nextIndex = (currentIndex + deviation + conditions.length) % conditions.length;

        // Randomize more for further days
        if (i > 0) {
            deviation = Math.floor(Math.random() * 5) - 2; // -2 to 2
            nextIndex = (nextIndex + deviation + conditions.length) % conditions.length;
        }

        const temp = Math.floor(Math.random() * 35) + 40; // 40-75 degrees F
        forecast += `${dayName}: ${conditions[nextIndex]}, ${temp}°F\n`;
    }

    return forecast;
};