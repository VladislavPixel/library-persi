class HashTable {
	constructor(defaultData) {
		this.versions = new StoreVersions("hashTable");
		this.historyChanges = new HistoryChanges();
		this.structure = this.initialization(defaultData);
	}

	[Symbol.iterator]() {
		return new IteratorKeysAndValues(this.structure);
	}

	get totalVersions () {
		return this.versions.totalVersions;
	}

	initialization(initData) {
		const isArray = initData instanceof Array;

		const isObject = initData instanceof Object;

		const isEmptyInitData = initData === undefined || (isArray && initData.length === 0) || (isObject && Object.keys(initData).length === 0);

		const mapArgumentsForHistory = new Map().set(1, initData);

		if (isEmptyInitData) {
			this.historyChanges.registerChange("Initialization on your hashTable data structure. Creating an instance without default data.", "initialization", mapArgumentsForHistory);

			const nodeHashTable = new NodePersistent({});

			this.versions.registerVersion(nodeHashTable, this.totalVersions);

			this.versions.totalVersions++;

			return nodeHashTable;
		}

		if (!isArray && !isObject) {
			throw new Error("The passed defaultData cannot be used for initialization. Required to pass an object instance or an array instance.");
		}

		const arrayKeys = Object.keys(initData);

		this.historyChanges.registerChange(`Data initialization for structure. Transferring keys and values ​​to a hash table. DefaultData - ${JSON.stringify(initData)}.`, "initialization", mapArgumentsForHistory);

		const source = {};

		for (const key of arrayKeys) {
			source[key] = initData[key];
		}

		const nodeHashTable = new NodePersistent(source);

		this.versions.registerVersion(nodeHashTable, this.totalVersions);

		this.versions.totalVersions++

		return nodeHashTable;
	}

	set(configChange) {
		const isObject = typeof configChange === "object";

		const mapArgumentsForHistory = new Map().set(1, configChange);

		if (!isObject || (isObject && (!("path" in configChange) || configChange.path === undefined))) {
			this.historyChanges.registerChange(`The path to the update segment is treated as empty, so the hash table will be completely overwritten. NewValue - ${isObject ? configChange.value : configChange}.`, "set", mapArgumentsForHistory);
		} else {
			this.historyChanges.registerChange(`Set value for hashTable. Updating the value along the way - ${configChange.path}. NewValue - ${configChange.value}.`, "set", mapArgumentsForHistory);
		}

		const clone = this.versions.snapshots[this.versions.snapshots.length - 1].value.getClone();

		const cloneLatestVersion = clone.applyListChanges();

		if (isObject && configChange.path !== undefined) {

			cloneLatestVersion.getValueByPath(configChange.path);
		}

		if (this.structure.changeLog.size === this.structure.MAX_CHANGES) {
			this.structure = cloneLatestVersion;

			this.versions.registerVersion(this.structure, this.totalVersions);
		}

		const correctChange = isObject && configChange.path === undefined ?
			({ ...configChange, path: "value" }) :
			isObject && configChange.path !== undefined ?
			configChange : 
			({ value: configChange });

		this.structure.addChange(this.totalVersions, correctChange);

		this.versions.totalVersions++;

		return this.totalVersions;
	}

	get(numberVersion, path) {
		const isNumber = typeof numberVersion === "number";

		const mapArgumentsForHistory = new Map().set(1, numberVersion).set(2, path);

		if (!isNumber || path === undefined || numberVersion < 0 || numberVersion > this.totalVersions - 1) {
			throw new Error(`Operation get() is not available for version - ${numberVersion}. The request must contain a valid path (2 argument). Version should be smaller ${this.totalVersions} and start off 0.`);
		}

		this.historyChanges.registerChange(`Getting field value from hashTable. Version query - ${numberVersion}. Way to the field - ${path}.`, "get", mapArgumentsForHistory);

		const correctIndex = numberVersion <= 4 ? 0 : Math.floor(numberVersion / 4);

		const clone = this.versions.snapshots[correctIndex].value.getClone().applyListChanges(numberVersion);

		const { value, lastSegment } = clone.getValueByPath(path);

		return value[lastSegment];
	}
}
