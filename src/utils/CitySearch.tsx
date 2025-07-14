import { useState } from "react";
import { getBtnStyle, getInputStyle } from "./weatherUtils";
import { WeatherResponse } from "../types/weather";
import { useTranslation } from "react-i18next";

interface CitySearchProps {
    onSearch: (city: string) => void;
    data: WeatherResponse | null;
}

const CitySearch = ({ onSearch, data }: CitySearchProps ) => {
    const [city, setCity] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(city)
        }
    }

    //if no data fallback to default styles
    const date = data?.current_weather?.time 
        ? new Date(data.current_weather.time) 
        : new Date();
    const inputClass = getInputStyle(date, data);
    const btnClass = getBtnStyle(date, data);

    return (
        <form 
            onSubmit={handleSubmit} 
            className="flex gap-2 -mb-2 p-4">
                <input
                    id="search-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("City Name (min 3 letters)")}
                    className={`flex-1 p-2 rounded ${inputClass}`}
                />
                <button
                    id="search-btn"
                    type="submit"
                    onClick={() => onSearch(city)}
                    className={`px-4 py-2 rounded transition-colors ${btnClass}`}
                >{t('Search')}
                </button>
        </form>
    )
}

export default CitySearch