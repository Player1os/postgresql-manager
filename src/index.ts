// Load app modules.
import runDatabaseBackup from '.../src/lib/run_database_backup'
// Load app modules.
import verify from '.../src/verify'

// Load scoped modules.
import config from '@player1os/config'

// Load npm modules.
import * as cron from 'cron'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Create and start a test job.
// tslint:disable-next-line:no-unused-expression
new cron.CronJob({
	cronTime: config.APP_CRON_STRING,
	onTick() {
		// Execute the database backup operation.
		runDatabaseBackup(config.APP_DATABASE_NAME, path.normalize(config.APP_BACKUP_DIRECTORY),
			config.APP_BACKUP_EXTENSION, config.APP_BACKUP_MAX_COUNT)
			// Report error.
			.catch((err) => {
				fs.appendFileSync('error.log', (err.stack ? err.stack : err.toString()) + '\n', 'utf-8')
			})
	},
	start: true,
})

// Initialize the verification server.
verify()
