import { WeatherIcon } from "../utils/weatherIcon";
import { WEATHER_DATA } from "../utils/weatherCodes";
import TemperatureDisplay from "./TemperatureDisplay";
import { WeatherResponse } from "../types/weather";
import { TemperatureUnit } from "../types/weather";
import { getWindowStyles } from "../utils/weatherUtils";
import { useTranslation } from "react-i18next";

interface TodayWeatherInfoProps {
    data: WeatherResponse | null;
    unit: TemperatureUnit;
    timezone?: string;
}

const TodayWeatherInfoDisplay = ({ data, unit, timezone }: TodayWeatherInfoProps) => {
    const { t } = useTranslation();
    
    const weatherCode = data?.current_weather?.weathercode ?? 0;
    const weatherTemp = data?.current_weather?.temperature ?? 0;

    if (!data?.current_weather?.time) return 0;
    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);

    return (
        <div className={`window-style p-5 flex w-full ${windowClass}`}>
                <WeatherIcon
                    code={weatherCode}
                    size="lg"
                    className="flex-1"
                    data={data}
                    timezone={timezone}
                />
                <div className="flex-1 text-left flex items-center ml-6">
                    <div>
                        <h3 className="font-semibold">{t(WEATHER_DATA[weatherCode]?.description || 'weather.unknown')}</h3>
                        <TemperatureDisplay
                            value={weatherTemp}
                            unit={unit}
                        />
                    </div>
                </div>
        </div>
    )
}

export default TodayWeatherInfoDisplay