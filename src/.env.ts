declare const _env_: {
	NODE_ENV: string,

	APP_IS_PRODUCTION: boolean,
	APP_ROOT_PATH: string,
	APP_VERSION: string,

	APP_GRACEFUL_SHUTDOWN_TIMEOUT_MS: number, // integer
	APP_GRACEFUL_SHUTDOWN_HTTP_CONNECTION_TIMEOUT_MS: number, // integer

	APP_CRON_STRING: string,
	APP_VERIFICATION_THRESHOLD: number, // integer
	APP_DATABASE_NAME: string,

	APP_BACKUP_DIRECTORY: string,
	APP_BACKUP_EXTENSION: string,
	APP_BACKUP_MAX_COUNT: number, // integer

	APP_HTTP_IP: string,
	APP_HTTP_PORT: number, // integer

	APP_DATABASE_HOST: string,
	APP_DATABASE_USERNAME: string,
}

export default _env_
