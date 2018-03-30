#!/usr/bin/env node

// Load local modules.
import env from '.../src/.env'
import app from '.../src/app'
import runDatabaseBackup from '.../src/lib/run_database_backup'

// Load scoped modules.
import executePromise from '@player1os/execute-promise'
import { HttpServer } from '@player1os/express-utility'
import gracefulShutdown from '@player1os/graceful-shutdown'

// Load npm modules.
import * as cron from 'cron'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Normalize the backup directory path.
const normalizedBackupDirectoryPath = path.normalize(env.APP_BACKUP_DIRECTORY)

// Create and start the cron job.
const cronJob = new cron.CronJob({
	cronTime: env.APP_CRON_STRING,
	onTick() {
		// Execute the database backup operation.
		runDatabaseBackup(
			env.APP_DATABASE_NAME,
			normalizedBackupDirectoryPath,
			env.APP_BACKUP_EXTENSION,
			env.APP_BACKUP_MAX_COUNT,
		)
			// Report error.
			.catch((err) => {
				fs.appendFileSync(
					path.join(env.APP_ROOT_PATH, 'output', 'error.log'),
					(err.stack ? err.stack : err.toString()) + '\n', 'utf-8')
			})
	},
	start: true,
})

// Instantiate the server.
const httpServer = new HttpServer(app, env.APP_GRACEFUL_SHUTDOWN_HTTP_CONNECTION_TIMEOUT_MS)

executePromise(async () => {
	// Initialize the http server.
	await httpServer.listen(env.APP_HTTP_PORT, env.APP_HTTP_IP)

	// Output success message.
	console.log( // tslint:disable-line:no-console
		'Http server initialized',
		`(IP Address: ${env.APP_HTTP_IP} | Port ${env.APP_HTTP_PORT.toString()})`,
	)
})

gracefulShutdown(async () => {
	// Stop the created cron job.
	cronJob.stop()

	// Terminate the http server.
	await httpServer.stop()
}, env.APP_GRACEFUL_SHUTDOWN_TIMEOUT_MS)
