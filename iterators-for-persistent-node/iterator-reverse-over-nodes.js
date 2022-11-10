class IteratorReverseOverNodes {
	constructor(node) {
		this.node = node;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.node === null) {
			return { value: undefined, done: true };
		}

		const nodeLatestVersion = this.node.applyListChanges();

		const currentNode = this.node;

		this.node = nodeLatestVersion.prev;

		const correctNode = nodeLatestVersion.prev === null ? currentNode : nodeLatestVersion;

		return { value: correctNode, done: false };
	}
}
