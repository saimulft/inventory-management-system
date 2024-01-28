const connectDatabase = require("../config/connectDatabase");
const { addDays, startOfDay, endOfDay, formatISO, addMonths } = require('date-fns');

const renewMonthlyRequestLimit = async () => {
    try {
        const db = await connectDatabase()
        const all_stores_collection = db.collection("all_stores")

        // Get the current date and tomorrow's date
        const currentDate = new Date();
        const renewDate = addMonths(currentDate, 1);
        const tomorrowDate = addDays(currentDate, 1);
        const startOfTomorrow = startOfDay(tomorrowDate);
        const endOfTomorrow = endOfDay(tomorrowDate);

        const result = await all_stores_collection.updateMany(
            {
                renew_date: {
                    $gte: startOfTomorrow.toISOString(),
                    $lt: endOfTomorrow.toISOString()
                }
            },
            { $set: { renew_date: renewDate.toISOString()} }
        );

        console.log('Documents updated: ', result.modifiedCount);
    } catch (error) {
        console.log(error)
    }
};

module.exports = renewMonthlyRequestLimit;