// Load node modules.
import * as fs from 'fs'

export default (backupDirectoryPath: string, backupFileExtension: string) => {
	// Create a regexp for catching all backup files.
	const backupFileRegExp = new RegExp(`^.*\\${backupFileExtension}$`)

	// Retrieve the names of the existing backup files.
	const backupFilenames = fs.readdirSync(backupDirectoryPath)
		.filter((filename) => {
			return backupFileRegExp.test(filename)
		})

	// Check if it was really loaded.
	if (backupFilenames.length === 0) {
		throw new Error('There are no backup files to restore from')
	}

	// Determine the newest backup file.
	return backupFilenames.reduce((currentNewestBackupFilename, filename) => {
		return (currentNewestBackupFilename > filename)
			? currentNewestBackupFilename
			: filename
	}, backupFilenames[0])
}
