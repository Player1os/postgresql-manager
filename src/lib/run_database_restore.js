// Load app modules.
const backupLock = require('./backup_lock')
const spwanProcess = require('./spawn_process')

// Load npm modules.
const Promise = require('bluebird')

// Load node modules.
const path = require('path')

// Export the database restore execution function.
module.exports = (databaseName, backupDirectoryPath, backupFilename) => {
	// Encapsulate the following statements in a promise.
	return Promise.resolve()
		.then(() => {
			// Aquire the backup lock.
			if (!backupLock.aquire(backupDirectoryPath)) {
				throw new Error('The lock could not be aquired')
			}

			// Determin the backup file path.
			const backupFilePath = path.join(backupDirectoryPath, backupFilename)
	
			// Spawn the pg restore process.
			return spwanProcess('pg_restore', ['-c', '-d', databaseName, backupFilePath])
		})
		.then(() => {
			// Release the backup lock.
			backupLock.release(backupDirectoryPath)
		})
}
