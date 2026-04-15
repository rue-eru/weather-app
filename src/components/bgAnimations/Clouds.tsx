import { useEffect, useRef, useState } from "react";

interface Cloud {
    id: string;
    top: string;
    delay: string;
    src: string;
    left: string;
    duration: string;
    scale: number;
}

export default function Clouds () {

    const [clouds, setClouds] = useState<Cloud[]>([]);
    const cloudsRef = useRef<Cloud[]>([]);
    const animationRefs = useRef<{
        clouds?: ReturnType<typeof setTimeout>;
    }>({});

    useEffect(() => {
        setClouds([]);
        cloudsRef.current = []; 

        const speed = 1.6 + Math.random() * 10; //vw per sec
        const durationSec = 160 / speed;
        
        const initialClouds = Array.from({ length: 3}).map((_, i) => ({
                id: `cloud-${crypto.randomUUID()}`,
                top: `${Math.random() * 50 + 10}%`,
                delay: `${i * 0.5}s`,
                src: `./images/bg-assets/cloud-${Math.floor(Math.random() * 3) + 1}.png`,
                left: `${Math.random() * 100}%`,
                duration: `${durationSec}s`,
                scale: 0.8 + Math.random() * 0.4
        }))

        setClouds(initialClouds);
        cloudsRef.current = initialClouds;

        const spawnCloud = () => {
            const newCloud = {
                id: `cloud-${crypto.randomUUID()}`,
                top: `${Math.random() * 50 + 10}%`,
                delay: "0s",
                src: `./images/bg-assets/cloud-${Math.floor(Math.random() * 3) + 1}.png`,
                left: "-20vw",
                duration: `${durationSec}s`,
                scale: 0.8 + Math.random() * 0.4            };

            setClouds(prev => [...prev, newCloud]);
            cloudsRef.current = [...cloudsRef.current, newCloud]


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
    }, []);

    return(
        <>
            <div className="absolute inset-0 overflow-hidden z-0">
                {clouds.map((cloud) => (
                    <img
                        key={cloud.id}
                        src={cloud.src}
                        className="cloud"
                        style={{
                            top:cloud.top,
                            animationDelay: cloud.delay,
                            animationDuration: cloud.duration,
                            transform: `scale(${cloud.scale})`,
                            left: cloud.left
                        }}
                        onAnimationEnd={() => {
                            setClouds(prev => prev.filter(c => c.id !== cloud.id))
                            cloudsRef.current = cloudsRef.current.filter(c => c.id !== cloud.id)
                        }}
                        loading="lazy"
                        sizes="20px"
                    />
                ))}
            </div>
        </>
    )
}