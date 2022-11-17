class RedBlackTree {
	constructor() {
		this.root = null;
		this.length = 0;
		this.versions = new StoreVersions("redBlackTree");
		this.historyChanges = new HistoryChanges();
		this.#initialization();
	}

	[Symbol.iterator]() {
		return new IteratorForDepthForward(this.root);
	}

	getIteratorForDepthSymmetrical() {
		return new IteratorForDepthSymmetrical(this.root);
	}

	getIteratorForDepthReverse() {
		return new IteratorForDepthReverse(this.root);
	}

	getIteratorForWidthTraversal() {
		return new IteratorForWidthTraversal(this.root);
	}

	getIteratorForFindMethod(key) {
		return new IteratorForFindMethod(this.root, key);
	}

	get totalVersions() {
		return this.versions.totalVersions;
	}

	#initialization() {
		this.historyChanges.registerChange("Initialization on your redBlackTree data structure. Creating an instance without default data.", "initialization", new Map());

		this.versions.registerVersion(this.root, this.totalVersions);

		this.versions.totalVersions++;
	}

	#isBrokeRule(parent, node) {
		if (parent === null) {
			return false;
		}

		return parent.isRed === true && node.isRed === true;
	}

	#checkGrandson(grandson, parent, grandfather) {
		const isLeftParent = grandfather.left === parent ? true : false;

		const isLeftGrandson = parent.left === grandson ? true : false;

		return { isExternalGrandson: isLeftParent === isLeftGrandson, isLeft: isLeftGrandson };
	}

	#isTriggerColor(node) {
		return !node.isRed && node.left !== null && node.left.isRed && node.right !== null && node.right.isRed;
	}

	#updateColorsForNodeAndChildrens(node) {
		if (node !== this.root) {
			node.isRed = true;
		}

		node.left.isRed = false;

		node.right.isRed = false;
	}

	insert(value, key) {
		const mapArgumentsForHistory = new Map().set(1, value).set(2, key);

		this.historyChanges.registerChange("Calling the insertion method into the tree.", "insert", mapArgumentsForHistory);

		const newNode = new NodePersistentTree(value, key);

		if (this.length === 0) {
			newNode.isRed = false;

			this.root = newNode;

			this.versions.registerVersion(this.root, this.totalVersions);

			this.length++;

			this.versions.totalVersions++;

			return this.length;
		}

		const recLookPlaceAndInsert = (currentNode) => {
			if (currentNode === null) {
				return { children: newNode, brokeRuleStatus: null, grandson: null };
			}

			const isLeftNodeNext = key < currentNode.key ? true : false;

			const nextNode = isLeftNodeNext ? currentNode.left : currentNode.right;

			const { children, brokeRuleStatus, grandson } = recLookPlaceAndInsert(nextNode);

			const cloneCurrentNode = currentNode.getClone();

			if (isLeftNodeNext) {
				cloneCurrentNode.left = children;

			} else {
				cloneCurrentNode.right = children;
			}

			if (brokeRuleStatus === null) {
				if (this.#isBrokeRule(cloneCurrentNode, children)) {
					return { children: cloneCurrentNode, brokeRuleStatus: true, grandson: children };
				}

				return { children: cloneCurrentNode, brokeRuleStatus: false, grandson: children };
			}

			if (brokeRuleStatus === false) {
				return { children: cloneCurrentNode, brokeRuleStatus: null, grandson: children };
			}

			if (this.#isTriggerColor(cloneCurrentNode)) {
				this.#updateColorsForNodeAndChildrens(cloneCurrentNode);

				return { children: cloneCurrentNode, brokeRuleStatus: null, grandson: children };
			}

			const { isExternalGrandson, isLeft } = this.#checkGrandson(grandson, children, cloneCurrentNode);

			cloneCurrentNode.isRed = !cloneCurrentNode.isRed;

			if (isExternalGrandson) {
				children.isRed = !children.isRed;

				if (isLeft) {
					this.#ror(cloneCurrentNode, children);
				} else {
					this.#rol(cloneCurrentNode, children);
				}

				return { children, brokeRuleStatus: null, grandson: null };
			}

			grandson.isRed = !grandson.isRed;

			if (isLeft) {
				this.#rorSmall(cloneCurrentNode, children, grandson);

				this.#rol(cloneCurrentNode, grandson);

			} else {
				this.#rolSmall(cloneCurrentNode, children, grandson);

				this.#ror(cloneCurrentNode, grandson);
			}

			return { children: grandson, brokeRuleStatus: null, grandson: null };
		}

		this.root = recLookPlaceAndInsert(this.root).children;

		this.versions.registerVersion(this.root, this.totalVersions);

		this.length++;

		this.versions.totalVersions++;

		return this.length;
	}

	#rorSmall(grandfather, parent, grandson) {
		parent.left = grandson.right;

		grandson.right = parent;

		grandfather.right = grandson;
	}

	#rolSmall(grandfather, parent, grandson) {
		grandfather.left = grandson;

		parent.right = grandson.left;

		grandson.left = parent;
	}

	#ror(grandfather, parent) {
		grandfather.left = parent.right;

		parent.right = grandfather;
	}

	#rol(grandfather, parent) {
		grandfather.right = parent.left;

		parent.left = grandfather;
	}

	findByKey(key) {
		if (this.length === 0) {
			throw new Error("Method is findByKey is not suppoeted in Empty RedBlackTree.");
		}

		const iterator = this.getIteratorForFindMethod(key);

		for (const node of iterator) {
			if (node.key === key) {
				return node.value;
			}
		}

		return -1;
	}
}