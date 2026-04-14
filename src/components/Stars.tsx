import { useState } from "react";

export default function Stars () {

    const [stars] = useState(() =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: `star-${i}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        zIndex: Math.random() < 0.5 ? 0 : 1
      }))
    );

    return(
        <>
            {stars.map((star) => (
              <div 
                key={star.id}
                className="star"
                style={{
                  top: star.top,
                  left: star.left,
                  animationDelay: star.delay,
                  zIndex: star.zIndex
                }}
              />
            ))}
        </>
    )
}