import { useEffect, useRef, useState } from "react";
import { WeatherResponse } from "../types/weather"
import { getTimeOfDayClass } from "../utils/weatherUtils"

declare const crypto: Crypto;

interface WeatherBgProps {
    data: WeatherResponse;
    className?: string;
}

interface Cloud {
    id: string;
    top: string;
    delay: string;
    src: string;
    left: string;
}

interface FlickerDot {
    id: string;
    top: string;
    left: string;
    delay: string;
    size: number;
}

type MorningBird = {
    id: string;
    top: string;
    scale: number;
    direction: 'left' | 'right';
    speed: number;
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

    const [shootingStarPosition, setShootingStarPosition] = useState<{
        left: string,
        delay: string
    } | null>(null);

    const [clouds, setClouds] = useState<Cloud[]>([]);
    const [flickerDots, setFlickerDots] = useState<FlickerDot[]>([]);
    const [morningBirds, setMorningBirds] = useState<MorningBird[]>([]);

    const morningBirdsRef = useRef<MorningBird[]>([]);
    const cloudsRef = useRef<Cloud[]>([]);
    const animationRefs = useRef<{
        shootingStar?: NodeJS.Timeout;
        clouds?: NodeJS.Timeout;
        birds?: NodeJS.Timeout;
    }>({});

    useEffect(() => {
        if(!isNight) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const shoot = () => {
            setShootingStarPosition(null);

            timeoutId = setTimeout(() => {
                const leftStar = `${Math.random() * 60}%`;
                
                setShootingStarPosition({
                    left: leftStar,
                    delay: "0s",
                });

                timeoutId = setTimeout(shoot, 10000) //10s
                animationRefs.current.shootingStar = timeoutId;
            }, 100); //animation can reset due to short timeout
        };

        timeoutId = setTimeout(shoot, 2000);
        animationRefs.current.shootingStar = timeoutId;
        const currentShootingStar = animationRefs.current.shootingStar;
        return () => {
            if (currentShootingStar) {
                clearTimeout(currentShootingStar)
            }
        };
    }, [isNight]);

    useEffect(() => {
        if(!isDay) return;
        setClouds([]);
        
        const initialClouds = Array.from({ length: 3}).map((_, i) => ({
                id: `cloud-${crypto.randomUUID()}`,
                top: `${Math.random() * 50 + 10}%`,
                delay: `${i * 0.5}s`,
                src: `/images/bg-assets/cloud-${Math.floor(Math.random() * 3) + 1}.png`,
                left: `${Math.random() * 100}%`
        }))

        setClouds(initialClouds);

        const spawnCloud = () => {
            const newCloud = {
                id: `cloud-${crypto.randomUUID()}`,
                top: `${Math.random() * 50 + 10}%`,
                delay: "0s",
                src: `/images/bg-assets/cloud-${Math.floor(Math.random() * 3) + 1}.png`,
                left: "-200px"
            };

            setClouds(prev => [...prev, newCloud]);
            cloudsRef.current = [...cloudsRef.current, newCloud]


            setTimeout(() => {
                setClouds((prev) => prev.filter((cloud) => cloud.id !== newCloud.id));
                cloudsRef.current = cloudsRef.current.filter((cloud) => cloud.id != newCloud.id);
            }, 40000);
        };   
        
        const interval = setInterval(() => {
                if (cloudsRef.current?.length < 5) {
                    spawnCloud();
                }
        }, 15000);
        animationRefs.current.clouds = interval;

        const currentCloudInterval = animationRefs.current.clouds;
        return () => {
            if(currentCloudInterval) {
                clearInterval(currentCloudInterval);
            }
        }
    }, [isDay]);

    useEffect(() => {
        if (!isEvening) return;
        setFlickerDots([]);

        const generateDots = () => {
            const dots = Array.from({ length: 30}).map(() => ({
                id: `dot-${crypto.randomUUID()}`,
                top: `${Math.random() * 90  + 5}%`,
                left: `${Math.random() * 90  + 5}%`,
                delay: `${Math.random() * 2}s`,
                size: 3 + Math.random() * 4,
            }));
            setFlickerDots(dots);
        };

        generateDots();
    }, [isEvening]);


    useEffect(() => {
        if (!isMorning) return;
        setMorningBirds([]);

        const initialBirds = Array.from( { length: 5 }).map(() => ({
            id: `bird-${crypto.randomUUID()}`,
            direction: Math.random() > 0.5 ? 'right' : 'left' as 'left' | 'right',
            top: `${Math.random() * 80 + 10}%`,
            scale: 0.3 + Math.random() * 0.7,
            speed: 20 + Math.random() * 10,
  
        }));

        setMorningBirds(initialBirds);
        morningBirdsRef.current = initialBirds;

        const spawnBird = () => {
            if (morningBirdsRef.current.length >= 15) return;

            const newBird = {
                id: `bird-${crypto.randomUUID()}`,
                direction: Math.random() > 0.5 ? 'right' : 'left' as 'left' | 'right',
                top: `${Math.random() * 80 + 10}%`,
                scale: 0.3 + Math.random() * 0.7,
                speed: 20 + Math.random() * 10,               
            };
        
            setMorningBirds((prev) => {
                const updated = [...prev, newBird];
                morningBirdsRef.current = updated;
                return updated;
            });

            setTimeout(() => {
                setMorningBirds((prev) => {
                    const updated = prev.filter(b => b.id !== newBird.id);
                    morningBirdsRef.current = updated;
                    return updated
                    });
            }, newBird.speed * 1000);
        };

        const interval = setInterval(() => {
                if (morningBirdsRef.current.length < 15 ) {
                    spawnBird();
            }
            
        }, 2000);
        animationRefs.current.birds = interval;

        const currentBirdInterval = animationRefs.current.birds;
        return () => {
            if (currentBirdInterval) {
                clearInterval(currentBirdInterval);
            }
        };
    }, [isMorning]);

    if (!weatherTime) return null;

    return (
        <div className={`transition-bg ${timeOfDayClass} ${className}`}>
            {isNight && (
                <div className="absolute inset-0 overflow-hidden z-0">
                    {[...Array(30)].map((_, i) => (
                        <span 
                            key={`star-${i}-${crypto.randomUUID()}`}
                            className="star"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                zIndex: Math.random() < 0.5 ? 0 : 1
                            }}
                        />
                    ))}
                    {shootingStarPosition && (
                        <span
                            className="shooting-star"
                            style={{
                               top: 0,
                               left: shootingStarPosition.left,
                               animationDelay: shootingStarPosition.delay,
                            }}
                        />
                    )}
                </div>
            )}

            {isMorning && (
                <div className="absolute inset-0 overflow-hidden z-0">
                    {morningBirds.map((bird) => (
                        <img 
                            key={bird.id}
                            src={`/images/bg-assets/bird-${bird.direction}.png`}
                            className={`absolute pointer-events-none`}
                            style={{
                                top: bird.top,
                                transform: `scale(${bird.scale})`,
                                height: 'auto',
                                width: '20px',
                                animation: `bird-${bird.direction} ${bird.speed}s linear forwards`, 
                                [bird.direction === 'right' ? 'left' : 'right']: bird.direction === 'right' ? '-10%' : '-60%'
                            }}
                            alt={`bird flying ${bird.direction}`}
                        />
                    ))}
                </div>
            )}

            {isDay && (
                <div className="absolute inset-0 overflow-hidden z-0">
                    {clouds.map((cloud) => (
                        <img
                            key={cloud.id}
                            src={cloud.src}
                            className="cloud"
                            style={{
                                top:cloud.top,
                                animationDelay: cloud.delay,
                                animationDuration: `${35 + Math.random() * 10}s`,
                                transform: `scale(${0.8 + Math.random() * 0.4})`,
                                left: cloud.left
                            }}
                        />
                    ))}
                </div>
            )}

            {isEvening && (
                <div className="absolute inset-0 overflow-hidden z-0">
                    {flickerDots.map((dot) => (
                        <span 
                            key={dot.id}
                            className="flicker-dot"
                            style={{
                                top: dot.top,
                                left: dot.left,
                                width: `${dot.size}px`,
                                height: `${dot.size}px`,
                                animationDelay: dot.delay
                            }}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

export default WeatherBg