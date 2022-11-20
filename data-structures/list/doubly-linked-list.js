class DoublyLinkedList extends TwoWayLinkedList {
	constructor(defaultData) {
		super(defaultData);
	}

	getIteratorForReverseValueLastVersion() {
		return new IteratorForReverseValueLastVersion(this.tail);
	}
}
