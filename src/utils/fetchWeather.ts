import axios from 'axios';
import { WeatherResponse } from '../types/weather';
import { TemperatureUnit } from '../types/weather';
import { formatLocationName } from './weatherUtils';

interface FetchWeatherParams {
    latitude: number;
    longitude: number;
    hourly?: string;
    daily?: string;
    current_weather?: boolean;
    temperature_unit?: TemperatureUnit;
    timezone?: "auto";
}

interface Coordinates {
    latitude: number;
    longitude: number;
    display_name: string;
}

export const fetchWeather = async (
    params: FetchWeatherParams
): Promise<WeatherResponse > => {
    const res = await axios.get<WeatherResponse>(
        "https://api.open-meteo.com/v1/forecast",
        { params }
    )

    return res.data
}

export const fetchCityCoordinates = async (
    cityName: string,
    language: string,
): Promise<Coordinates> => {
    const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
            params: {
                q: cityName,
                format: 'json',
                addressdetails: 1,
                namedetails: 1,
                limit: 1,
            },
            headers: {
                'Accept-Language': language,
                'User-Agent': 'WeatherApp/1.0 (shigoto.el@gmail.com)'
            },
        }
    ) ;

    const results = response.data;
    const firstResult = results[0];

    if (!results.length) {
        throw new Error('City not found');
    }

    return {
        latitude: parseFloat(firstResult.lat),
        longitude: parseFloat(firstResult.lon),
        display_name: formatLocationName(firstResult.address, firstResult.namedetails, language)
    }
}