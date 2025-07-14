import { useTranslation } from "react-i18next";
import { WeatherResponse } from "../types/weather";
import { getHumidityData } from "../utils/weatherUtils";
import { getWindowStyles } from "../utils/weatherUtils";
import HoverCloud from "./HoverCloud";

interface HumidityDisplayProps {
    data: WeatherResponse;
}

const HumidityDisplay = ({data}: HumidityDisplayProps) => {
    const { humidity } = getHumidityData(data);
    const { t } = useTranslation();

    if (humidity === undefined) {
        console.debug(t('Humidity-unavailable'), {
            time: data.current_weather?.time,
            hourlyTimes: data.hourly?.time?.slice(0, 5)
        })
        return <div className="text-sm text-gray-400">N/A</div>
    }

    if (!data.current_weather?.time) return 0;
    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);
    
    return (

        <div 
            className={`relative group w-full flex flex-col items-center justify-center text-center window-style ${windowClass}`}
        >
            <HoverCloud 
                text={t("Humidity")}
                className={`${windowClass}`}

            >
                
                <img
                    src={`./images/component window icons/humidity.png`}
                    alt='humidity'
                    className='window-icon'
                    draggable="false"
                />
                <span className="font-bold">{Math.round((humidity))}%</span>
            </HoverCloud>

        </div>

    )
}

export default HumidityDisplay