export default class TimeoutUtils {
	static withTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Function execution exceeded timeout'));
			}, timeout);

			fn()
				.then(result => {
					clearTimeout(timer);
					resolve(result);
				})
				.catch(error => {
					clearTimeout(timer);
					reject(error);
				});
		});
	}
}
