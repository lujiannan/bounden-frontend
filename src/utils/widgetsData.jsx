import MealRecipeGenerator from "../ui/widget/widgets/MealRecipeGenerator";
import MemoryMap from "../ui/widget/widgets/MemoryMap";

export const WidgetsData = [
    {
        title: "Meal & Recipe Generator",
        description: "Generate meals and recipes based on your preferences and dietary restrictions",
        url: "/meal-recipe-generator",
        routeElement: <MealRecipeGenerator />,
        icon: "ri-booklet-fill"
    },
    {
        title: "Memory Map",
        description: "A memory map to help you keep track of your memories",
        url: "/memory-map",
        routeElement: <MemoryMap />,
        icon: "ri-earth-fill"
    },
    {
        title: "Widget 2",
        description: "Description of Widget 2",
        url: "/widget2",
        icon: "ri-booklet-fill",
    },
    {
        title: "Widget 3",
        description: "Description of Widget 3",
        url: "/widget3",
        icon: "ri-booklet-fill"
    }
]