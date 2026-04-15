import { useEffect, useState } from "react";

interface FlickerDot {
    id: string;
    top: string;
    left: string;
    delay: string;
    size: number;
}

export default function FlickerDots () {

    const [flickerDots, setFlickerDots] = useState<FlickerDot[]>([]);

    useEffect(() => {
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
    }, []);

    return(
        <>
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
        </>
    )
}