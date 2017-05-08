// Load and set a custom global Promise library.
const Promise  = require('bluebird')
global.Promise = Promise

// Load app modules.
const runDatabaseRestore = require('./lib/run_database_restore')

// Load scoped module.
const config = require('@player1os/config')

// Load node modules.
const fs = require('fs')
const path = require('path')

// Normalize the backup directory path.
const normalizedBackupDirectoryPath = path.normalize(config.APP_BACKUP_DIRECTORY)

// Attempt to load the backup file path from the command input.
let backupFilename = process.argv[2];

// Create a regexp for catching all backup files.
const backupFileRegExp = new RegExp(`^.*\\${config.APP_BACKUP_EXTENSION}$`)

// Retrieve the names of the existing backup files.
const backupFilenames = fs.readdirSync(normalizedBackupDirectoryPath)
	.filter((filename) => {
		return backupFileRegExp.test(filename)
	})

if (backupFilenames.length === 0) {
	throw new Error('There are no backup files to restore from')
}

// Check if it was really loaded.
if (backupFilename) {
	if (backupFilenames.indexOf(backupFilename) === -1) {
		throw new Error('There is no backup file with the specified name')
	}
} else {
	// Determine the newest backup file.
	backupFilename = backupFilenames.reduce((currentNewestBackupFilename, filename) => {
		return currentNewestBackupFilename > filename
			? currentNewestBackupFilename
			: filename
	}, backupFilenames[0])
}

// Execute the database restore operation.
runDatabaseRestore(
	config.APP_DATABASE_NAME,
	normalizedBackupDirectoryPath,
	backupFilename)
	// Report success.
	.then((backupFilename) => {
		console.log('The backup file "', backupFilename, '" has been successfully restored')
	})
	// Exit on error.
	.catch((err) => {
		throw err
	})
