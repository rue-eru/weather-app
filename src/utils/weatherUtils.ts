import moment from "moment-timezone";
import { WeatherResponse } from "../types/weather";
import i18next from 'i18next';

export const converTemp = (
    temp: number, 
    fromUnit: 'celsius' | 'fahrenheit',
    toUnit: 'celsius' | 'fahrenheit'
): number => {
    if (fromUnit === toUnit) return temp; 
    if (toUnit === 'fahrenheit') return (temp * 9/5) + 32;
    return (temp - 32) * 5/9;
}

export const getTempUnitSymbol = (unit: 'celsius' | 'fahrenheit') => {
    return unit === 'celsius' ? '°C' : '°F';
};

export const formatTemperature = (
    baseTemp: number,
    fromUnit: 'celsius' | 'fahrenheit',
    toUnit: 'celsius' | 'fahrenheit',
    rounded: boolean = true
): string => {
    const converted = converTemp(baseTemp, fromUnit, toUnit);
    return rounded ? Math.round(converted).toString() : converted.toFixed(1);
}

export const getCurrentHourlyIndex = (data: WeatherResponse): {
    hourlyIndex: number;
    currentTime: string | undefined;
} => {
    const currentTime = data.current_weather?.time;
    const hourlyIndex = data.hourly?.time?.findIndex(t => t === currentTime) ?? -1

    return { currentTime, hourlyIndex}
}
//findIndex returns the index of the first element that matches condition

export const getHumidityData = (data: WeatherResponse) => {
    const { currentTime, hourlyIndex } = getCurrentHourlyIndex(data);
    
    // Fallback: Find closest hour if exact match fails
    if (hourlyIndex === -1 && currentTime && data.hourly?.time) {
        const currentTimestamp = new Date(currentTime).getTime();
        let closestIndex = -1;
        let smallestDiff = Infinity;
        
        data.hourly.time.forEach((time, index) => {
            const diff = Math.abs(new Date(time).getTime() - currentTimestamp);
            if (diff < smallestDiff && diff < 5400000 /* 90 minutes */) {
                smallestDiff = diff;
                closestIndex = index;
            }
        });
        
        return {
            humidity: closestIndex >= 0 ? data.hourly.relative_humidity_2m?.[closestIndex] : undefined,
            hourlyIndex: closestIndex,
            currentTime
        };
    }
    
    return {
        humidity: hourlyIndex >= 0 ? data.hourly?.relative_humidity_2m?.[hourlyIndex] : undefined,
        hourlyIndex,
        currentTime
    };
};

export const getTimeOfDayClass = (
    date: Date | null, 
    data: WeatherResponse | null, 
    timezone?: string
) => {
    if (!data) return 'starting-screen';

    const hour = timezone 
        ? moment(date || data.current_weather?.time).tz(timezone).hours()
        : (date 
            ? date.getHours()
            : new Date(data.current_weather?.time ?? 0).getHours()
        );

    if (hour >= 5 && hour < 11) return "bg-morning";
    if (hour >= 11 && hour < 17) return "bg-day";
    if (hour >= 17 && hour < 21) return "bg-evening";
    return "bg-night";
}


export const capitalize = (str: string, language?: string) => {
    if (!str) return "";

    const lang = language || 'en';
    if (lang === 'ja') {
        return str;
    }
    return str
        .split(' ')
        .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
        .join(' ');
}

export const getWindowStyles = (date: Date| null, data: WeatherResponse | null) => {
    const timeClass = getTimeOfDayClass(date, data);

    switch (timeClass ) {
        case "bg-day":
            return "window-day";
        case "bg-evening":
            return "window-evening";
        case "bg-morning":
            return "window-morning";
        case "bg-night":
            return "window-night";
        case 'starting-screen':
        default: return "window-start"
    }
}

export const getBtnStyle = (date: Date | null, data: WeatherResponse | null) => {
    const timeClass = getTimeOfDayClass(date, data);

    switch (timeClass) {
        case "bg-day":
            return 'hover:bg-blue-100 bg-white hover:font-bold text-cyan-600 border border-blue-300 shadow hover:shadow-xl transition duration-300 hover:scale-90 hover:ring-1/2 hover:ring-offset-2 hover:ring-offset-cyan-600';
        case "bg-evening":
            return 'hover:bg-pink-100 bg-pink-50 hover:font-bold text-rose-600 border border-rose-300 shadow hover-shadow-md transition duration-300 hover:scale-90 hover:ring-1/2 hover:ring-offset-2 hover:ring-offset-red-600';
        case "bg-morning":
            return 'hover:bg-orange-100 bg-orange-50 hover:font-bold text-orange-900 border border-orange-300 shadow-lg hover:shadow-lg hover:shadow-amber-900 transition duration-300 hover:scale-90 hover:ring-1/2 hover:ring-offset-2 hover:ring-offset-pink-900';
        case "bg-night":
            return 'hover:bg-cyan-500 bg-cyan-700 text-sky-50 hover:font-bold border border-cyan-500 shadow-xl hover:shadow-sky-950 transition duration-300 hover:scale-90 hover:ring-1/2 hover:ring-offset-2 hover:ring-offset-blue-300';
        case 'starting-screen':
            default: return "hover:bg-pink-700 bg-pink-600 text-white hover:font-bold border border-pink-800 shadow-lg hover:shadow-pink-900 transition duration-300 hover:scale-90 hover:ring-1/2 hover:ring-offset-2 hover:ring-offset-pink-900"

    }
}    

export const getInputStyle = (date: Date | null, data: WeatherResponse | null) => {
    const timeClass = getTimeOfDayClass(date, data);

    switch (timeClass) {
        case "bg-day":
            return 'hover:bg-blue-100 bg-white text-cyan-600 border border-blue-300 shadow hover:shadow-xl transition duration-300 focus:outline-solid placeholder-cyan-600';
        case "bg-evening":
            return 'hover:bg-pink-100 bg-pink-50 text-rose-600 border border-rose-300 shadow hover-shadow-md transition duration-300 focus:outline-solid  placeholder-rose-600';
        case "bg-morning":
            return 'hover:bg-orange-100 bg-orange-50 text-orange-900 border border-orange-300 shadow-md hover:shadow-lg transition duration-300 focus:outline-solid focus:outline-red-200 placeholder-orange-900';
        case "bg-night":
            return 'hover:bg-indigo-950 bg-indigo-950 text-cyan-50 border border-slate-800 shadow-lg hover:shadow-sky-950 transition duration-300 placeholder-cyan-50 focus:outline-solid focus:outline-cyan-600';
        case 'starting-screen':
            default: return "hover:bg-blue-100 bg-white text-pink-900 border border-blue-300 shadow hover:shadow-xl transition duration-300 focus:outline-solid placeholder-pink-900"
    }
}  

export const getTextStyles = (date: Date| null, data: WeatherResponse | null) => {
    const timeClass = getTimeOfDayClass(date, data);

    switch (timeClass ) {
        case "bg-day":
            return "text-black";
        case "bg-evening":
            return "text-[whitesmoke]";
        case "bg-morning":
            return "text-black";
        case "bg-night":
            return "text-[aliceblue]";
        case 'starting-screen':
        default: return "text-white"
    }
}


interface NamedDetails {
    name: string;
    [key: string]: string | undefined;
}

interface Address {
    country?: string;
}

export const formatLocationName = (
  address: Address,
  namedetails: NamedDetails,
  language: string,
): string => {
  const cityName = namedetails[`name:${language}`] || namedetails.name || i18next.t('unknown');
  const countryName = capitalize(address.country || i18next.t('unknown'));

  const formattedCity = capitalize(cityName, language);
  const formattedCountry = capitalize(countryName, language);

  return `${formattedCity}, ${formattedCountry}`;
}

export const getFontClass = (lang: string) => {
    if (lang.startsWith("ja")) return "font-japanese";
    if (lang.startsWith("ru")) return "font-russian";
    return "font-english";
  };

  export const languages = [
    {code: 'en', lang: "English"},
    {code: 'ru', lang: "Русский"},
    {code: 'ja', lang: "日本語"},
];