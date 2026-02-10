import i18next from "i18next";
import { useState } from "react";
import { useTranslation} from "react-i18next";
import HoverCloudInline from "./HoverCloudInline";
import { getWindowStyles } from "@/utils/weatherUtils";
import { WeatherResponse } from "@/types/weather";
import { getTextStyles } from "@/utils/weatherUtils";

interface CreditToggleProps {
    data: WeatherResponse | null;
}

const CreditToggle = ({data}: CreditToggleProps) => {
    const { t } = useTranslation();
    const [ isOpen, setIsOpen ] = useState(false);
    const currentLang = i18next.language;
    const isJapanese = currentLang === "ja";

    const date = data?.current_weather?.time 
        ? new Date(data.current_weather.time) 
        : new Date();
    const windowClass = getWindowStyles(date, data);
    const textClass = getTextStyles(date, data);
    const isBlack = textClass.includes("text-black");
    const lClass = "font-bold cursor-pointer inline-block";
    const toggleIcon = `${isBlack 
            ? `./images/others/@-black.png`
            : `./images/others/@-white.png`
        }?as=webp&width=10`

    return (
        <div
            className="flex items-center justify-end w-fit"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/*closed state*/}
            <img
                src={toggleIcon}
                alt={t('github-alt')}
                loading="lazy"
                sizes="5px"
                className={`w-8 h-8
                    ${isOpen ? "transition-transform duration-700 ease-in-out rotate-360" : " "} 
                    `}
            />

            {/*active text*/}
            <div className={`
                transition-all duration-300 delay-150
                whitespace-nowrap text-lg font-normal
                ${textClass}
                ${isOpen ? "opacity-100 ml-2 w-auto overflow-visible" : "opacity-0 w-0 ml-0 overflow-hidden"}
                ${isJapanese ? "mr-2 " : "ml-2"}
                `}>
                    <div style={{ minWidth: isOpen ? 'max-content' : '0'}}>
                        <p>
                            2025 {' '}
                            {isJapanese
                                ? <>
                                    <HoverCloudInline 
                                        text={t("profile")}
                                        className={`
                                            ${windowClass}
                                            left-1/2 transform -translate-x-1/2
                                        `}
                                        lang={currentLang}
                                    >
                                        <a
                                            href="https://github.com/rue-eru" 
                                            target='_blank'
                                            className={`${lClass}`}
                                            >L 
                                        </a>
                                    </HoverCloudInline>
                                        
                                    {' '}{t("Project by")}</>
                                : <>
                                    {t("Project by")}{' '}
                                    <HoverCloudInline
                                        text={t("profile")}
                                        className={`
                                            ${windowClass}
                                            left-1/2 transform -translate-x-1/2
                                        `}
                                        lang={currentLang}
                                    >
                                        <a
                                            href="https://github.com/rue-eru" 
                                            target='_blank'
                                            className={`${lClass}`}
                                            >L
                                        </a>
                                    </HoverCloudInline>
                                </>
                            }
    
                        </p>
                    </div>
            </div>
        </div>
)
}

export default CreditToggle