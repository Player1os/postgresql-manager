// Load npm modules.
const cron = require('cron')

// Create and start a test job.
const job = new cron.CronJob({
	cronTime: '* * * * * *',
	onTick() {
		console.log('hello', new Date())
	},
	start: true,
})
