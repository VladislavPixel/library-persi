class OneWayLinkedList{
	constructor(defaultData) {
		this.head = null;
		this.length = 0;
		this.totalVersions = 0;
		this.versions = new StoreVersions("oneWayLinkedList", this.#getTotalVersion.bind(this));
		this.historyChanges = new HistoryChanges();
		this.#initialization(defaultData);
	}

	[Symbol.iterator]() {
		return new IteratorForValueLastVersion(this.head);
	}

	#getTotalVersion() {
		return this.totalVersions;
	}

	#initialization(initData) {
		const isArray = initData instanceof Array;

		const isObject = initData instanceof Object;

		const isEmptyInitData = initData === undefined || (isArray && initData.length === 0) || (isObject && Object.keys(initData).length === 0);

		if (isEmptyInitData) {
			this.historyChanges.registerChange("Initialization oneWayLinkedList data structure. Creating an instance without default data.");

			return;
		}

		if (!isArray && !isObject) {
			throw new Error("The passed defaultData cannot be used for initialization oneWayLinkedList. Required to pass an object instance or an array instance.");
		}

		const arrayKeys = Object.keys(initData);

		this.historyChanges.registerChange(`Data initialization for structure oneWayLinkedList. Transferring data that is passed by default to the structure using the addFirst() method. Source initData - ${JSON.stringify(initData)}.`);

		for (const key of arrayKeys) {
			this.addFirst(initData[key]);
		}
	}

	addFirst(value) {
		this.historyChanges.registerChange(`Method Call addFirst(). Adding a new element with the value ${JSON.stringify(value)} to the beginning of a one-way node.`);

		const newNode = new NodePersistent(value);

		if (this.length !== 0) {
			if (this.versions.length !== 0) {
				this.head = this.head.cloneCascading(this.head, this.totalVersions, { prev: newNode });

				newNode.changeLog = {};
				newNode.counterChanges = 0;
			} else {
				this.head.prev = newNode;
			}

			newNode.next = this.head;
		}

		this.head = newNode;

		this.length++;

		this.versions.registerVersion(this.head, this.totalVersions);

		this.totalVersions++;

		return this.length;
	}

	findByKey(key) {
		if (this.length === 0) {
			throw new Error("Method - findByKey is not supported in Empty oneWayLinkedList.");
		}
	}

	set(configForValueNode, preprocessingConfig) {
		if (preprocessingConfig === undefined) {
			this.historyChanges.registerChange(`Set value for oneWayLinkedList. Updating the value along the way - ${configForValueNode.path ? configForValueNode.path : "from the root"}. New value - ${JSON.stringify(configForValueNode.value)}. set() method was called without preprocessing config.`);

			const node = this.head.set(configForValueNode, this.totalVersions);

			if (node !== this.head) {
				node.counterChanges = 0;

				node.changeLog = {};

				this.head = node;

				this.versions.registerVersion(this.head, this.totalVersions);
			}
		} else {
			let node;

			for (const { nameMethod, arrArgsForMethod } of preprocessingConfig) {
				if (!(nameMethod in this)) {
					throw new Error(`${nameMethod} is not supported in oneWayLinkedList.`);
				}

				node = this.structure[nameMethod](...arrArgsForMethod);

				console.log(node, "РАБОТА ВЫБОРКИ");
			}
		}

		this.totalVersions++;

		return this.totalVersions;
	}
}
