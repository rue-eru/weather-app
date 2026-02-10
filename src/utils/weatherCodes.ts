export const WEATHER_DATA: Record<number, { icon: string; description: string }> = {
    0: { 
        icon: 'clear',
        description: 'weather.0',
    },

    //Clouds
    1: {
        icon: 'partly-clear',
        description: 'weather.1',
    },
    2: {
        icon: 'partly-cloudy',
        description: 'weather.2',
    },
    3: {
        icon: 'overcast',
        description: 'weather.3',
    },

    //Fog
    45: { 
        icon: 'fog',
        description: 'weather.45',
    },
    48: {
        icon: "fog",
        description: 'weather.48',
    },

    //same icon as for rain
    51: {
        icon: 'drizzle',
        description: 'weather.51',
        //light
    }, 
    53: {
        icon: 'drizzle',
        description: 'weather.53',
        //moderate
    }, 
    55: {
        icon: 'drizzle',
        description: 'weather.55',
        //dense
    }, 

    //same icon as for freezing rain
    56: { 
        icon: 'freezing-rain',
        description: 'weather.56',
         //light freezing drizzle
    },
    57: { 
        icon: 'freezing-rain',
        description: 'weather.57',
         //dense freezing drizzle
    },

    61: {
        icon: 'rain', 
        description: 'weather.61',
        //slight
    },
    63: {
        icon: 'rain', 
        description: 'weather.63',
        //moderate
    },
    65: {
        icon: 'rain', 
        description: 'weather.65',
        //heavy
    },

    66: {
        icon: 'freezing rain', 
        description: 'weather.66',
        //light
    },
    67: {
        icon: 'freezing rain', 
        description: 'weather.67',
        //heavy
    },

    
    71: {
        icon: 'snow',
        description: 'weather.71',
        //slight
    },
    73: {
        icon: 'snow', 
        description: 'weather.73',
        //moderate
    },
    75: {
        icon: 'snow', 
        description: 'weather.75',
        //heavy
    },
    77: {
        icon: 'snow', 
        description: 'weather.77',
        //grains
    },

    //the same as for rain
    80: {
        icon: 'rain', 
        description: 'weather.80',
        //slight shower 
    },
    81: {
        icon: 'rain', 
        description: 'weather.81',
        //moderate shower 
    },
    82: {
        icon: 'rain', 
        description: 'weather.82',
        //violent shower
    },

    //the same as for snow
    85: {
        icon: 'snow', 
        description: 'weather.85',
        // slight snow shower 
    },
    86: {
        icon: 'snow', 
        description: 'weather.86',
        //heavy snow shower
    },

    95: {
        icon: 'thunderstorm', 
        description: 'weather.95',
        // slight or moderate / only available in Central Europe
    },
    96: {
        icon: 'thunderstorm', 
        description: 'weather.96',
        // with slight / only available in Central Europe
    },
    99: {
        icon: 'thunderstorm',
        description: 'weather.99',
        // with heavy hail / only available in Central Europes
    },
}

export const getWeatherData = (code: number) => {
    const weather = WEATHER_DATA[code];

    return {
        icon: weather?.icon || 'unknown',
        description: weather?.description || 'Unknown weather condition',
        severity: 
            code >= 65 || code >= 82 || code >= 86
                ? "sever"
                : code >= 53 || code >= 63 || code >= 73
                ? "moderate"
                : "light",
    }
}


export const getWeatherIcon = (code: number): string =>
    WEATHER_DATA[code]?.icon || 'unknown';

export const getWeatherDescription = (code: number): string => 
    WEATHER_DATA[code]?.description || "weather.unknown";

/*
The type assertion code as keyof typeof WEATHER_DESCRIPTIONS is used because:
WEATHER_DESCRIPTIONS is typed as Record<number, string>
TypeScript needs to know the exact number keys we defined
It ensures we only use valid weather codes that exist in our descriptions 
*/
