// TODO: Replace with a library.

// Load npm modules.
const Promise = require('bluebird')

// Export the promise generator.
module.exports = (cmd, args) => {
	// Create a promise
	return new Promise((resolve, reject) => {
		// Define variables for collecting standard stream.
		const data = {
			out: '',
			err: '',
		}

		// Spawn the command with the given arguments.
		const spawn = childProcess.spawn(cmd, args)
			// Reject on error.
			.on('error', (err) => {
				reject(err, data)
			})
			// Resolve on close.
			.on('close', (code, signal) => {
				resolve(code, signal, data)
			})
		
		// Collect the standard out stream data.
		spawn.stdout.on('data', (newData) => {
			data.out += newData
		})

		// Collect the standard err stream data.
		spawn.stderr.on('data', (newData) => {
			data.err += newData
		})
	})
}
