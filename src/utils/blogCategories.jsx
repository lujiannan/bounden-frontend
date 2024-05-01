const BlogCategories = [
    {
        cateName: "Technology"
    },
    {
        cateName: "Fashion"
    },
    {
        cateName: "Lifestyle"
    },
    {
        cateName: "Entertainment"
    },
    {
        cateName: "Sports"
    },
    {
        cateName: "Politics"
    },
    {
        cateName: "Science"
    },
    {
        cateName: "Health"
    },
    {
        cateName: "Art"
    },
    {
        cateName: "Education"
    },
    {
        cateName: "Business"
    },
    {
        cateName: "Opinion"
    },
    {
        cateName: "Magazine"
    },
    {
        cateName: "Travel"
    },
    {
        cateName: "Food"
    },
]

export const SortedBlogCategories = BlogCategories.sort((a, b) => a.cateName.localeCompare(b.cateName));