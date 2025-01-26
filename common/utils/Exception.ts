export default class Exception extends Error {
	constructor(message: string, originalError?: Error) {
		super(message);
		this.name = 'Exception';
		if (originalError?.stack) {
			this.stack += `\nCaused by: ${originalError.stack}`;
		}
		Object.setPrototypeOf(this, Exception.prototype);
	}
}
