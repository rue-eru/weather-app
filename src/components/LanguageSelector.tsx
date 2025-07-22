import { useState } from "react";
import { useTranslation} from "react-i18next";
import { languages } from "@/utils/weatherUtils";

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [ isOpen, setIsOpen ] = useState(false);
    const currentLang = i18n.language;

    const changeLang = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    }

    const currentLangObj = languages.find((lng) => lng.code === currentLang) || languages[0];


    return (
        <div>
            {/* active btn*/}
            <button
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-400"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <img
                    src={`./images/language-icons/${currentLangObj.code}.png`}
                    alt={currentLangObj.lang}
                    className="w-full h-full object-cover"
                />
            </button>

            {/*dropdown*/}
            {isOpen && (
                <div className="absolute p-2 bg-[#ffffff3c] mt-3 -ml-2 space-y-3 rounded shadow-md z-50">
                    {languages
                        .filter((lng) => lng.code !== currentLang)
                        .map((lng) => (
                            <button
                                key={lng.code}
                                onClick={() => changeLang(lng.code)}
                                className="w-8 h-8 rounded-full overflow-hidden hover:scale-105 transition"
                            >
                                <img 
                                    src={`./images/language-icons/${lng.code}.png`}
                                    alt={lng.lang}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                    ))}
                </div>)}
        </div>
)
}

export default LanguageSelector