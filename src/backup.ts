// Load app modules.
import runDatabaseBackup from '.../src/lib/run_database_backup'

// Load scoped modules.
import config from '@player1os/config'

// Load node modules.
import * as path from 'path'

// Execute the database backup operation.
runDatabaseBackup(config.APP_DATABASE_NAME, path.normalize(config.APP_BACKUP_DIRECTORY),
	config.APP_BACKUP_EXTENSION, config.APP_BACKUP_MAX_COUNT)
	// Report success.
	.then((backupFilename) => {
		// tslint:disable-next-line:no-console
		console.log(`The backup file '${backupFilename}' has been successfully created`)
	})
	// Exit on error.
	.catch((err) => {
		throw err
	})
