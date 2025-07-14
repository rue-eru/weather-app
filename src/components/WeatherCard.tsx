import { WeatherResponse } from "../types/weather";
import { TemperatureUnit } from "../types/weather";
import UVIndicator from "./UVIndicator";
import HumidityDisplay from "./HumidityDisplay";
import WindDisplay from "./WindDisplay";
import RealFeelTemperature from "./RealFeelTemperature";
import NextHoursTemp from "./NextHoursTemp";
import TodayWeatherInfoDisplay from "./TodayWeatherInfo";
import { useTranslation } from "react-i18next";
import { UVData } from "../types/openUV";

interface WeatherCardProps {
    data: WeatherResponse,
    unit: TemperatureUnit,
    UVdata: UVData | null,
}

const WeatherCard = ({ data, unit, UVdata}: WeatherCardProps) => {
    const { t } = useTranslation();
    if (!data.current_weather) {
        return <div>{t("weather-loading")}</div>;
    }

    return (
        <div className="bg-transparent p-4 rounded-xl  text-black ">
            
            <TodayWeatherInfoDisplay
                data={data}
                unit={unit}
            />

            <NextHoursTemp 
                data={data}
                unit={unit}
            />

            <div className="grid grid-cols-2 h-80 sm:grid-cols-4 gap-3 sm:w-full sm:h-30 mt-5">

                <UVIndicator 
                     uvData={UVdata}
                     data={data}
                     latitude={data.latitude}
                     longitude={data.longitude}
                />

                <HumidityDisplay
                    data={data}
                />

                <RealFeelTemperature 
                    data={data}
                    unit={unit}
                />
                
                <WindDisplay 
                    data={data}
                />
            </div>
        </div>
    );
};

export default WeatherCard