// Load scoped modules.
import config from '@player1os/config'

// Load npm modules.
import * as webpack from 'webpack'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Load the package file.
const packageJson = JSON.parse(fs.readFileSync(path.join(config.APP_ROOT_PATH, 'package.json'), 'utf-8'))

// Expose the configuration object.
export default {
	entry: [
		// Include the project starting point into the bundle.
		path.join(config.APP_ROOT_PATH, 'src', 'index.ts'),
	],
	output: {
		// Define the directory for the compilation output.
		path: path.join(config.APP_ROOT_PATH, 'build'),
		// Define the name for the compilation output.
		filename: 'index.js',
	},
	// Specify the target to be the node runtime.
	target: 'node',
	// Specify that all standard dependencies should be considered exterals to be dynamically included.
	externals: Object.keys(packageJson.dependencies || {})
		.reduce((externals, dependencyName) => {
			externals[dependencyName] = `commonjs ${dependencyName}`
			return externals
		}, {}),
	// Specify the global declarations of the node runtime.
	node: {
		__filename: true,
		__dirname: true,
	},
	module: {
		loaders: [
			// Specify a loader for all typescript source files that first compiles typescript into es2017 standards javascript
			// using the typescript compiler and then compiles that to javascript supported by the current node runtime
			// using the babel compiler.
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader',
			},
		],
	},
	plugins: [
		// Include a module to enable support for source maps within the node executable.
		new webpack.BannerPlugin({
			banner: "require('source-map-support').install();",
			raw: true,
			entryOnly: false,
		}),
		// Use the bluebird implementation of Promise as a replacement for the standard implementation.
		new webpack.ProvidePlugin({
			Promise: 'bluebird',
		}),
	],
	resolve: {
		// Specify that the '#' character in imports should be resolved to the project's root path.
		alias: {
			'...': config.APP_ROOT_PATH,
		},
		// Specify that the typescript and javascript extensions can be ommitted from module names.
		extensions: [
			'.ts',
			'.js',
		],
	},
	// Specify that a sourcemap should be created for the outputted bundle.
	devtool: 'source-map',
}
