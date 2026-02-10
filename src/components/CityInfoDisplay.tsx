import { useEffect, useRef, useState } from "react";
import { TemperatureUnit, WeatherResponse } from "../types/weather"
import { capitalize, getBtnStyle, getWindowStyles,  } from "../utils/weatherUtils";
import axios from "axios";
import moment from "moment-timezone";
import { GeonamesResponse } from "../types/geonames";
import { useTranslation } from "react-i18next";

interface CityInfoDisplayProps {
    unit: TemperatureUnit;
    onUnitToggle: () => void;
    resetUnitToCelsius: () => void;
    cityName?: string;
    data: WeatherResponse;
    longitude?: number;
    latitude?: number;
}

const CityInfoDisplay = ({ unit, onUnitToggle, resetUnitToCelsius, cityName, data, latitude, longitude }: CityInfoDisplayProps) => {
    //it seems the open meteo api refreshes time once in fifteens minutes so it may be slightly inconsistent that's why we're usuing here another api for fetching timezones
    const [localTime, setLocalTime] = useState<string>('');
    const [timezone, setTimezone] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const prevCityRef = useRef<string | undefined>(undefined);
    const { t } = useTranslation();

    useEffect(() => {
        if (cityName && prevCityRef.current && prevCityRef.current !== cityName) {
            resetUnitToCelsius();
        }
        prevCityRef.current = cityName; //update ref
    }, [cityName, resetUnitToCelsius]);


    useEffect(() => {
        if (!latitude || !longitude) return;

        const getValidTz = (tz: string, offsetHours?: number): string => {
            //searching for a direct IANA zone by offset
            if (moment.tz.zone(tz)) return tz;

            //searching for the closest IANA zone by offset
            if (offsetHours !== undefined) {
                const possibleZones = moment.tz.names().filter(zone => {
                    return Math.abs(moment.tz(zone).utcOffset() / 60 - offsetHours) < 1;
                });
                if (possibleZones.length > 0) return possibleZones[0];
            }

            //fallback to a browzer tz
            return moment.tz.guess();
        }

        const fetchTz = async () => {
            try {
                // Geonames (latitude&longtude)
                const { data } = await axios.get<GeonamesResponse>(
                    `https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=rue_eru`,
                    { timeout: 3000 }
                );
            
                const offsetHours = data.gmtOffset 
                    ? data.gmtOffset / 3600
                    : 0; //undefined doesnt pass to detextedTz

                const detectedTz = data.timezoneId || `Etc/GMT${offsetHours >= 0 ? "-" : "+"}${Math.abs(offsetHours)}`;
                
                setTimezone(getValidTz(detectedTz, offsetHours));

            } catch (error) {
                console.error(t('timezone_detection_failed'), error);
                setTimezone(getValidTz(data?.timezone || ''));
            } finally {
                setIsLoading(false);
            }
        };

        fetchTz();
    }, [latitude, longitude, data, t]);

    useEffect(() => {
        if (!timezone) return;

        const updateTime = () => {
            try {
                setLocalTime(moment().tz(timezone).format('HH:mm'));
            } catch (error) {
                console.error(t('Error formatting time:'), error);
                setLocalTime(moment().format('HH:mm'))
            }
        }

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [timezone, t]);
    
    if (!data.current_weather?.time) return null;

    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);
    const btnClass = getBtnStyle(date, data);


    return (
        <div className="p-4 -mb-3">
            <div className={`flex items-center justify-between p-5 gap-2 window-style ${windowClass}`}>
                <div className="inline-flex items-center gap-4">
                    {cityName && 
                        <h2 className="text-xl font-bold">
                            {capitalize(cityName)}
                        </h2>
                    }
                    {isLoading ? (
                        <p className="text-xl">
                            {t('timezone-detection')}
                        </p>) : (
                         <p className="text-xl">
                            {localTime || '--:--'}
                        </p>                       
                        )
                    }
                </div>
                <button
                  onClick={onUnitToggle}
                  className={`px-4 py-2 rounded-lg font-bold border transition duration-200 ${btnClass}`}
                >
                  {unit === 'celsius' ? "°C": "°F"}
                </button>

            </div>
        </div>
    )
}

export default CityInfoDisplay