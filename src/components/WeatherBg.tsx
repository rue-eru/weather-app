import { WeatherResponse } from "../types/weather"
import { getTimeOfDayClass } from "../utils/weatherUtils"
import ShootingStar from "./bgAnimations/ShootingStar";
import Stars from "./Stars";
import MorningBirds from "./bgAnimations/MorningBirds";
import Clouds from "./bgAnimations/Clouds";
import FlickerDots from "./bgAnimations/FlickerDots";

interface WeatherBgProps {
    data: WeatherResponse;
    className?: string;
}

const WeatherBg = ({ data, className = "" }: WeatherBgProps) => {

    const weatherTime = data.current_weather?.time;
    const timeOfDayClass = weatherTime
        ? getTimeOfDayClass(new Date(weatherTime), data)
        : "";
    const isNight = timeOfDayClass === "bg-night";
    const isMorning = timeOfDayClass === "bg-morning";
    const isDay = timeOfDayClass === "bg-day";
    const isEvening = timeOfDayClass === "bg-evening";

    if (!weatherTime) return null;

    return (
        <div className={`transition-bg ${timeOfDayClass} ${className}`}>

            {isNight && (
                <div className="absolute inset-0 overflow-hidden z-0">
                    <Stars />
                    <ShootingStar/>
                </div>
            )}

            {isMorning && <MorningBirds/>}

            {isDay && <Clouds/>}

            {isEvening && <FlickerDots/>}

        </div>
    )
}

export default WeatherBg