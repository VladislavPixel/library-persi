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
		return new IteratorForDepthReverse(this);
	}

	getIteratorForWidthTraversal() {
		return new IteratorForWidthTraversal(this);
	}

	getIteratorForFindMethod() {
		return new IteratorForFindMethod(this);
	}

	getCloneValue(valueNode) {
		return clone(valueNode);
	}

	getClone() {
		const cloneNode = Object.assign(new NodePersistentTree(0, 0), this);

		cloneNode.value = clone(cloneNode.value);

		return cloneNode;
	}

	getValueByPath(path) {
		const arrSegments = path.split("/");

		let currentValue = this;

		currentValue.value = this.getCloneValue(currentValue.value);

		for (let m = 0; m < arrSegments.length - 1; m++) {
			if (currentValue === undefined) {
				throw new Error("It is not possible to access the value in the specified path. The value does not contain such nesting.");
			}

			currentValue = currentValue[arrSegments[m]];
		}

		if (currentValue === undefined) {
			throw new Error("It is not possible to access the value in the specified path. The value does not contain such nesting.");
		}

		if (typeof currentValue !== "object") {
			throw new Error("Writing a new value is not possible because the value does not meet the required levels.");
		}

		return { value: currentValue, lastSegment: arrSegments[arrSegments.length - 1] };
	}

	findByKey(key) {
		const iterator = this.getIteratorForFindMethod(key);

		for (const node of iterator) {
			if (isIdentical(node.key, key)) {
				return node;
			}
		}

		return null;
	}
}
