// Load and set a custom global Promise library.
const Promise  = require('bluebird')
global.Promise = Promise

// Load app modules.
const runDatabaseBackup = require('./lib/run_database_backup')

// Load scoped modules.
const config = require('@player1os/config')

// Load node modules.
const path = require('path')

// Execute the database backup operation.
runDatabaseBackup(
	config.APP_DATABASE_NAME,
	path.normalize(config.APP_BACKUP_DIRECTORY),
	config.APP_BACKUP_EXTENSION,
	config.APP_BACKUP_MAX_COUNT)
	// Report success.
	.then(() => {
		console.log('The backup file "', backupFilename, '" has been successfully created')
	})
	// Exit on error.
	.catch((err) => {
		throw err
	})
