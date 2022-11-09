const persistentOneWayLinkedList = new OneWayLinkedList(["pixel"]);

persistentOneWayLinkedList.addFirst(100);
persistentOneWayLinkedList.addFirst(777);

persistentOneWayLinkedList.set({ value: 125 });
persistentOneWayLinkedList.set({ value: 555 });
persistentOneWayLinkedList.set({ value: 888 });
persistentOneWayLinkedList.set({ value: 1000 });
persistentOneWayLinkedList.set({ path: "value", value: "space" });
persistentOneWayLinkedList.set({ path: "value", value: 24 });

persistentOneWayLinkedList.set({ path: undefined, value: 125 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 24 }] }]);

console.log(persistentOneWayLinkedList);
