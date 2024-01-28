const renewMonthlyRequestLimit = require('../utilities/renewMonthlyRequestLimit');
const CronJob = require('cron').CronJob;

const cronJob = CronJob.from({
	cronTime: '0 0 * * *',
	onTick: function () {
		renewMonthlyRequestLimit()
	},
	timeZone: 'America/Los_Angeles'
});

module.exports = cronJob;