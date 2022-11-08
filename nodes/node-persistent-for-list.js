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

	cloneCascading() {

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

	addChange(numberVersion, value, path) {
		if (path !== undefined) {
			this.changeLog[numberVersion] = { value, path };
		} else {
			this.changeLog[numberVersion] = value;
		}

		this.counterChanges++;

		return this.counterChanges;
	}

	getValueByPath(path) {
		const arrSegments = path.split("/");

		let currentValue = this;

		for (let m = 0; m < arrSegments.length - 1; m++) {
			if (currentValue === undefined) {
				throw new Error("It is not possible to access the value in the specified path. The value does not contain such nesting.");
			}

			currentValue = currentValue[arrSegments[m]];
		}

		if (currentValue === undefined) {
			throw new Error("It is not possible to access the value in the specified path. The value does not contain such nesting.");
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
				const { value, lastSegment } = this.getValueByPath(change.path);

				value[lastSegment] = change.value;
			} else {
				newNode = Object.assign(newNode, this.changeLog[strVersion]);
			}
		}

		return newNode;
	}
}