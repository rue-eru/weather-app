import { useEffect, useRef, useState } from "react";

type MorningBird = {
    id: string;
    top: string;
    scale: number;
    direction: 'left' | 'right';
    speed: number;
}


export default function MorningBirds () {

    const [morningBirds, setMorningBirds] = useState<MorningBird[]>([]);
    const morningBirdsRef = useRef<MorningBird[]>([]);
    const animationRefs = useRef<{
        birds?: ReturnType<typeof setTimeout>;
    }>({});

    useEffect(() => {
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
    }, []);

    return(
        <>
            <div className="absolute inset-0 overflow-hidden z-0">
                {morningBirds.map((bird) => (
                    <img 
                        key={bird.id}
                        src={`./images/bg-assets/bird-${bird.direction}.png`}
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
                        loading="lazy"
                        sizes="20px"
                    />
                ))}
            </div>
        </>
    )
}