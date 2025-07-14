import './index.css'
import WeatherCard from './components/WeatherCard'
import { useState } from 'react'
import { WeatherResponse } from './types/weather'
import { fetchCityCoordinates, fetchWeather } from './utils/fetchWeather';
import CitySearch from './utils/CitySearch';
import { TemperatureUnit } from './types/weather';
import WeatherBg from './components/WeatherBg';
import CityInfoDisplay from './components/CityInfoDisplay';
import { capitalize } from './utils/weatherUtils';
import StartingBg from './components/StartingBg';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { UVData } from './types/openUV';
import { getFontClass } from './utils/weatherUtils';

function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [cityName, setCityName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uvData, setUvData] = useState<UVData | null>(null);
  const { t } = useTranslation();
  const fontClass = getFontClass(i18next.language)

  const handleSearch = async (city: string) => {
    try {
      setIsLoading(true);

      // city name => coordinates
      const coords = await fetchCityCoordinates(city, i18next.language);

      // coords => weather
      const [weatherData, uvResponse] = await Promise.all([
        fetchWeather({
        latitude: coords.latitude,
        longitude: coords.longitude,
        temperature_unit: 'celsius',
        hourly: 'temperature_2m,precipitation,is_day,relative_humidity_2m,apparent_temperature,cloud_cover,weather_code',
        daily: 'temperature_2m_min,temperature_2m_max,sunrise,sunset,uv_index_max',
        current_weather: true,
        timezone: 'auto'
        }),
        fetch(`https://api.openuv.io/api/v1/uv?lat=${coords.latitude}&lng=${coords.longitude}`, {
          headers: { 'x-access-token': 'openuv-35g35rmbkpiv3m-io'}
        })
      ]);

      const uvData = await uvResponse.json();

      setCityName(coords.display_name);
      setWeather(weatherData);
      setUvData(uvData.result);
      setUnit('celsius');
      setError(null)
    } catch (err) {
      console.error('Full error:', err); // This will show more details
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message)
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!weather 
      ? (
        <StartingBg />
      ) : (
        <WeatherBg 
          data={weather} 
        />
      )}

      <div className='fixed sm:absolute top-2 right-4 z-50'>
        <LanguageSelector/>
      </div>

        <div className={`${fontClass} relative z-10 min-w-[320] w-full mx-auto px-4`}>
          <CitySearch 
            onSearch={handleSearch}
            data={weather || null} 
          />

          {error && <div className='error-message'>{t(error)}</div>}
          {isLoading && (
            <div className='fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm text-white'>
              <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4'></div>
              <p className='text-lg font-semibold' style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>{t('loading')}</p>
              <p className='text-lg font-semibold' style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>{t('loading-wait')}</p>

            </div>)}

          {weather && !isLoading && (
            <>
              <CityInfoDisplay
                unit={unit}
                onUnitToggle={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
                resetUnitToCelsius={() => setUnit('celsius')}
                cityName={capitalize(cityName)}
                data={weather}
                longitude={weather.longitude}
                latitude={weather.latitude}
              />
              <WeatherCard 
                data={weather} 
                unit={unit}
                UVdata={uvData}
              />
            </>
          )}
        </div>

    </>
  )
}

export default App
