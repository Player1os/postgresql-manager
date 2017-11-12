#!/usr/bin/env node

// Load local modules.
import env from '.../src/.env'
import runDatabaseBackup from '.../src/lib/run_database_backup'

// Load scoped modules.
import executePromise from '@player1os/execute-promise'

// Load node modules.
import * as path from 'path'

executePromise(async () => {
	// Execute the database backup operation.
	const backupFilename = await runDatabaseBackup(
		env.APP_DATABASE_NAME,
		path.normalize(env.APP_BACKUP_DIRECTORY),
		env.APP_BACKUP_EXTENSION,
		env.APP_BACKUP_MAX_COUNT)

	// Report success.
	console.log(`The backup file '${backupFilename}' has been successfully created`) // tslint:disable-line:no-console
})
