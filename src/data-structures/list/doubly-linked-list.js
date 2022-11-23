class DoublyLinkedList extends TwoWayLinkedList {
	constructor(iterable) {
		super(iterable);
	}

	getIteratorForReverseValueLastVersion() {
		return new IteratorForReverseValueLastVersion(this.tail);
	}
}
