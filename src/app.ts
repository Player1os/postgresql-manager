// Load local modules.
import env from '.../src/.env'
import locateLatestBackup from '.../src/lib/locate_latest_backup'

// Load scoped modules.
import { date as dateDataType } from '@player1os/data-type-utility'

// Load npm modules.
import * as express from 'express'
import * as httpStatus from 'http-status'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Normalize the backup directory path.
const normalizedBackupDirectoryPath = path.normalize(env.APP_BACKUP_DIRECTORY)

// Initialize the express app.
const app = express()

app.use((_req, res) => {
	// Find the latest backup file.
	const latestBackupFilename = locateLatestBackup(normalizedBackupDirectoryPath, env.APP_BACKUP_EXTENSION)

	// Determine the last moment in time which should've occured sooner than the latest backup file.
	const date = new Date()
	date.setHours(date.getHours() - env.APP_VERIFICATION_THRESHOLD)

	// Verify that it is within the accepted threshold.
	if (latestBackupFilename < dateDataType.toUtcDateTimeString(date, {
		dateDelimiter: '-',
		timeDelimiter: '-',
		portionDelimiter: '_',
	})) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`The last backup occured at ${latestBackupFilename}`)
		return
	}

	// Verify that no error had occured.
	if (fs.existsSync(path.join(env.APP_ROOT_PATH, 'output', 'error.log'))) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send('An error had occured')
		return
	}

	// Send a positive response.
	res.status(httpStatus.OK).send()
})

// Expose the express app.
export default app
