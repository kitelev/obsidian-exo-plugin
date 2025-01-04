export default class Comparator {
	static combineCompare<T>(fn1: ComparingFn<T>, fn2: ComparingFn<T>): ComparingFn<T> {
		return (o1, o2) => {
			let res1 = fn1(o1, o2);
			if (res1 !== 0) {
				return res1;
			}
			return fn2(o1, o2);
		};
	}

	static reverse<T>(fn: ComparingFn<T>): ComparingFn<T> {
		return (o1, o2) => -fn(o1, o2);
	}

	static comparing<T>(propGetter: (t: T) => number): ComparingFn<T> {
		return (o1, o2) => {
			let p1 = propGetter(o1);
			let p2 = propGetter(o2);
			return p1 - p2;
		}
	}
}

export type ComparingFn<T> = (o1: T, o2: T) => number;
