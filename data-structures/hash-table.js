class HashTable {
	constructor(defaultData) {
		this.totalVersions = 0;
		this.versions = new StoreVersions("hashTable", this.#getTotalVersion.bind(this));
		this.historyChanges = new HistoryChanges();
		this.structure = this.initialization(defaultData);
	}

	[Symbol.iterator]() {
		return new IteratorKeysAndValues(this.structure);
	}

	#getTotalVersion() {
		return this.totalVersions;
	}

	initialization(initData) {
		const isArray = initData instanceof Array;

		const isObject = initData instanceof Object;

		const isEmptyInitData = initData === undefined || (isArray && initData.length === 0) || (isObject && Object.keys(initData).length === 0);

		if (isEmptyInitData) {
			this.historyChanges.registerChange("Initialization on your hashTable data structure. Creating an instance without default data.");

			const nodeHashTable = new NodePersistent({});

			this.versions.registerVersion(nodeHashTable, this.totalVersions);

			this.totalVersions++;

			return nodeHashTable;
		}

		if (!isArray && !isObject) {
			throw new Error("The passed defaultData cannot be used for initialization. Required to pass an object instance or an array instance.");
		}

		const arrayKeys = Object.keys(initData);

		this.historyChanges.registerChange(`Data initialization for structure. Transferring keys and values ​​to a hash table. DefaultData - ${JSON.stringify(initData)}.`);

		const source = {};

		for (const key of arrayKeys) {
			source[key] = initData[key];
		}

		const nodeHashTable = new NodePersistent(source);

		this.versions.registerVersion(nodeHashTable, this.totalVersions);

		this.totalVersions++;

		return nodeHashTable;
	}

	set(configChange) {
		const isObject = typeof configChange === "object";

		if (!isObject || (isObject && (!("path" in configChange) || configChange.path === undefined))) {
			this.historyChanges.registerChange(`The path to the update segment is treated as empty, so the hash table will be completely overwritten. NewValue - ${isObject ? configChange.value : configChange}.`);
		} else {
			this.historyChanges.registerChange(`Set value for hashTable. Updating the value along the way - ${configChange.path}. NewValue - ${configChange.value}.`);
		}

		const clone = this.versions.arrVersions[this.versions.arrVersions.length - 1].value.getClone();

		const cloneLatestVersion = clone.applyListChanges();

		if (isObject && configChange.path !== undefined) {

			cloneLatestVersion.getValueByPath(configChange.path);
		}

		if (this.structure.counterChanges === this.structure.MAX_CHANGES) {
			this.structure = cloneLatestVersion;

			this.versions.registerVersion(this.structure, this.totalVersions);
		}

		const correctChange = isObject && configChange.path === undefined ?
			({ ...configChange, path: "value" }) :
			isObject && configChange.path !== undefined ?
			configChange : 
			({ value: configChange });

		this.structure.addChange(this.totalVersions, correctChange);

		this.totalVersions++;

		return this.totalVersions;
	}

	get() {

	}
}
