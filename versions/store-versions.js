class StoreVersions {
	constructor(typeStructure) {
		this.typeStructure = typeStructure;
		this.selectedVersion = 0;
		this.totalVersions = 0;
		this.snapshots = [];
	}

	getCorrectIndex(indexVersion) {
		if (indexVersion === undefined) {
			this.selectedVersion = this.totalVersions - 1;

			return this.snapshots.length - 1;
		}

		const isNumber = typeof indexVersion === "number";

		const currentVersion = this.totalVersions - 1;

		if (isNumber) {
			if (indexVersion < 0 || indexVersion > currentVersion) {
				throw new Error(`The operation at() is not supported for the selected index. Index must be a number and not out of range. Your index - ${indexVersion}. Maximum index for the current structure version - ${currentVersion}. Minimum index - 0.`);
			}

			this.selectedVersion = indexVersion;

			if (this.typeStructure === "oneWayLinkedList") {
				return indexVersion;
			}

			return (indexVersion <= 4 ? 0 : Math.floor(indexVersion / 4));
		}

		if (this.typeStructure === "oneWayLinkedList") {
			throw new Error("For list-type structures, the index must be numeric and in a range, or don't pass it at all to get the latest version of the structure.");
		}

		if (indexVersion === "+1") {
			if (this.selectedVersion + 1 > currentVersion) {
				throw new Error("Operation +1 changes selected version and takes it out of range.");
			}

			const correctIndex = this.selectedVersion + 1 <= 4 ? 0 : Math.floor((this.selectedVersion + 1) / 4);

			const node = this.snapshots[correctIndex];

			if (!(node instanceof Object)) {
				throw new Error(`You entered an invalid version index. The specified offset sets the index to ${this.selectedVersion + 1}. There is no such index in the version store.`);
			}

			this.selectedVersion += 1;

			return correctIndex;
		}

		if (indexVersion === "-1") {
			if (this.selectedVersion - 1 < 0) {
				throw new Error("Operation -1 changes selected version and takes it out of range.");
			}

			const correctIndex = this.selectedVersion - 1 <= 4 ? 0 : Math.floor((this.selectedVersion - 1) / 4);

			const node = this.snapshots[correctIndex];

			if (!(node instanceof Object)) {
				throw new Error(`You entered an invalid version index. The specified offset sets the index to ${this.selectedVersion - 1}. There is no such index in the version store.`);
			}

			this.selectedVersion -= 1;

			return correctIndex;
		}

		throw new Error(`You have entered an incorrect change index. The index must be in the range of the number of changes or must be "+1", "-1".`);
	}

	#atForHashTable(indexVersion) {
		const index = this.getCorrectIndex(indexVersion);

		const clone = this.snapshots[index].value.getClone();

		if (indexVersion === undefined) {
			return clone.applyListChanges().value;
		}

		if (typeof indexVersion === "number") {
			return clone.applyListChanges(indexVersion).value;
		}

		return clone.applyListChanges(this.selectedVersion).value;
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

	#atForOneWayLinkedList(indexVersion) {
		const index = this.getCorrectIndex(indexVersion);

		if (indexVersion === undefined) {
			let nodeLastVersion = this.snapshots[index].value;

			nodeLastVersion = this.#recApplyListChangeForNode(nodeLastVersion, this.selectedVersion);

			return nodeLastVersion;
		}

		let nodeForVersion = this.#searchByVersion(index);

		nodeForVersion = this.#recApplyListChangeForNode(nodeForVersion, index);

		return nodeForVersion;
	}

	at(indexVersion) {
		if (this.snapshots.length === 0) {
			throw new Error("The versions store is Empty. Operation at() is not supported.");
		}

		switch (this.typeStructure) {
			case "hashTable":
				return this.#atForHashTable(indexVersion);
			case "oneWayLinkedList":
				return this.#atForOneWayLinkedList(indexVersion);
			default:
				throw new Error(`Operation at() is not supported for the selected structure type. Your chosen type ${this.typeStructure}.`);
		}
	}

	registerVersion(value, numberVersion) {
		this.snapshots.push({ value, version: numberVersion });

		return this.snapshots.length;
	}
}
