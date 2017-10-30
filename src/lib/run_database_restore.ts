// Load scoped modules.
import config from '@player1os/config'
import * as fsLock from '@player1os/fs-lock'

// Load npm modules.
import spwanProcess from 'spawn-process-promise'

// Load node modules.
import * as path from 'path'

// Export the database restore execution function.
export default async (databaseName: string, backupDirectoryPath: string, backupFilename: string) => {
	// Determin the backup file path.
	const backupFilePath = path.join(backupDirectoryPath, backupFilename)

	// Aquire the backup lock.
	const isAquired = await fsLock.aquire(backupDirectoryPath)
	if (!isAquired) {
		throw new Error('The lock could not be aquired')
	}

	try {
		// Spawn the pg restore process.
		const result = await spwanProcess('pg_restore', [
			backupFilePath, '-c', '--if-exists', '-1',
			'-d', databaseName,
			'-h', config.APP_DATABASE_HOST,
			'-U', config.APP_DATABASE_USERNAME,
		])

		// Verify the process result.
		if (result.code !== 0) {
			throw new Error('Command failed: ' + JSON.stringify(result, null, 2))
		}
	} catch (err) {
		throw err
	} finally {
		// Release the backup lock.
		await fsLock.release(backupDirectoryPath)
	}

	// Return the name of the restored backup.
	return backupFilePath
}
