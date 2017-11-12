// Load local modules.
import env from '.../src/.env'

// Load scoped modules.
import { date as dateDataType } from '@player1os/data-type-utility'
import * as fsLock from '@player1os/fs-lock'

// Load npm modules.
import spawnProcess from 'spawn-process-promise'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Export the database backup execution function.
export default async (databaseName: string, backupDirectoryPath: string, backupFileExtension: string, backupMaxCount: number) => {
	// Determine the backup file's name.
	const backupFilePath = path.join(backupDirectoryPath, dateDataType.toUtcDateTimeString(new Date(), {
		dateDelimiter: '-',
		timeDelimiter: '-',
		portionDelimiter: '_',
	}) + backupFileExtension)

	// Aquire the backup lock.
	const isAquired = await fsLock.aquire(backupDirectoryPath)
	if (!isAquired) {
		throw new Error('The lock could not be aquired')
	}

	try {
		// Spawn the pg dump process.
		const result = await spawnProcess('pg_dump', [
			'-Fc', databaseName,
			'-h', env.APP_DATABASE_HOST,
			'-U', env.APP_DATABASE_USERNAME,
		], { stdout: fs.createWriteStream(backupFilePath) })

		// Verify the process result.
		if (result.code !== 0) {
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
	} catch (err) {
		throw err
	} finally {
		// Release the backup lock.
		await fsLock.release(backupDirectoryPath)
	}

	// Return the name of the created backup.
	return backupFilePath
}
