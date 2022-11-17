class NodePersistentTree {
	constructor(value, key) {
		this.value = value;
		this.key = key;
		this.left = null;
		this.right = null;
		this.isRed = true;
	}

	[Symbol.iterator]() {
		return new IteratorNodePersistentForReverseValues(this);
	}

	getCloneValue(valueNode) {
		return clone(valueNode);
	}

	getClone() {
		const cloneNode = Object.assign(new NodePersistentTree(0, 0), this);

		cloneNode.value = clone(cloneNode.value);

		return cloneNode;
	}
}
