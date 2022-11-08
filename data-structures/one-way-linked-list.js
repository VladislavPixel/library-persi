class OneWayLinkedList{
	constructor(defaultData) {
		this.head = null;
		this.length = 0;
		this.totalVersions = 0;
		this.versions = new StoreVersions("oneWayLinkedList", this.#getTotalVersion.bind(this));
		this.historyChanges = new HistoryChanges(this.#getTotalVersion.bind(this));
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

		const arrayKeys = Object.keys(defaultData);

		this.historyChanges.registerChange(`Data initialization for structure oneWayLinkedList. Transferring data that is passed by default to the structure using the addFirst() method. Source initData - ${JSON.stringify(initData)}`);

		for (const key of arrayKeys) {
			this.addFirst(initData[key]);
		}

		this.versions.registerVersion(this.head, this.totalVersions);

		this.totalVersions++;
	}

	addFirst(value) {
		this.historyChanges.registerChange(`Method Call addFirst(). Adding a new element with the value ${value} to the beginning of a one-way node.`);

		const newNode = new NodePersistent(value);

		if (this.length !== 0) {
			if (this.versions.length !== 0) {
				this.head = this.head.cloneCascading(this.totalVersions, { prev: newNode });

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
}
