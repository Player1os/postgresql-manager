// Load node modules.
const fs = require('fs')
const path = require('path')

exports.aquire = (backupDirectoryPath) => {
	// Use a lockfile to determine whether a backup operation is already running.
	try {
		fs.openSync(path.join(backupDirectoryPath, '.lock'), 'wx')
	} catch (err) {
		return false
	}
	return true
}

exports.release = (backupDirectoryPath) => {
	// Remove the lockfile.
	fs.unlinkSync(path.join(backupDirectoryPath, '.lock'))
}