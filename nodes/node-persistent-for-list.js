class NodePersistent{
	constructor(value) {
		this.value = value;
		this.next = null;
		this.prev = null;
		this.MAX_CHANGES = 4;
		this.counterChanges = 0;
		this.changeLog = {};
	}

	[Symbol.iterator]() {
		return new IteratorNodePersistentByNodes(this);
	}

	getFirstNode() {
		const iterator = new IteratorReverseOverNodes(this);

		let result;

		for (const node of iterator) {
			result = node;
		}

		return result;
	}

	findByKey(key) {
		for (const node of this) {
			if (typeof key === "object") {
				const { path, value } = key;

				try {
					const { value: val, lastSegment } = node.getValueByPath(path);

					if (val && val[lastSegment] === value) {
						return node;
					}
				} catch (err) {
					continue;
				}
			} else if (node.value === key) {
				return node;
			}
		}

		return -1;
	}

	addChange(numberVersion, change) {
		if ("path" in change) {
			this.changeLog[numberVersion] = { value: change.value, path: change.path };
		} else {
			this.changeLog[numberVersion] = change;
		}

		this.counterChanges++;

		return this.counterChanges;
	}

	cloneCascading(node, totalVersion, change) {
		if (node === null) {
			return { updatedNode: null, lastNode: null };
		}

		if (change !== undefined) {
			node.addChange(totalVersion, change);
		}

		if (node.counterChanges > node.MAX_CHANGES) {
			const newNode = node.applyListChanges();

			const resultPrev = this.cloneCascading(newNode.prev, totalVersion, { next: newNode });

			newNode.prev = resultPrev.updatedNode;

			let lastNode = null;

			if (change.next !== newNode.next) {
				const resultNext = this.cloneCascading(newNode.next, totalVersion, { prev: newNode });

				newNode.next = resultNext.updatedNode;

				lastNode = resultNext.lastNode;
			}

			return { updatedNode: newNode, lastNode: newNode.next === null ? newNode : lastNode };
		}

		return { updatedNode: node, lastNode: null };
	}

	getClone() {
		const clone = Object.assign(new NodePersistent(0), this);

		clone.value = JSON.parse(JSON.stringify(clone.value));

		return clone;
	}

	getCloneValue(valueNode) {
		return JSON.parse(JSON.stringify(valueNode));
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

	applyListChanges(numberVersion) {
		let newNode = new NodePersistent(this.value);

		newNode.next = this.next;

		newNode.prev = this.prev;

		const arrKeys = Object.keys(this.changeLog);

		for (const strVersion of arrKeys) {
			if (numberVersion !== undefined) {
				const index = Number(strVersion);

				if (index > numberVersion) {
					break;
				}
			}

			const change = this.changeLog[strVersion];

			if ("path" in change) {
				const { value: dataValue, lastSegment } = newNode.getValueByPath(change.path);

				if (dataValue === this) {
					newNode = Object.assign(newNode, { value: change.value });

					continue;
				}

				dataValue[lastSegment] = change.value;
			} else {
				newNode = Object.assign(newNode, change);
			}
		}

		return newNode;
	}

	set(configForValueNode, numberVersion) {
		if ("path" in configForValueNode) {
			const nodeLatestVersion = this.applyListChanges();

			nodeLatestVersion.getValueByPath(configForValueNode.path);
		}

		const resultCloneCascading = this.cloneCascading(this, numberVersion, configForValueNode);

		const node = resultCloneCascading.updatedNode;

		return node;
	}
}
