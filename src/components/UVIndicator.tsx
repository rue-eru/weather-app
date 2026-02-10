import { useEffect, useState } from "react";
import { WeatherResponse } from "../types/weather";
import { getWindowStyles } from "../utils/weatherUtils";
import { useTranslation } from "react-i18next";
import { UVData } from "../types/openUV";
import HoverCloud from "./HoverCloud";

interface UVIndicatorProps {
    uvData: UVData | null;
    data: WeatherResponse;
    latitude?: number;
    longitude?: number;
}

const UVIndicator = ({ uvData, data, latitude, longitude }: UVIndicatorProps) => {
    const { t } = useTranslation();
    const [uvValue, setUvValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const uvIconUrl = "public/images/component-window-icons/ultraviolet.png?as=webp&width=10"

    useEffect(() => {        
        if (uvData) {
            setUvValue(Math.round(uvData.uv));
            return
        }

        if (!latitude || !longitude) return;

        const fetchUV = async () => {
            setIsLoading(true);
            try {
                const response = await fetch (
                    `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`,
                    {
                        headers: { 'x-access-token': 'openuv-35g35rmbkpiv3m-io'}
                    }
                );

                if (!response.ok) {
                    throw new Error(`OpenUV API error: ${response.status}`);
                }

                const { result } = await response.json();
                setUvValue(Math.round(result.uv));

            }  catch (error) {
                console.error(t('UV-detection-failed'), error);
                const fallbckUv = data.daily?.uv_index_max?.[0] || 0;
                setUvValue(Math.round(fallbckUv));

            } finally {
                setIsLoading(false);
            }
        }
        fetchUV();
}, [latitude, longitude, data, uvData, t])
   

    if (!data.current_weather?.time) return 0;
    const date = new Date(data.current_weather?.time);
    const windowClass = getWindowStyles(date, data);

    return (
        <div
            className={`relative group w-full flex flex-col items-center justify-center text-center window-style ${windowClass}`}
        >
            <HoverCloud
                text={t("Ultraviolet radiation")}
                className={`${windowClass}`}
            >
                <div>
                    <img
                        src={uvIconUrl}
                        alt={t("Ultraviolet radiation")}
                        className='window-icon'
                        draggable="false"
                        loading="lazy"
                        sizes="10px"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-2 ${
                        !uvValue ? 'bg-gray-400' :
                        uvValue <= 2 ? 'bg-green-500' :
                        uvValue <= 5 ? 'bg-yellow-500' :
                        uvValue <= 7 ? 'bg-orange-500' :
                        'bg-red-500'
                    }`}>  
                        <span className=" text-white font-medium">{isLoading ? '...' : uvValue}</span>
                    </div>
                </div>
            </HoverCloud>
        </div>

    )
}

export default UVIndicator

{/*
API only provides uv_index_max and uv_index_clear_sky_max 
these are the only UV related parameters 
so actual UV might be slightly different
that's why we're currently fetching from OpenUV
also I tried to use check isDay to make a fallback to OpenMeteo's max uv data if OpenUV fails but it kept returning fallback to 0 so i gave up that idea too so the code is much more simple 
*/}