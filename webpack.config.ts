// Load scoped modules.
import config from '@player1os/config'
import { nodeApplicationConfig } from '@player1os/webpack-config'

// Load npm modules.
import { DefinePlugin } from 'webpack'

const webpackConfig = nodeApplicationConfig(config.APP_ROOT_PATH)
webpackConfig.plugins.push(
	// Define the constants to be statically compiled into the bundle.
	new DefinePlugin({
		_env_: JSON.stringify(config),
	}))

// Expose the configuration object.
export default webpackConfig
