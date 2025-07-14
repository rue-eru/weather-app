import { WeatherResponse } from "../types/weather";
import { formatTemperature, getTempUnitSymbol } from "../utils/weatherUtils";
import { TemperatureUnit } from "../types/weather";
import { getWindowStyles } from "../utils/weatherUtils";
import { WeatherIcon } from "../utils/weatherIcon";
import { useEffect, useRef } from "react";

interface NextHoursTempProps {
    data: WeatherResponse;
    unit: TemperatureUnit;
    rounded?: boolean;
    timezone?: string;
}

const NextHoursTemp = ({ data, unit, rounded = true, timezone }: NextHoursTempProps) => {
    const scrollRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0 ) return; //only on vertical wheel
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        };

        container.addEventListener('wheel', onWheel, { passive: false});

        return () => container.removeEventListener('wheel', onWheel);
    }, []);  
    
    const now = new Date(data.current_weather?.time || Date.now())
    const hourlyData = (data.hourly?.time || [])
        .map((time: string, idx: number) => ({
            time,
            //fallback temperature 0
            temp: data.hourly?.temperature_2m?.[idx] || 0,
            code: data.hourly?.weather_code?.[idx] || 0,
        }))
        .filter(({ time }) => new Date(time) >= now)
        .slice(0, 24);

    if (!data.current_weather?.time) return 0;
    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);

    return (
        <div className={`window-style mt-5 w-full p-5 ${windowClass}`}>
            <ul 
                ref={scrollRef}
                className="inline-flex space-x-4 md:space-x-6 space-y-1 overflow-x-auto w-full scrollbar-style"
                
            >
                {hourlyData.map((hour) => (
                    <li 
                        key={hour.time} 
                        className="flex flex-col items-center min-w-[50px]"
                    >
                        <span>
                            {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                        </span>
                        <span className="font-medium">
                            {formatTemperature(hour.temp, 'celsius', unit, rounded)}{getTempUnitSymbol(unit)}
                        </span>
                        <WeatherIcon
                            code={hour.code}
                            size="sm"
                            className="flex-1"
                            data={data}
                            timezone={timezone}
                            time={hour.time}
                        />
                    </li>
                ))}
            </ul>
    
        </div>
    )
}

export default NextHoursTemp