// transfer from "2024-04-29 02:44:20" format to "29 Apr 2024" format

function blogFormatDate(inputDateString) {
    // Parse the input string into a Date object
    const date = new Date(inputDateString);

    // Get the day, month, and year components
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    // Assemble the formatted date string
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}

export default blogFormatDate;