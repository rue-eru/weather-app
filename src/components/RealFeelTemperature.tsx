import { WeatherResponse } from "../types/weather";
import { getCurrentHourlyIndex, getTempUnitSymbol, formatTemperature } from "../utils/weatherUtils";
import { getWindowStyles } from "../utils/weatherUtils";
import { useTranslation } from "react-i18next";
import HoverCloud from "./HoverCloud";

interface RealFeelTemperatureProps {
    data: WeatherResponse
    unit: 'celsius' | 'fahrenheit';
    rounded?: boolean
}

const RealFeelTemperature = ({ data, unit = 'celsius', rounded = true }: RealFeelTemperatureProps) => {
    const { t } = useTranslation();
    const realTempIconUrl = "public/images/component-window-icons/temperature.png?as=webp&width=10"

    if (!data.current_weather) return null;

    const { hourlyIndex } = getCurrentHourlyIndex(data);

    const currentTemp = data.current_weather.temperature;
    const apparentTemp = hourlyIndex >= 0
        ? data.hourly?.apparent_temperature?.[hourlyIndex]
        : currentTemp;

    const displayTemp = formatTemperature(
        apparentTemp ?? data.current_weather.temperature, 
        'celsius',
        unit,
        rounded
    );

    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);

    return(
        
            <div 
                className={`relative group w-full flex flex-col items-center justify-center text-center window-style ${windowClass}`}
            >
                <HoverCloud 
                    text={t("Feels like temperature")}
                    className={`${windowClass}`}
                >
                        <img
                            src={realTempIconUrl}
                            alt={t("Feels like temperature")}
                            className='window-icon'
                            draggable="false"
                            loading="lazy"
                            sizes="10px"
                        />
                        {/*{feelsLikeTemp.toFixed(1)}*/}
                        <p className="font-bold">
                            {displayTemp}
                            {getTempUnitSymbol(unit)}
                        </p>
                </HoverCloud>

            </div>

    )
}

export default RealFeelTemperature