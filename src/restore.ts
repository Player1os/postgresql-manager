#!/usr/bin/env node

// Load local modules.
import env from '.../src/.env'
import locateLatestBackup from '.../src/lib/locate_latest_backup'
import runDatabaseRestore from '.../src/lib/run_database_restore'

// Load scoped modules.
import executePromise from '@player1os/execute-promise'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Normalize the backup directory path.
const normalizedBackupDirectoryPath = path.normalize(env.APP_BACKUP_DIRECTORY)

// Attempt to load the backup file path from the command input.
let backupFilename = process.argv[2]

// Check if it was really loaded.
if ((backupFilename === undefined) || (backupFilename === '')) {
	// Determine the newest backup file.
	backupFilename = locateLatestBackup(normalizedBackupDirectoryPath, env.APP_BACKUP_EXTENSION)
} else {
	if (!fs.existsSync(path.join(normalizedBackupDirectoryPath, backupFilename))) {
		throw new Error('There is no backup file with the specified name')
	}
}

executePromise(async () => {
	// Execute the database restore operation.
	const newBackupFilename = await runDatabaseRestore(
		env.APP_DATABASE_NAME,
		normalizedBackupDirectoryPath,
		backupFilename)

	// Report success.
	console.log(`The backup file '${newBackupFilename}' has been successfully restored`) // tslint:disable-line:no-console
})
