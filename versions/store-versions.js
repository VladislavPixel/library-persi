class StoreVersions {
	constructor(typeStructure) {
		this.typeStructure = typeStructure;
		this.selectedVersion = 0;
		this.totalVersions = 0;
		this.snapshots = [];
	}

	getClone(node) {
		const clone = Object.assign(new NodePersistent(0), node);

		clone.value = JSON.parse(JSON.stringify(clone.value));

		return clone;
	}

	#atForHashTable(indexVersion) {
		if (indexVersion === undefined) {
			this.selectedVersion = this.totalVersions - 1;

			const clone = this.getClone(this.snapshots[this.snapshots.length - 1].value);

			return clone.applyListChanges().value;
		}

		if (typeof indexVersion === "number") {
			const currentVersion = this.totalVersions - 1;

			const valueAbsolute = Math.abs(indexVersion);

			if (indexVersion < 0 || currentVersion < valueAbsolute) {
				throw new Error("The specified version does not exist.");
			}

			this.selectedVersion = valueAbsolute;

			const correctIndex = valueAbsolute <= 4 ? 0 : Math.floor(valueAbsolute / 4);

			const clone = this.getClone(this.snapshots[correctIndex].value);

			return clone.applyListChanges(valueAbsolute).value;
		}

		if (indexVersion === "+1") {
			if (this.selectedVersion + 1 > this.totalVersions - 1) {
				throw new Error("Operation +1 changes selected version and takes it out of range.");
			}

			const correctIndex = this.selectedVersion + 1 <= 4 ? 0 : Math.floor((this.selectedVersion + 1) / 4);

			const node = this.snapshots[correctIndex];

			if (node instanceof Object) {
				this.selectedVersion += 1;

				const clone = this.getClone(node.value);

				return clone.applyListChanges(this.selectedVersion).value; 
			}

			throw new Error(`You entered an invalid version index. The specified offset sets the index to ${this.selectedVersion + 1}. There is no such index in the version store.`);
		}

		if (indexVersion === "-1") {
			if (this.selectedVersion - 1 < 0) {
				throw new Error("Operation -1 changes selected version and takes it out of range.");
			}

			const correctIndex = this.selectedVersion - 1 <= 4 ? 0 : Math.floor((this.selectedVersion - 1) / 4);

			const node = this.snapshots[correctIndex];

			if (node instanceof Object) {
				this.selectedVersion -= 1;

				const clone = this.getClone(node.value);

				return clone.applyListChanges(this.selectedVersion).value; 
			}

			throw new Error(`You entered an invalid version index. The specified offset sets the index to ${this.selectedVersion - 1}. There is no such index in the version store.`);
		}

		throw new Error(`You have entered an incorrect change index. The index must be in the range of the number of changes or must be "+1", "-1".`);
	}

	#recApplyListChangeForNode(node, numberVersion) {
		if (node === null) {
			return;
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
		const correctTotalVersion = this.totalVersions - 1;

		if (indexVersion === undefined) {
			let nodeLastVersion = this.snapshots[this.snapshots.length - 1].value;

			nodeLastVersion = this.#recApplyListChangeForNode(nodeLastVersion, correctTotalVersion);

			return nodeLastVersion;
		}

		const isNumber = typeof indexVersion === "number";

		if (!isNumber || indexVersion < 0 || indexVersion > correctTotalVersion) {
			throw new Error(`The operation at() is not supported for the selected index. Index must be a number and not out of range. Your index - ${indexVersion}. Maximum index for the current structure version - ${correctTotalVersion}.`);
		}

		let nodeForVersion = this.#searchByVersion(indexVersion);

		nodeForVersion = this.#recApplyListChangeForNode(nodeForVersion, indexVersion);

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
