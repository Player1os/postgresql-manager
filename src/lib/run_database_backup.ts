// Load app modules.
import * as backupLock from '.../src/lib/backup_lock'

// Load scoped modules.
import config from '@player1os/config'
import { date as dateDataType } from '@player1os/data-type-utility'

// Load npm modules.
import spwanProcess from 'spawn-process-promise'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Export the database backup execution function.
export default async (databaseName: string, backupDirectoryPath: string, backupFileExtension: string, backupMaxCount: number) => {
	// Determine the backup file's name.
	const backupFilePath = path.join(backupDirectoryPath, dateDataType.toUtcDateTimeString(new Date(), {
		dateDelimiter: '-',
		timeDelimiter: '-',
	}) + backupFileExtension)

	// Aquire the backup lock.
	if (!backupLock.aquire(backupDirectoryPath)) {
		throw new Error('The lock could not be aquired')
	}

	// Spawn the pg dump process.
	const result = await spwanProcess('pg_dump', [
		'-Fc', databaseName,
		'-h', config.APP_DATABASE_HOST,
		'-U', config.APP_DATABASE_USERNAME,
	], { stdout: fs.createWriteStream(backupFilePath) })

	// Verify the process result.
	if (result.code) {
		throw new Error('Command failed: ' + JSON.stringify(result, null, 2))
	}

	// Create a regexp for catching all backup files.
	const backupFileRegExp = new RegExp(`^.*\\${backupFileExtension}$`)

	// Retrieve the names of the existing backup files.
	const backupFilenames = fs.readdirSync(backupDirectoryPath, 'utf8')
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

	// Return the name of the created backup.
	return backupFilePath
}
