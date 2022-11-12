class OneWayLinkedList{
	constructor(defaultData) {
		this.head = null;
		this.length = 0;
		this.versions = new StoreVersions("oneWayLinkedList");
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
		const isArray = initData instanceof Array;

		const isObject = initData instanceof Object;

		const isEmptyInitData = initData === undefined || (isArray && initData.length === 0) || (isObject && Object.keys(initData).length === 0);

		if (isEmptyInitData) {
			this.historyChanges.registerChange("Initialization on your list data structure. Creating an instance without default data.");

			return;
		}

		if (!isArray && !isObject) {
			throw new Error("The passed defaultData cannot be used for initialization list. Required to pass an object instance or an array instance.");
		}

		const arrayKeys = Object.keys(initData);

		this.historyChanges.registerChange(`Data initialization for structure list. Transferring data that is passed by default to the structure using the addFirst() method. Source initData - ${JSON.stringify(initData)}.`);

		for (const key of arrayKeys) {
			this.addFirst(initData[key]);
		}
	}

	addFirst(value) {
		this.historyChanges.registerChange(`Method Call addFirst(). Adding a new element with the value ${JSON.stringify(value)} to the beginning of a one-way node.`);

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

		return { newLength: this.length, lastNode: lastN };
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
		if (middleware === undefined) {
			this.historyChanges.registerChange(`Set value for list. Updating the value along the way - ${configForValueNode.path ? configForValueNode.path : "from the root"}. New value - ${JSON.stringify(configForValueNode.value)}. set() method was called without preprocessing config.`);

			const node = this.head.set(configForValueNode, this.totalVersions);

			if (node !== this.head) {
				node.resetChangeLog();

				this.head = node;

				this.versions.registerVersion(this.head, this.totalVersions);
			}

			this.versions.totalVersions++;

			return { node, newTotalVersion: this.totalVersions };
		}

		const node = getResultComposeMiddleware.call(this, middleware);

		if (node === -1) {
			throw new Error("Node is not found in on your list for operation set().");
		}

		this.historyChanges.registerChange(`Set value ${JSON.stringify(configForValueNode.value)} for Node.`);

		const result = node.set(configForValueNode, this.totalVersions);

		const firstNode = result.getFirstNode();

		if (firstNode !== this.head) {
			this.head = firstNode;

			this.versions.registerVersion(this.head, this.totalVersions);
		}

		this.versions.totalVersions++;

		return { node, newTotalVersion: this.totalVersions };
	}

	get(numberVersion, pathNodeValue, middleware) {
		const isNumber = typeof numberVersion === "number";

		if (!isNumber || pathNodeValue === undefined || numberVersion < 0 || numberVersion > this.totalVersions - 1) {
			throw new Error(`Operation get() is not available for version - ${numberVersion}. The request must contain a valid path (2 argument). Version should be smaller ${this.totalVersions} and start off 0.`);
		}

		this.historyChanges.registerChange(`Getting field value from List. Version query - ${numberVersion}. Way to the field - ${pathNodeValue}.${middleware !== undefined ? " Search methods have been applied." : " Search methods were not applied. The search is carried out in the first node."}`);

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
