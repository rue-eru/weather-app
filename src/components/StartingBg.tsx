import { ReactNode, useEffect, useState } from "react"

interface StartingBgProps {

    children?: ReactNode;
}

const StartingBg = ({ children }: StartingBgProps) => {
    const [icons, setIcons] = useState<{ src: string; id: string}[]>([]);

    useEffect(() => {
        const folder = 'images/weather-variable/';
        const icon_names = ['clear', 'clear-night', 'clouds', 'drizzle', 'fog', 'freezing rain', 'overcast', 'partly-clear', 'partly-clear-night' , 'partly-cloudy', 'partly-cloudy-night' , 'rain', 'snow', 'thunderstorm']

        const indices = Array.from({ length: icon_names.length }, (_, i) => i );
        //shuffle
        for ( let i = indices.length - 1; i > 0; i-- ) {
            const a = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[a]] = [indices[a], indices[i]];
        }

        const randomIndices = indices.slice(0, 5);

        const getIcon = randomIndices.map((ind, i) =>({
            src: `${folder}${icon_names[ind]}.png`,
            id: `${icon_names[ind]}-${i}-${Date.now()}}`
        }))
    
        setIcons(getIcon);
    }, [])

    return (
        <div className="starting-screen fixed inset-0 -z-10 ">
            <div className="flex flex-nowrap justify-center gap-10 pt-50 pb-8 px-4">
                {icons.map((icon) => (
                    <img
                        key={icon.id}
                        src={icon.src}
                        alt=""
                        className="opacity-90 w-16 h-16 "
                        style={{
                            /*top: `${(Math.random() * 20) + 20}%`,
                            left: `${(Math.random() * 40) + 20}%`,*/
                            animation: `float ${8 + Math.random() * 10}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}  
                    />
                ))}
            </div>
            {children}
        </div>

    )
}

export default StartingBg