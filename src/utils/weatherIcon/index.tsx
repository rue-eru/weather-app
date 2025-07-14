import { WeatherResponse } from "../../types/weather";
import { WEATHER_DATA, getWeatherDescription } from "../weatherCodes";
import { getTimeOfDayClass } from "../weatherUtils";
import styles from './WeatherIcon.module.css';

interface WeatherIconProps {
    code: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    data: WeatherResponse | null;
    timezone?: string;
    time?: string;
}

export const WeatherIcon = ({code, size = 'md', className = '', data, timezone, time} : WeatherIconProps ) => {
    
    const iconType = WEATHER_DATA[code]?.icon || 'unknown';

    const targetTime = time ? new Date(time) : (data?.current_weather?.time ? new Date (data.current_weather.time) : null)
    const timeClass = getTimeOfDayClass(
        targetTime, data, timezone
    );
    const isNight = timeClass === 'bg-night';

    const hasNightVar = [
        'clear',
        'partly-clear',
        'partly-cloudy',
    ].includes(iconType);

    const getIconPath = () => {
        const basePath = `/images/weather_variable/`;

        if (hasNightVar && isNight) {
            return `${basePath}${iconType}-night.png`
        } 
        return `${basePath}${iconType}.png`
    }


    
    return (
        <img
        src={getIconPath()}
            alt={getWeatherDescription(code)}
            className={`${styles.WeatherIcon} ${styles[size]} ${className}}`}
            draggable="false"
            onError={(e) => {
                (e.target as HTMLImageElement).src = `/images/weather_variable/unknown.png`
            }}
        />
    )
}
