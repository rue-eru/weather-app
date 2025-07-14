export interface WeatherResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    temperature_unit?: string;
    hourly_units: {
        time: string;
        temperature_2m: string;
    }
    hourly?: {
        time: string[];
        temperature_2m: number[];
        precipitation?: number[]; //rain/snow
        is_day: (0 | 1); // Day - 1; Night - 0
        apparent_temperature: number[]; //feels like temperature
        relative_humidity_2m: number[];
        cloud_cover: number[];
        weather_code?: number[];
    };
    daily?: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[]; 
        uv_index_max: number[];
        uv_index_clear_sky_max: number[];
        sunrise: string[];
        sunset: string[];
    }
    current_weather?: {
        temperature: number;
        windspeed: number; // km/h
        winddirection: number; //360deg
        weathercode: number; //weather for icons!
        time: string;
        
    }
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
