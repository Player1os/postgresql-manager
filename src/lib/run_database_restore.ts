// Load app modules.
import * as backupLock from '.../src/lib/backup_lock'

// Load npm modules.
import spwanProcess from 'spawn-process-promise'

// Load node modules.
import * as path from 'path'

// Export the database restore execution function.
export default async (databaseName: string, backupDirectoryPath: string, backupFilename: string) => {
	// Determin the backup file path.
	const backupFilePath = path.join(backupDirectoryPath, backupFilename)

	// Aquire the backup lock.
	if (!backupLock.aquire(backupDirectoryPath)) {
		throw new Error('The lock could not be aquired')
	}

	// Spawn the pg restore process.
	await spwanProcess('pg_restore', ['-c', '-d', databaseName, backupFilePath])

	// Release the backup lock.
	backupLock.release(backupDirectoryPath)

	// Return the name of the restored backup.
	return backupFilePath
}
