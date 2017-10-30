// Load app modules.
import locateLatestBackup from '.../src/lib/locate_latest_backup'
import runDatabaseRestore from '.../src/lib/run_database_restore'

// Load scoped module.
import config from '@player1os/config'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Normalize the backup directory path.
const normalizedBackupDirectoryPath = path.normalize(config.APP_BACKUP_DIRECTORY)

// Attempt to load the backup file path from the command input.
let backupFilename = process.argv[2]

// Check if it was really loaded.
if ((backupFilename === undefined) || (backupFilename === '')) {
	// Determine the newest backup file.
	backupFilename = locateLatestBackup(normalizedBackupDirectoryPath, config.APP_BACKUP_EXTENSION)
} else {
	if (!fs.existsSync(path.join(normalizedBackupDirectoryPath, backupFilename))) {
		throw new Error('There is no backup file with the specified name')
	}
}

// Execute the database restore operation.
runDatabaseRestore(config.APP_DATABASE_NAME, normalizedBackupDirectoryPath, backupFilename)
	// Report success.
	.then((newBackupFilename) => {
		// tslint:disable-next-line:no-console
		console.log(`The backup file '${newBackupFilename}' has been successfully restored`)
	})
	// Exit on error.
	.catch((err) => {
		throw err
	})
