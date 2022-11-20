class SetStructure extends RedBlackTree{
	constructor(iterable) {
		super();
		this.#initialization(iterable);
	}

	[Symbol.iterator]() {
		return new IteratorInInsertionOrder(this);
	}

	entries() {
		return new IteratorEntries(this);
	}

	#getIteratorForDepthForward() {
		return new IteratorForDepthForward(this.root);
	}

	#initialization(iterable) {
		if (iterable === undefined) {
			return null;
		}

		if (iterable[Symbol.iterator] === undefined) {
			throw new Error("The transmitted data cannot be used for the initialization tree by default. It is required to pass an iterable structure. Your default data should contain [Symbol.iterator] method.");
		}

		this.historyChanges.deleteFirstItemHistory();

		const mapArgumentsForHistory = new Map().set(1, iterable);

		const itemHistory = {
			type: "initializing the data structure",
			nameMethod: "initialization",
			iterable: mapArgumentsForHistory,
			accessModifier: "private",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		for (const valueInitData of iterable) {
			this.add(valueInitData);
		}

		this.versions.removeVersions();

		this.versions.registerVersion(this.root, this.totalVersions);

		this.versions.totalVersions++;
	}

	get size() {
		return this.length;
	}

	has(value) {
		if (this.length === 0) {
			return false;
		}

		const iterator = this.#getIteratorForDepthForward();

		for (const val of iterator) {
			if (sameValueZero(val, value)) {
				return true;
			}
		}

		return false;
	}

	add(value) {
		if (!this.has(value)) {
			this.insert(value, this.length, { nameMethodForHistory: "add" });
		}

		return this.length;
	}

	clear() {
		const itemHistory = {
			type: "cleaning the structure",
			nameMethod: "clear",
			iterable: new Map(),
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		this.root = null;

		this.length = 0;
	}
}