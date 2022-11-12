class DoubleLinkedList extends OneWayLinkedList {
	constructor(defaultData) {
		super();
		this.tail = null;
		this.versions = new StoreVersions("doubleLinkedList");
		this.initialization(defaultData);
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
		const result = super.addFirst(value);

		if (this.length === 1) {
			this.tail = this.head;
		}

		if (result.lastNode !== this.tail) {
			this.tail = result.lastNode;
		}

		return this.length;
	}

	set(configForValueNode, middleware) {
		const { node, newTotalVersion } = super.set(configForValueNode, middleware);

		if (node.next === null && node !== this.tail) {
			this.tail = node;
		}

		return { node, newTotalVersion };
	}
}
