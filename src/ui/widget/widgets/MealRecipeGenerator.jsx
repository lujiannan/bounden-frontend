import React, { useState, useEffect, useRef } from 'react';

import FullModal from '../../modal/FullModal';
import AlertModal from '../../modal/AlertModal';
import "./MealRecipeGenerator.css";

const getRandomPosition = () => {
    const x = Math.random() * 80; // Assuming 80vw max for x position
    const y = 10 + Math.random() * 80; // Assuming 90vh max for y position
    return { x, y };
};

const getRandomFontSize = () => {
    return Math.floor(Math.random() * 35) + 15; // Font size between 15px and 50px
};

function MealRecipeGenerator() {
    const [dishList, setDishList] = useState(localStorage.getItem("preferredDishMenu") ?
        localStorage.getItem("preferredDishMenu").split(/[^a-zA-Z0-9\u4e00-\u9fff ]+/).filter(Boolean) :
        ["红烧肉", "水煮白菜", "蛋炒饭", "番茄炒蛋", "泡面"]
    );
    const [dishListInputString, setDishListInputString] = useState(localStorage.getItem("preferredDishMenu") ?
        localStorage.getItem("preferredDishMenu") :
        dishList.join("/")
    );

    const [runnedTimes, setRunnedTimes] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [floatingTexts, setFloatingTexts] = useState([]);

    const [shouldRunningAlertOn, setShouldRunningAlertOn] = useState(false);
    const [isCustomizeModalActive, setIsCustomizeModalActive] = useState(false);
    const [isCustomizeModalInputSubmitting, setIsCustomizeModalInputSubmitting] = useState(false);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % dishList.length);
                const { x, y } = getRandomPosition();
                const fontSize = getRandomFontSize();
                setFloatingTexts((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        text: dishList[currentIndex],
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

    const handleCustomizeModalSubmit = (e) => {
        setIsCustomizeModalActive(false);
        e.preventDefault();

        localStorage.setItem("preferredDishMenu", dishListInputString);
        // Regular expression to match non-alphanumeric characters (excluding space)
        setDishList(dishListInputString.split(/[^a-zA-Z0-9\u4e00-\u9fff ()（）]+/).filter(Boolean));
    }

    const alertRunning = (shouldAlert) => {
        setShouldRunningAlertOn(shouldAlert);
        if (shouldAlert) {
            setTimeout(() => {
                setShouldRunningAlertOn(false);
            }, 3000);
        }
    }

    return (
        <>
            <AlertModal isOpen={shouldRunningAlertOn} onClose={() => alertRunning(false)}>
                <p>Please stop before customizing the menu</p>
            </AlertModal>
            <FullModal isOpen={isCustomizeModalActive} onClose={() => { setIsCustomizeModalActive(false); }}>
                <h2>Customize Menu</h2>
                <div className='customize-dish-menu-modal-container'>
                    <form onSubmit={handleCustomizeModalSubmit}>
                        <textarea placeholder="What's your flavor?" value={dishListInputString} onChange={(e) => { setDishListInputString(e.target.value); }} />
                        <button type="submit">
                            {isCustomizeModalInputSubmitting ?
                                <div className="customize-input-submitting-container">
                                    <div className="loading-pulse"></div>
                                </div> : "Save"}
                        </button>
                    </form>
                </div>
            </FullModal>
            <div className="meal-recipe-generator-container">
                <div className='info-container'>
                    {runnedTimes > 0 && (
                        <div className="current-text-container">
                            {dishList[currentIndex]}
                        </div>
                    )}
                    <button className='start-stop-button' onClick={handleClick}>
                        {isRunning ? 'STOP' : 'START'}
                    </button>
                    <p className='customize-menu-button' onClick={() => {
                        isRunning ?
                            alertRunning(true) :
                            setIsCustomizeModalActive(true)
                    }}>
                        Customize
                    </p>
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
        </>
    );
}

export default MealRecipeGenerator;