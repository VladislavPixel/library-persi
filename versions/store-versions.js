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

		const isAnyList = this.typeStructure === "DecQueue" || this.typeStructure === "Queue" || this.typeStructure === "Stack" || this.typeStructure === "DoublyLinkedList" || this.typeStructure === "OneWayLinkedList" || this.typeStructure === "TwoWayLinkedList";

		const isAnyTree = this.typeStructure === "RedBlackTree";

		if (isNumber) {
			if (indexVersion < 0 || indexVersion > currentVersion) {
				throw new Error(`The operation at() is not supported for the selected index. Index must be a number and not out of range. Your index - ${indexVersion}. Maximum index for the current structure version - ${currentVersion}. Minimum index - 0.`);
			}

			this.selectedVersion = indexVersion;

			if (isAnyList || isAnyTree) {
				return indexVersion;
			}

			return (indexVersion <= 4 ? 0 : Math.floor(indexVersion / 4));
		}

		if (isAnyList || isAnyTree) {
			throw new Error("For list-type and tree structures, the index must be numeric and in a range, or don't pass it at all to get the latest version of the structure.");
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

	#atForList(indexVersion) {
		const index = this.getCorrectIndex(indexVersion);

		if (indexVersion === undefined) {
			let nodeLastVersion = this.snapshots[index].value;

			if (nodeLastVersion === null) {
				return nodeLastVersion;
			}

			nodeLastVersion = this.#recApplyListChangeForNode(nodeLastVersion, this.selectedVersion);

			return nodeLastVersion;
		}

		let nodeForVersion = this.#searchByVersion(index);

		if (nodeForVersion === null) {
			return nodeForVersion;
		}

		nodeForVersion = this.#recApplyListChangeForNode(nodeForVersion, index);

		return nodeForVersion;
	}

	recursivelyCloneAllNodesForTree(tree) {
		if (tree === null) {
			return null;
		}

		tree.left = this.recursivelyCloneAllNodesForTree(tree.left);

		tree.right = this.recursivelyCloneAllNodesForTree(tree.right);

		const clone = tree.getClone();

		return clone;
	}

	#atForTree(indexVersion) {
		const index = this.getCorrectIndex(indexVersion);

		if (indexVersion === undefined) {
			const root = this.snapshots[index].value.getClone();

			const cloneRoot = this.recursivelyCloneAllNodesForTree(root);

			return cloneRoot;
		}

		const nodeForVersion = this.#searchByVersion(index);

		if (nodeForVersion === null) {
			return nodeForVersion;
		}

		const root = nodeForVersion.getClone();

		const cloneRoot = this.recursivelyCloneAllNodesForTree(root);

		return cloneRoot;
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
				return this.#atForList(indexVersion);
			case "RedBlackTree":
				return this.#atForTree(indexVersion);
			default:
				throw new Error(`Operation at() is not supported for the selected structure type. Your chosen type ${this.typeStructure}.`);
		}
	}

	registerVersion(value, numberVersion) {
		this.snapshots.push({ value, version: numberVersion });

		return this.snapshots.length;
	}
}
