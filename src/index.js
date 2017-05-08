// Load and set a custom global Promise library.
const Promise  = require('bluebird')
global.Promise = Promise

// Load app modules.
const runDatabaseBackup = require('./lib/run_database_backup')

// Load scoped modules.
const config = require('@player1os/config')

// Load npm modules.
const cron = require('cron')

// Load node modules.
const path = require('path')

// Create and start a test job.
const job = new cron.CronJob({
	cronTime: config.APP_CRON_STRING,
	onTick() {
		// Execute the database backup operation.
		runDatabaseBackup(
			config.APP_DATABASE_NAME,
			path.normalize(config.APP_BACKUP_DIRECTORY),
			config.APP_BACKUP_EXTENSION,
			config.APP_BACKUP_MAX_COUNT)
			// Report error.
			.catch((err) => {
				console.error(err)
			})
	},
	start: true,
})
