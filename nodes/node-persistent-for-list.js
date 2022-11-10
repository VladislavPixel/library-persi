class NodePersistent{
	constructor(value) {
		this.value = value;
		this.next = null;
		this.prev = null;
		this.MAX_CHANGES = 4;
		this.counterChanges = 0;
		this.changeLog = {};
	}

	getFirstNode() {
		const iterator = new IteratorReverseOverNodes(this)

		let result;

		for (const node of iterator) {
			result = node;
		}

		return result;
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
			return null;
		}

		if (change !== undefined) {
			node.addChange(totalVersion, change);
		}

		if (node.counterChanges > node.MAX_CHANGES) {
			const newNode = node.applyListChanges();

			newNode.prev = this.cloneCascading(newNode.prev, totalVersion, { next: newNode });

			if (change.next !== newNode.next) {
				newNode.next = this.cloneCascading(newNode.next, totalVersion, { prev: newNode });
			}

			return newNode;
		}

		return node;
	}

	getClone() {
		const clone = Object.assign(new NodePersistent(0), this);

		clone.value = JSON.parse(JSON.stringify(clone.value));

		return clone;
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

		const node = this.cloneCascading(this, numberVersion, configForValueNode);

		return node;
	}
}
