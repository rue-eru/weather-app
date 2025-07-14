import { useTranslation } from "react-i18next";
import { WeatherResponse } from "../types/weather";
import { getWindowStyles } from "../utils/weatherUtils";
import HoverCloud from "./HoverCloud";

interface WindDisplayProps {
    data: WeatherResponse;
    unit?: 'km/h' | 'mp/h';
}


const WindDisplay = ({ data, unit = 'km/h' }: WindDisplayProps) => {
    const { t } = useTranslation();
    
    const DIRECTIONS = [
        t('direction.north'),
        t('direction.northeast'),
        t('direction.east'),
        t('direction.southeast'),
        t('direction.south'),
        t('direction.southwest'),
        t('direction.west'),
        t('direction.northwest'),
    ];

    if (!data.current_weather) return <div>{t("wind-loading")}</div>


    const getCompassDirection = (deg: number): string => {
        const index = Math.round(deg / 45) % 8;
        return DIRECTIONS[index];
    }

    const convertWindSpeed = (speed: number) => {
        return unit === 'mp/h' ? speed * 0.621371 : speed;
    }

    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);

    const translatedUnit = t(unit === 'mp/h' ? 'units.mph' : 'units.kmh')

    return (
        <div 
            className={`relative group w-full flex flex-col items-center justify-center text-center window-style font-bold pt-4 ${windowClass}`}
            >
                <HoverCloud
                    text={t("wind-title")}
                    className={`${windowClass}`}
                >
      
                    <img
                        src={`images/component window icons/wind-rose.png`}
                        alt='wind-rose'
                        className='window-icon'
                        draggable="false"
                    />
                    <p>
                        {getCompassDirection(data.current_weather.winddirection)}
                    </p>
                    <p>
                        {convertWindSpeed(data.current_weather?.windspeed).toFixed(1)} {translatedUnit}
                    </p>
                </HoverCloud>

        </div>
        
    )
}

export default WindDisplay