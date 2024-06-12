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

const getRandomListIndex = (list) => {
    return Math.floor(Math.random() * list.length);
}

const englishOrChinese = (str) => {
    // return true for English, false for Chinese
    let englishCount = 0;
    let chineseCount = 0;

    if (typeof str === 'string') {
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char.match(/[a-zA-Z]/)) {
                englishCount++;
            } else if (char.match(/[\u4E00-\u9FFF]/)) {
                chineseCount++;
            }
        }
    }

    if (englishCount > chineseCount) {
        return true;
    } else {
        return false;
    }
}

function MealRecipeGenerator() {
    const [dishList, setDishList] = useState(localStorage.getItem("preferredDishMenu") ?
        localStorage.getItem("preferredDishMenu").split(/[^a-zA-Z0-9\u4e00-\u9fff ()（）]+/).filter(Boolean) :
        [
            "馄饨",
            "烩面",
            "热干面",
            "刀削面",
            "油泼面",
            "炸酱面",
            "炒面",
            "重庆小面",
            "米线",
            "酸辣粉",
            "土豆粉",
            "螺狮粉",
            "凉皮儿",
            "麻辣烫",
            "肉夹馍",
            "羊肉泡馍",
            "炒饭",
            "盖浇饭",
            "烤肉饭",
            "黄焖鸡米饭",
            "麻辣香锅",
            "火锅",
            "酸菜鱼",
            "烤串",
            "披萨",
            "烤鸭",
            "汉堡",
            "炸鸡",
            "寿司",
            "煎饼果子",
            "南瓜粥",
            "小龙虾",
            "牛排",
            "砂锅",
            "大排档",
            "馒头",
            "西餐",
            "自助餐",
            "小笼包",
            "水果",
            "西北风",
            "烧烤",
            "泡面",
            "水饺",
            "日本料理",
            "涮羊肉",
            "兰州拉面",
            "肯德基",
            "面包",
            "臊子面",
            "小笼包",
            "麦当劳",
            "沙县小吃",
            "烤鱼",
            "海鲜",
            "铁板烧",
            "韩国料理",
            "甜点",
            "鸭血粉丝汤"
        ]
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
                const randomIndex = getRandomListIndex(dishList);
                // setCurrentIndex((prevIndex) => (prevIndex + 1) % dishList.length);
                setCurrentIndex(randomIndex);
                const { x, y } = getRandomPosition();
                const fontSize = getRandomFontSize();
                setFloatingTexts((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        text: dishList[randomIndex],
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
            {/* alert if user tries to customize menu while running */}
            <AlertModal isOpen={shouldRunningAlertOn} onClose={() => alertRunning(false)}>
                <p>Please stop before customizing the menu</p>
            </AlertModal>
            {/* shows if user wants to customize menu */}
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
                        // jump to outlet link if user has clicked the dish name
                        <a className="current-text-container" target="_blank"
                            href={englishOrChinese(dishList[currentIndex]) ?
                                "https://www.allrecipes.com/search?q=" + dishList[currentIndex].replace(/ /g, "+") :
                                "https://m.xiachufang.com/search/?keyword=" + dishList[currentIndex].replace(/ /g, "+")
                            } >
                            {dishList[currentIndex]}
                        </a>
                    )}
                    <button className='start-stop-button' onClick={handleClick}>
                        {isRunning ? 'STOP' : 'START'}
                    </button>
                    <p className='customize-menu-button' onClick={() => {
                        isRunning ?
                            alertRunning(true) :
                            setIsCustomizeModalActive(true)
                    }}>
                        {"customize ?"}
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