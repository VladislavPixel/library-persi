class IteratorForValueLastVersion {
	constructor(list) {
		this.list = list;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.list === null) {
			return { value: undefined, done: true };
		}

		const currentNode = this.list;

		
	}
}
