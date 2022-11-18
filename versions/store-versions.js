class StoreVersions {
	constructor(typeStructure) {
		this.typeStructure = typeStructure;
		this.selectedVersion = 0;
		this.totalVersions = 0;
		this.snapshots = [];
	}

	getCorrectIndex(indexVersion) {
		if (indexVersion === undefined) {
			return this.snapshots.length - 1;
		}

		const isNumber = typeof indexVersion === "number";

		const isAnyList = this.typeStructure === "DecQueue" || this.typeStructure === "Queue" || this.typeStructure === "Stack" || this.typeStructure === "DoublyLinkedList" || this.typeStructure === "OneWayLinkedList" || this.typeStructure === "TwoWayLinkedList";

		const isAnyTree = this.typeStructure === "RedBlackTree";

		if (isNumber && (isAnyList || isAnyTree)) {
			return indexVersion;
		}

		if (isNumber) {
			return (indexVersion <= 4 ? 0 : Math.floor(indexVersion / 4));
		}

		if (isAnyList || isAnyTree) {
			return -1;
		}

		const currentVersion = this.totalVersions - 1;

		if (indexVersion === "+1") {
			if (this.selectedVersion + 1 > currentVersion) {
				return -1;
			}

			return ( this.selectedVersion + 1 <= 4 ? 0 : Math.floor((this.selectedVersion + 1) / 4) );
		}

		if (indexVersion === "-1") {
			if(this.selectedVersion - 1 < 0) {
				return -1;
			}

			return ( this.selectedVersion - 1 <= 4 ? 0 : Math.floor((this.selectedVersion - 1) / 4) );
		}

		return -1;
	}

	#atForHashTable(indexVersion) {
		const index = this.getCorrectIndex(indexVersion);

		const version = this.snapshots[index];

		if (!(version instanceof Object)) {
			throw new Error(`You have entered an invalid version index. The index must be in the range of the number of versions, or must have the value: "+1", "-1" - provided that you originally made a request for some version. At the moment the value under the index you passed is - ${JSON.stringify(version)}.`);
		}

		const cloneVersion = version.value.getClone();

		if (indexVersion === undefined) {
			this.selectedVersion = this.totalVersions - 1;

			return cloneVersion.applyListChanges().value;
		}

		if (typeof indexVersion === "number") {
			this.selectedVersion = indexVersion;

			return cloneVersion.applyListChanges(indexVersion).value;
		}

		this.selectedVersion = indexVersion === "+1" ? this.selectedVersion + 1 : this.selectedVersion - 1;

		return cloneVersion.applyListChanges(this.selectedVersion).value;
	}

	#recApplyListChangeForNode(node, numberVersion) {
		if (node === null) {
			return null;
		}

		let updatedNode = node.applyListChanges(numberVersion);

		updatedNode.next = this.#recApplyListChangeForNode(updatedNode.next, numberVersion);

		return updatedNode;
	}

	#searchByVersion(numberVersion) {
		let startIndex = 0;

		let endIndex = this.snapshots.length - 1;

		while(startIndex <= endIndex) {
			const middleIndex = Math.floor((startIndex + endIndex) / 2);

			if (this.snapshots[middleIndex].version === numberVersion) {
				return this.snapshots[middleIndex].value;
			}

			if (this.snapshots[middleIndex].version > numberVersion) {
				endIndex = middleIndex - 1;
			} else {
				startIndex = middleIndex + 1;
			}
		}

		return this.snapshots[Math.floor((startIndex + endIndex) / 2)].value;
	}

	#recursivelyCloneAllNodesForTree(tree) {
		if (tree === null) {
			return null;
		}

		tree.left = this.#recursivelyCloneAllNodesForTree(tree.left);

		tree.right = this.#recursivelyCloneAllNodesForTree(tree.right);

		const clone = tree.getClone();

		return clone;
	}

	#atForPointerMachineModel(indexVersion) {
		const index = this.getCorrectIndex(indexVersion);

		const version = this.snapshots[index];

		console.log(index, "INDEX");

		console.log(version, "Версия");

		if (!(version instanceof Object)) {
			throw new Error(`The operation at() is not supported for the selected index. Index must be a number and not out of range. Your index - ${indexVersion}. Maximum index for the current structure version - ${this.totalVersions - 1}. Minimum index - 0.`);
		}

		const node = indexVersion === undefined ? version.value : this.#searchByVersion(index);

		if (node === null) {
			return node;
		}

		if (this.typeStructure === "RedBlackTree") {
			this.selectedVersion = index;

			const cloneNode = node.getClone();

			const recursivelyClone = this.#recursivelyCloneAllNodesForTree(cloneNode);

			return recursivelyClone;
		}

		this.selectedVersion = indexVersion === undefined ? this.totalVersions - 1 : indexVersion;

		const nodeForVersion = this.#recApplyListChangeForNode(node, this.selectedVersion);

		return nodeForVersion;
	}

	at(indexVersion) {
		if (this.snapshots.length === 0) {
			throw new Error("The versions store is Empty. Operation at() is not supported.");
		}

		switch (this.typeStructure) {
			case "HashTable":
				return this.#atForHashTable(indexVersion);
			case "OneWayLinkedList":
			case "TwoWayLinkedList":
			case "DoublyLinkedList":
			case "Stack":
			case "Queue":
			case "DecQueue":
			case "RedBlackTree":
				return this.#atForPointerMachineModel(indexVersion);
			default:
				throw new Error(`Operation at() is not supported for the selected structure type. Your chosen type ${this.typeStructure}.`);
		}
	}

	registerVersion(value, numberVersion) {
		this.snapshots.push({ value, version: numberVersion });

		return this.snapshots.length;
	}
}
