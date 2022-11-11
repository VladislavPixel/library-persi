const persistentOneWayLinkedList = new OneWayLinkedList(["pixel"]);

persistentOneWayLinkedList.addFirst(100);
persistentOneWayLinkedList.addFirst(777);

persistentOneWayLinkedList.set({ value: 125 });
persistentOneWayLinkedList.set({ value: 555 });
persistentOneWayLinkedList.set({ value: 888 });
persistentOneWayLinkedList.set({ value: 1000 });
persistentOneWayLinkedList.set({ path: "value", value: "space" });

persistentOneWayLinkedList.set({ path: "value", value: 24 });
persistentOneWayLinkedList.set({ value: 4444444 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 24 }] }]);
persistentOneWayLinkedList.set({ value: 11 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 4444444 }] }]);
persistentOneWayLinkedList.set({ value: "T-34", path: "value" }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 11 }] }]);

persistentOneWayLinkedList.set({ value: { name: "Vladisalv", job: "programmer", home: { target: "Moscow" } } }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 100 }] }]);
persistentOneWayLinkedList.set({ path: "value/home/target", value: "Tula" }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/home/target", value: "Moscow" }] }]);

// persistentOneWayLinkedList.set({ value: "Valeria" }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/name", value: "Vladisalv" }] }]);

// persistentOneWayLinkedList.set({ value: 900 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: "pixel" }] }]);
// persistentOneWayLinkedList.set({ value: 1500 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 900 }] }]);
// persistentOneWayLinkedList.set({ value: "Globus" }, [{ nameMethod: "findByKey", arrArgsForMethod: ["Valeria"] }]);
// persistentOneWayLinkedList.set({ value: 3500, path: "value" }, [{ nameMethod: "findByKey", arrArgsForMethod: [1500] }]);

//console.log(persistentOneWayLinkedList.versions.at(12));
console.log(persistentOneWayLinkedList.get(12, "value/home", [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/home/target", value: "Moscow" }] }]));
console.log(persistentOneWayLinkedList.get(13, "value/home/target", [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/job", value: "programmer" }] }]));
console.log(persistentOneWayLinkedList.get(6, "value", [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: "pixel" }] }]));

console.log(persistentOneWayLinkedList);

