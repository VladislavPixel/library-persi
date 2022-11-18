class OneWayLinkedList {
	constructor(defaultData) {
		this.head = null;
		this.length = 0;
		this.versions = new StoreVersions(this.constructor.name);
		this.historyChanges = new HistoryChanges();
		this.initialization(defaultData);
	}

	[Symbol.iterator]() {
		return new IteratorForValueLastVersion(this.head);
	}

	getIteratorNewAndOldNodes() {
		return new IteratorForNewAndOldNodes(this.head);
	}

	get totalVersions() {
		return this.versions.totalVersions;
	}

	initialization(initData) {
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
		const mapArgumentsForHistory = new Map().set(1, value);

		const itemHistory = {
			type: "adding to the beginning",
			nameMethod: "addFirst",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const newNode = new NodePersistent(value);

		let lastN = null;

		if (this.length !== 0) {
			if (this.versions.length !== 0) {
				const { updatedNode, lastNode } = this.head.cloneCascading(this.head, this.totalVersions, { prev: newNode });

				lastN = lastNode;

				this.head = updatedNode;

				newNode.resetChangeLog();
			} else {
				this.head.prev = newNode;
			}

			newNode.next = this.head;
		}

		this.head = newNode;

		this.length++;

		this.versions.registerVersion(this.head, this.totalVersions);

		this.versions.totalVersions++;

		return { newLength: this.length, lastNode: lastN, firstNode: this.head };
	}

	deleteFirst() {
		if (this.length === 0) {
			throw new Error("Deleting the first item from an empty list is not supported. First add the elements.");
		}

		const mapArgumentsForHistory = new Map();

		const itemHistory = {
			type: "deleting at the beginning",
			nameMethod: "deleteFirst",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const deletedNode = this.head.applyListChanges();

		let lastN = null;

		if (deletedNode.next !== null) {
			const { updatedNode, lastNode } = this.head.cloneCascading(deletedNode.next, this.totalVersions, { prev: null });

			lastN = lastNode;

			this.head = updatedNode;
		} else {
			this.head = null;
		}

		this.length--;

		this.versions.registerVersion(this.head, this.totalVersions);

		this.versions.totalVersions++;

		return { newLength: this.length, lastNode: lastN, result: deletedNode, firstNode: this.head };
	}

	findByKey(key) {
		if (this.length === 0) {
			throw new Error("Method - findByKey is not supported in Empty list.");
		}

		const iterator = this.getIteratorNewAndOldNodes();

		for (const { latestVersionN, stockN } of iterator) {
			if (typeof key !== "object" && key === latestVersionN.value) {
				return stockN;
			}

			try {
				if (typeof key === "object") {
					const { value, lastSegment } = latestVersionN.getValueByPath(key.path);

					if (value[lastSegment] === key.value) {
						return stockN;
					}
				}
			} catch(err) {
				continue;
			}
		}

		return -1;
	}

	set(configForValueNode, middleware) {
		if (this.length === 0) {
			throw new Error("Method - set is not supported in Empty list.");
		}

		const mapArgumentsForHistory = new Map().set(1, configForValueNode).set(2, middleware);

		const itemHistory = {
			type: "setting the value",
			nameMethod: "set",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		if (middleware === undefined) {
			this.historyChanges.registerChange(itemHistory);

			const { updatedNode, firstNode, lastNode } = this.head.set(configForValueNode, this.totalVersions);

			if (updatedNode !== null && updatedNode !== this.head) {
				updatedNode.resetChangeLog();

				this.head = updatedNode;

				this.versions.registerVersion(this.head, this.totalVersions);
			}

			this.versions.totalVersions++;

			return { updatedNode, firstNode, lastNode, newTotalVersion: this.totalVersions };
		}

		const node = getResultComposeMiddleware.call(this, middleware);

		if (node === -1) {
			throw new Error("Node is not found in on your list for operation set().");
		}

		this.historyChanges.registerChange(itemHistory);

		const { updatedNode, firstNode, lastNode } = node.set(configForValueNode, this.totalVersions);

		if (firstNode !== null && firstNode !== this.head) {
			this.head = firstNode;

			this.versions.registerVersion(this.head, this.totalVersions);
		}

		this.versions.totalVersions++;

		return { updatedNode, firstNode, lastNode, newTotalVersion: this.totalVersions };
	}

	get(numberVersion, pathNodeValue, middleware) {
		if (this.length === 0) {
			throw new Error("Method - get is not supported in Empty list.");
		}

		const mapArgumentsForHistory = new Map().set(1, numberVersion).set(2, pathNodeValue).set(3, middleware);

		const isNumber = typeof numberVersion === "number";

		if (!isNumber || pathNodeValue === undefined || numberVersion < 0 || numberVersion > this.totalVersions - 1) {
			throw new Error(`Operation get() is not available for version - ${numberVersion}. The request must contain a valid path (2 argument). Version should be smaller ${this.totalVersions} and start off 0.`);
		}

		const itemHistory = {
			type: "getting the value",
			nameMethod: "get",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		if (middleware === undefined) {
			const node = this.versions.at(numberVersion);

			const { value, lastSegment } = node.getValueByPath(pathNodeValue);

			return value[lastSegment];
		}

		let nodeForVersion = this.versions.at(numberVersion);

		nodeForVersion = getResultComposeMiddleware.call(nodeForVersion, middleware);

		if (nodeForVersion === -1) {
			throw new Error("The node was not found.");
		}

		const { value, lastSegment } = nodeForVersion.getValueByPath(pathNodeValue);

		return value[lastSegment];
	}
}
