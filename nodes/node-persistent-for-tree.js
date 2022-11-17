class NodePersistentTree {
	constructor(value, key) {
		this.value = value;
		this.key = key;
		this.left = null;
		this.right = null;
		this.isRed = true;
	}

	[Symbol.iterator]() {
		return new IteratorForDepthForward(this);
	}

	getIteratorForDepthSymmetrical() {
		return new IteratorForDepthSymmetrical(this);
	}

	getIteratorForDepthReverse() {
		return new IteratorForDepthReverse(this.root);
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
