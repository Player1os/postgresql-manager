// Load app modules.
const backupLock = require('./backup_lock')
const spwanProcess = require('./spawn_process')

// Load npm modules.
const Promise = require('bluebird')

// Load node modules.
const fs = require('fs')
const path = require('path')

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

// Export the database backup execution function.
module.exports = (databaseName, backupDirectoryPath, backupFileExtension, backupMaxCount) => {
	// Encapsulate the following statements in a promise.
	return Promise.resolve()
		.then(() => {
			// Aquire the backup lock.
			if (!backupLock.aquire(backupDirectoryPath)) {
				throw new Error('The lock could not be aquired')
			}

			// Determine the backup file's name.
			const backupFilePath = path.join(backupDirectoryPath, timestamp() + backupFileExtension)

			// Spawn the pg dump process.
			return spwanProcess('pg_dump', ['-Fc', databaseName], {
				stdout: fs.createWriteStream(backupFilePath),
			})
		})
		.then(() => {
			// Create a regexp for catching all backup files.
			const backupFileRegExp = new RegExp(`^.*\\${backupFileExtension}$`)

			// Retrieve the names of the existing backup files.
			const backupFilenames = fs.readdirSync(backupDirectoryPath)
				.filter((filename) => {
					return backupFileRegExp.test(filename)
				})

			// Check if the maximum count of backup files has been exceeded.
			if (backupFilenames.length > backupMaxCount) {
				// Determine the oldest backup file.
				const oldestBackupFilename = backupFilenames.reduce((currentOldestBackupFilename, filename) => {
					return currentOldestBackupFilename < filename
						? currentOldestBackupFilename
						: filename
				}, backupFilenames[0])

				// Remove the oldest backup file.
				fs.unlinkSync(path.join(backupDirectoryPath, oldestBackupFilename))
			}

			// Release the backup lock.
			backupLock.release(backupDirectoryPath)
		})
}
