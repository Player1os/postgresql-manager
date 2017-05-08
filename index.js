// Load and set a custom global Promise library.
const Promise  = require('bluebird')
global.Promise = Promise

// Load scoped modules.
const config = require('@player1os/config')

// Load npm modules.
const cron = require('cron')

// Load node modules.
const fs = require('fs')
const path = require('path')

// Define constants for future work.
const normalizedBackupDirectory = path.normalize(config.APP_BACKUP_DIRECTORY)
const backupLockFilePath = path.join(normalizedBackupDirectory, '.lock')
const backupFileRegExp = new RegExp('^.*\\' + config.APP_BACKUP_EXTENSION + '$')

// Define a numeric padding function.
// TODO: Replace with a call to datatypes library.
const pad = (value, size) => {
	let newValue = value.toString()

	while (newValue.length < size) {
		newValue = '0' + newValue
	}

	return newValue
}

// Define a timestamp generating function.
// TODO: Replace with a call to datatypes library.
const timestamp = () => {
	// Store the current date.
	const date = new Date()

	// Return the timestamp.
	return [
		[
			pad(date.getFullYear(), 4),
			pad(date.getMonth() + 1, 2),
			pad(date.getDate(), 2),
		].join('-'),
		[
			pad(date.getHours(), 2),
			pad(date.getMinutes(), 2),
			pad(date.getSeconds(), 2),
		].join('-'),
		pad(date.getMilliseconds(), 3),
	].join('_')
}

// Create and start a test job.
const job = new cron.CronJob({
	cronTime: config.APP_CRON_STRING,
	onTick() {
		console.log(backupLockFilePath)
		try {
			fs.openSync(backupLockFilePath, 'wx')
		} catch (err) {
			console.log('The file exists')
			this.stop()
			return
		}
		// TODO: Add a lockfile.

		// Generate the new filename.
		const newBackupFilename = timestamp() + config.APP_BACKUP_EXTENSION

		// TODO: Remake file creation.
		fs.writeFileSync(path.join(normalizedBackupDirectory, newBackupFilename), 'utf-8')

		// Retrieve the names of the existing backup files.
		const backupFilenames = fs.readdirSync(normalizedBackupDirectory)
			.filter((filename) => {
				return backupFileRegExp.test(filename)
			})

		// Check if the maximum count of backup files has been exceeded.
		if (backupFilenames.length > config.APP_BACKUP_MAX_COUNT) {
			// Determine the oldest backup file.
			const oldestBackupFilename = backupFilenames.reduce((currentOldestBackupFilename, filename) => {
				return currentOldestBackupFilename < filename
					? currentOldestBackupFilename
					: filename
			}, backupFilenames[0])

			// Remove the oldest backup file.
			fs.unlinkSync(path.join(normalizedBackupDirectory, oldestBackupFilename))
		}

		// Remove the lock file.
		fs.unlinkSync(backupLockFilePath)
	},
	start: true,
})
