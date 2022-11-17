class IteratorForDepthReverse {
	#tree;

	#arrayNodes;

	#auxiliaryTree;

	#lastWorkTreeNode;

	constructor(tree) {
		this.#tree = tree;
		this.#arrayNodes = [];
    this.#auxiliaryTree = this.#tree;
		this.#lastWorkTreeNode = null;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.#arrayNodes.length === 0 && this.#auxiliaryTree === null) {
			return { value: undefined, done: true };
		}

		while (this.#auxiliaryTree ?? this.#arrayNodes.length) {
      
    }

    return { value: undefined, done: true };
	}
}