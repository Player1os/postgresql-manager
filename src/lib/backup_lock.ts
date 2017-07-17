// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

export const aquire = (backupDirectoryPath: string) => {
	// Use a lockfile to determine whether a backup operation is already running.
	try {
		fs.openSync(path.join(backupDirectoryPath, '.lock'), 'wx')
	} catch (err) {
		return false
	}
	return true
}

export const release = (backupDirectoryPath: string) => {
	// Remove the lockfile.
	fs.unlinkSync(path.join(backupDirectoryPath, '.lock'))
}
