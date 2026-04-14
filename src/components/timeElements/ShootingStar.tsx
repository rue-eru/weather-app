import { useEffect, useRef, useState } from "react";

interface ShootingStarProps {
    isNight: boolean
}

export default function ShootingStar ({isNight}: ShootingStarProps) {

    const [shootingStarPosition, setShootingStarPosition] = useState<{
        left: string,
        delay: string
    } | null>(null);

    const animationRefs = useRef<{
        shootingStar?: ReturnType<typeof setTimeout>;
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

                timeoutId = setTimeout(shoot, 15000) //10s
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

    return(
        <>
            {shootingStarPosition && (
                <div
                    className="shooting-star"
                    style={{
                       top: "-10%",
                       left: shootingStarPosition.left,
                       animationDelay: shootingStarPosition.delay,
                    }}
                />
            )}
        </>
    )
}