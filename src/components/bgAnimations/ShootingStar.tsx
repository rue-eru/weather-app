import { useEffect, useRef, useState } from "react";

export default function ShootingStar () {

    const [shootingStarPosition, setShootingStarPosition] = useState<{
        left: string,
        delay: string
    } | null>(null);

    const animationRefs = useRef<{
        shootingStar?: ReturnType<typeof setTimeout>;
    }>({});

    useEffect(() => {

        let timeoutId: ReturnType<typeof setTimeout>;

        const shoot = () => {
            setShootingStarPosition(null);

            timeoutId = setTimeout(() => {
                const leftStar = `${Math.random() * 60}%`;
                
                setShootingStarPosition({
                    left: leftStar,
                    delay: "0s",
                });

                timeoutId = setTimeout(shoot, 15000) //15s
                animationRefs.current.shootingStar = timeoutId;
            }, 500); //animation can reset due to short timeout
        };

        timeoutId = setTimeout(shoot, 3000);
        animationRefs.current.shootingStar = timeoutId;
        const currentShootingStar = animationRefs.current.shootingStar;
        return () => {
            if (currentShootingStar) {
                clearTimeout(currentShootingStar)
            }
        };
    }, []);

    return(
        <>
            {shootingStarPosition && (
                <div
                    className="shooting-star"
                    style={{
                       top: "-30%",
                       left: shootingStarPosition.left,
                       animationDelay: shootingStarPosition.delay,
                    }}
                />
            )}
        </>
    )
}