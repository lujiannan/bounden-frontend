import React, { useState, useEffect, useRef } from 'react';
import "./MealRecipeGenerator.css"


const textList = ["Text 1", "Text 2", "Text 3", "Text 4", "Text 5"];

const getRandomPosition = () => {
    const x = Math.random() * 80; // Assuming 80vw max for x position
    const y = 10 + Math.random() * 80; // Assuming 90vh max for y position
    return { x, y };
};

const getRandomFontSize = () => {
    return Math.floor(Math.random() * 35) + 15; // Font size between 15px and 50px
};

function MealRecipeGenerator() {
    const [runnedTimes, setRunnedTimes] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [floatingTexts, setFloatingTexts] = useState([]);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % textList.length);
                const { x, y } = getRandomPosition();
                const fontSize = getRandomFontSize();
                setFloatingTexts((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        text: textList[currentIndex],
                        x,
                        y,
                        fontSize,
                    },
                ]);
            }, 75);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, currentIndex]);

    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            setFloatingTexts((prev) =>
                // Remove texts that are older than 1 second
                prev.filter((text) => Date.now() - text.id < 1000)
            );
        }, 10);
        return () => clearInterval(cleanupInterval);
    }, []);

    const handleClick = () => {
        if (!isRunning) {
            setRunnedTimes((prev) => prev + 1);
        }
        setIsRunning((prev) => !prev);
    };

    return (
        <div className="meal-recipe-generator-container">
            <div className='info-container'>
                {runnedTimes > 0 && (
                    <div className="current-text-container">
                        {textList[currentIndex]}
                    </div>
                )}
                <button className='start-stop-button' onClick={handleClick}>
                    {isRunning ? 'STOP' : 'START'}
                </button>
            </div>
            {floatingTexts.map((text) => (
                <div
                    key={text.id}
                    className="floating-text"
                    style={{
                        left: `${text.x}vw`,
                        top: `${text.y}vh`,
                        fontSize: `${text.fontSize}px`,
                    }}
                >
                    {text.text}
                </div>
            ))}
        </div>
    );
}

export default MealRecipeGenerator;