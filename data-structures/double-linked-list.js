class DoubleLinkedList extends OneWayLinkedList {
	constructor(defaultData) {
		super();
		this.tail = null;
		this.versions = new StoreVersions("doubleLinkedList");
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
		const { newLength, lastNode } = super.addFirst(value);

		if (newLength === 1) {
			this.tail = this.head;
		}

		if (lastNode !== this.tail) {
			this.tail = lastNode;
		}

		return { newLength, lastNode };
	}

	deleteFirst() {
		const { newLength, lastNode, result } = super.deleteFirst();

		if (newLength === 0) {
			this.tail = null;
		}

		return { newLength, lastNode, result };
	}

	set(configForValueNode, middleware) {
		const { node, newTotalVersion } = super.set(configForValueNode, middleware);

		if (node.next === null && node !== this.tail) {
			this.tail = node;
		}

		return { node, newTotalVersion };
	}
}
