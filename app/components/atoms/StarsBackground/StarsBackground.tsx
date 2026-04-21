"use client";
import { useEffect, useState } from "react";
import { Star } from "./types";

import "./StarsBackground.css";

const generateStars = (count: number): Star[] =>
    Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.6 + 0.2,
    }));

export const StarsBackground = () => {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        setStars(generateStars(120));
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen h-full overflow-hidden">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white/80 twinkle"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDelay: `${star.delay}s`,
                        animationDuration: "3s",
                    }}
                />
            ))}
        </div>
    );
};
