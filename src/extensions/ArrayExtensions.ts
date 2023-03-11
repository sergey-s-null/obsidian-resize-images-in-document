declare global {
	interface Array<T> {
		distinct(): T[];
	}
}

Array.prototype.distinct = function <T>() {
	return (this as Array<T>)
		.filter((value, index, array) => array.indexOf(value) == index);
};

export {};
