// Load app modules.
import locateLatestBackup from '.../src/lib/locate_latest_backup'

// Load scoped modules.
import config from '@player1os/config'
import { date as dateDataType } from '@player1os/data-type-utility'

// Load npm modules.
import * as express from 'express'
import * as httpStatus from 'http-status'

// Load node modules.
import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'

// Normalize the backup directory path.
const normalizedBackupDirectoryPath = path.normalize(config.APP_BACKUP_DIRECTORY)

// Initialize the express app.
const app = express()

app.use((_req, res) => {
	// Find the latest backup file.
	const latestBackupFilename = locateLatestBackup(normalizedBackupDirectoryPath, config.APP_BACKUP_EXTENSION)

	// Determine the last moment in time which should've occured sooner than the latest backup file.
	const date = new Date()
	date.setHours(date.getHours() - config.APP_VERIFICATION_THRESHOLD)

	// Verify that it is within the accepted threshold.
	if (latestBackupFilename < dateDataType.toUtcDateTimeString(date, {
		dateDelimiter: '-',
		timeDelimiter: '-',
	})) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`The last backup occured at ${latestBackupFilename}`)
		return
	}

	// Verify that no error had occured.
	if (fs.existsSync('error.log')) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send('An error had occured')
		return
	}

	// Send a positive response.
	res.status(httpStatus.OK).send()
})

export default () => {
	const server = http.createServer(app)

	server.listen(config.APP_HTTP_PORT, config.APP_HTTP_IP, (err) => {
		if (err) {
			throw err
		}
	})
}
