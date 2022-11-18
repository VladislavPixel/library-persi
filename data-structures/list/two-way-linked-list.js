class TwoWayLinkedList extends OneWayLinkedList {
	constructor(defaultData) {
		super();
		this.tail = null;
		this.initialization(defaultData);
	}

	initialization(initData) {
		this.historyChanges.deleteFirstItemHistory();

		const mapArgumentsForHistory = new Map().set(1, initData);

		const itemHistory = {
			type: "initializing the data structure",
			nameMethod: "initialization",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		if (initData === undefined) {
			return null;
		}

		try {
			for (const value of initData) {
				if (initData instanceof Map) {
					this.addFirst(value[1]);
					continue;
				}

				this.addFirst(value);
			}
		} catch (err) {
			throw new Error("The transmitted data cannot be used for the initialization list by default. It is required to pass an iterable structure. Your default data should contain [Symbol.iterator] method.");
		}
	}

	addFirst(value) {
		const { newLength, lastNode, firstNode } = super.addFirst(value);

		if (newLength === 1) {
			this.tail = this.head;
		}

		if (lastNode !== null && lastNode !== this.tail) {
			this.tail = lastNode;
		}

		return { newLength, lastNode, firstNode };
	}

	deleteFirst() {
		const { newLength, lastNode, result, firstNode } = super.deleteFirst();

		if (newLength === 0) {
			this.tail = null;
		}

		return { newLength, lastNode, result, firstNode };
	}

	addLast(value) {
		const mapArgumentsForHistory = new Map().set(1, value);

		const itemHistory = {
			type: "adding to the end",
			nameMethod: "addLast",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const newNode = new NodePersistent(value);

		if (this.length !== 0) {
			if (this.versions.length !== 0) {
				const { firstNode } = this.tail.cloneCascading(this.tail, this.totalVersions, { next: newNode });

				if (firstNode !== null && this.head !== firstNode) {
					this.head = firstNode;

					this.versions.registerVersion(this.head, this.totalVersions);
				}

				newNode.resetChangeLog();
			} else {
				this.tail.next = newNode;
			}

			newNode.prev = this.tail;
		} else {
			this.head = newNode;
		}

		this.tail = newNode;

		this.length++;

		this.versions.totalVersions++;

		return { newLength: this.length, lastNode: this.tail, firstNode: this.head };
	}

	deleteLast() {
		if (this.length === 0) {
			throw new Error("Removing the last element. First, add the elements.");
		}

		const mapArgumentsForHistory = new Map();

		const itemHistory = {
			type: "deleting from the end",
			nameMethod: "deleteLast",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const deletedNode = this.tail.applyListChanges();

		let lastN = null;

		const currentHead = this.head;

		if (deletedNode.prev !== null) {
			const { lastNode, firstNode } = this.tail.cloneCascading(deletedNode.prev, this.totalVersions, { next: null });

			lastN = lastNode;

			this.tail = lastNode;

			if (firstNode !== null) {
				this.head = firstNode;
			}
		} else {
			this.tail = null;

			this.head = null;
		}

		this.length--;

		if (currentHead !== this.head) {
			this.versions.registerVersion(this.head, this.totalVersions);
		}

		this.versions.totalVersions++;

		return { newLength: this.length, result: deletedNode, firstNode: this.head, lastNode: lastN };
	}

	set(configForValueNode, middleware) {
		const { updatedNode, firstNode, lastNode, newTotalVersion } = super.set(configForValueNode, middleware);

		if (lastNode !== null && lastNode !== this.tail) {
			this.tail = lastNode;
		}

		return { updatedNode, firstNode, lastNode, newTotalVersion };
	}
}
