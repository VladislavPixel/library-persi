class IteratorNodePersistentForReverseValues {
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
      if (this.#auxiliaryTree) {
        this.#arrayNodes.push(this.#auxiliaryTree);

        this.#auxiliaryTree = this.#auxiliaryTree.left;
      } else {
        const auxiliaryLastElement = this.#arrayNodes[this.#arrayNodes.length - 1];

        if (
          auxiliaryLastElement?.right &&
          auxiliaryLastElement.right !== this.#lastWorkTreeNode
        ) {
          this.#auxiliaryTree = auxiliaryLastElement.right;
        } else {
          const treeNode = this.#arrayNodes.pop();

          if (treeNode) {
            this.#lastWorkTreeNode = treeNode;

            return { value: this.#lastWorkTreeNode.value, done: false };
          }
        }
      }
    }

    return { value: undefined, done: true };
	}
}