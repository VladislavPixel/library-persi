class RedBlackTree {
	constructor() {
		this.root = null;
		this.length = 0;
	}

	getIteratorForFindMethod(key) {
		return new IteratorForFindMethod(this.root, key);
	}

	isBrokeRule(parent, node) {
		if (parent === null) {
			return false;
		}

		return parent.isRed === true && node.isRed === true;
	}

	checkGrandson(grandson, parent, grandfather) {
		const isLeftParent = grandfather.left === parent ? true : false;

		const isLeftGrandson = parent.left === grandson ? true : false;

		return { isExternalGrandson: isLeftParent === isLeftGrandson, isLeft: isLeftGrandson };
	}

	isTriggerColor(node) {
		return !node.isRed && node.left !== null && node.left.isRed && node.right !== null && node.right.isRed;
	}

	updateColorsForNodeAndChildrens(node) {
		if (node !== this.root) {
			node.isRed = true;
		}

		node.left.isRed = false;

		node.right.isRed = false;
	}

	insert(value, key) {
		const newNode = new NodePersistentTree(value, key);

		if (this.length === 0) {
			newNode.isRed = false;

			this.root = newNode;

			this.length++;

			return this.length;
		}

		const recLookPlaceAndInsert = (currentNode) => {
			if (currentNode === null) {
				return { children: newNode, brokeRuleStatus: null, grandson: null };
			}

			const isLeftNodeNext = key < currentNode.key ? true : false;

			const nextNode = isLeftNodeNext ? currentNode.left : currentNode.right;

			const { children, brokeRuleStatus, grandson } = recLookPlaceAndInsert(nextNode);

			if (isLeftNodeNext) {
				currentNode.left = children;

			} else {
				currentNode.right = children;
			}

			if (brokeRuleStatus === null) {
				if (this.isBrokeRule(currentNode, children)) {
					return { children: currentNode, brokeRuleStatus: true, grandson: children };
				}

				return { children: currentNode, brokeRuleStatus: false, grandson: children };
			}

			if (brokeRuleStatus === false) {
				return { children: currentNode, brokeRuleStatus: null, grandson: children };
			}

			if (this.isTriggerColor(currentNode)) {
				this.updateColorsForNodeAndChildrens(currentNode);

				return { children: currentNode, brokeRuleStatus: null, grandson: children };
			}

			const { isExternalGrandson, isLeft } = this.checkGrandson(grandson, children, currentNode);

			currentNode.isRed = !currentNode.isRed;

			if (isExternalGrandson) {
				children.isRed = !children.isRed;

				if (isLeft) {
					this.ror(currentNode, children);
				} else {
					this.rol(currentNode, children);
				}

				return { children, brokeRuleStatus: null, grandson: null };
			}

			grandson.isRed = !grandson.isRed;

			if (isLeft) {
				this.rorSmall(currentNode, children, grandson);

				this.rol(currentNode, grandson);

			} else {
				this.rolSmall(currentNode, children, grandson);

				this.ror(currentNode, grandson);
			}

			return { children: grandson, brokeRuleStatus: null, grandson: null };
		}

		this.root = recLookPlaceAndInsert(this.root).children;

		this.length++;

		return this.length;
	}

	rorSmall(grandfather, parent, grandson) {
		parent.left = grandson.right;

		grandson.right = parent;

		grandfather.right = grandson;
	}

	rolSmall(grandfather, parent, grandson) {
		grandfather.left = grandson;

		parent.right = grandson.left;

		grandson.left = parent;
	}

	ror(grandfather, parent) {
		grandfather.left = parent.right;

		parent.right = grandfather;
	}

	rol(grandfather, parent) {
		grandfather.right = parent.left;

		parent.left = grandfather;
	}

	find(key) {
		if (this.length === 0) {
			throw new Error("Method is find is not suppoeted in Empty RedBlackTree.");
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