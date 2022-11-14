class TwoWayLinkedList extends OneWayLinkedList {
	constructor(defaultData) {
		super();
		this.tail = null;
		this.versions = new StoreVersions("twoWayLinkedList");
		this.initialization(defaultData);
	}

	initialization(initData) {
		const mapArgumentsForHistory = new Map().set(1, initData);

		if (initData === undefined) {
			this.historyChanges.registerChange("Initialization on your list data structure. Creating an instance without default data.", "initialization", mapArgumentsForHistory);

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

			this.historyChanges.registerChange(`Data initialization for structure list. Transferring data that is passed by default to the structure using the addFirst() method. Source initData - ${JSON.stringify(initData)}.`, "initialization", mapArgumentsForHistory);
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

		this.historyChanges.registerChange(`Method Call addLast(). Adding a new element with the value ${JSON.stringify(value)} to the end of the sheet.`, "addLast", mapArgumentsForHistory);

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

		this.historyChanges.registerChange(`Calling the deleteLast() method. Remove the last element from the list.`, "deleteLast", mapArgumentsForHistory);

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
