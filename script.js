//! DoubleLinkedList

const doubleLinkedList = new DoubleLinkedList(["pixel developer"]);

doubleLinkedList.set({ value: { name: "pixel", age: 24 } });
doubleLinkedList.set({ path: "value/color", value: "green" });
doubleLinkedList.set({ path: "value/phone", value: "8-345-345-21-12" });
doubleLinkedList.set({ path: "value/bob", value: "bim" });
//doubleLinkedList.set({ path: "value", value: 85 });

doubleLinkedList.addFirst(777);

console.log("Структура doubleLinkedList", doubleLinkedList);

//! HashTable

// const persistentHashTable = new HashTable({ name: "Vladislav", age: 24, job: "programmer", home: { target: "Tula", numerate: { code: 77 } } });

// persistentHashTable.set({ path: "value/name", value: "Pixel." });
// persistentHashTable.set({ path: "value/age", value: 33 });
// persistentHashTable.set({ path: "value/color", value: "blue" });
// persistentHashTable.set({ path: "value/home/numerate/code", value: 12345 });
// persistentHashTable.set({ path: "value/profession", value: "Frontend Developer" });
// console.log(persistentHashTable.get(5, "value/home"));

// console.log("Версия: ", persistentHashTable.versions.at(3));
// console.log("Версия: ", persistentHashTable.versions.at("+1"));
// console.log("Версия: ", persistentHashTable.versions.at("-1"));
// console.log("Версия: ", persistentHashTable.versions.at());
// console.log("Структура: ", persistentHashTable);

//! OneWayLinkedList
//const persistentOneWayLinkedList = new OneWayLinkedList(["pixel"]);

// persistentOneWayLinkedList.addFirst(100);
// persistentOneWayLinkedList.addFirst(777);

// persistentOneWayLinkedList.set({ value: 125 });
// persistentOneWayLinkedList.set({ value: 555 });
// persistentOneWayLinkedList.set({ value: 888 });
// persistentOneWayLinkedList.set({ value: 1000 });
// persistentOneWayLinkedList.set({ path: "value", value: "space" });

// persistentOneWayLinkedList.set({ path: "value", value: 24 });
// persistentOneWayLinkedList.set({ value: 4444444 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 24 }] }]);
// persistentOneWayLinkedList.set({ value: 11 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 4444444 }] }]);
// persistentOneWayLinkedList.set({ value: "T-34", path: "value" }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 11 }] }]);

// persistentOneWayLinkedList.set({ value: { name: "Vladisalv", job: "programmer", home: { target: "Moscow" } } }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 100 }] }]);
// persistentOneWayLinkedList.set({ path: "value/home/target", value: "Tula" }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/home/target", value: "Moscow" }] }]);

// persistentOneWayLinkedList.set({ value: "Valeria", path: "value/name" }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/name", value: "Vladisalv" }] }]);

// persistentOneWayLinkedList.set({ value: 900 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: "pixel" }] }]);
// persistentOneWayLinkedList.set({ value: 1500 }, [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: 900 }] }]);
// persistentOneWayLinkedList.set({ value: "Globus" }, [{ nameMethod: "findByKey", arrArgsForMethod: ["T-34"] }]);

// persistentOneWayLinkedList.addFirst("Upside");
// persistentOneWayLinkedList.set({ value: 350 });

//console.log(persistentOneWayLinkedList.versions.at(12));
//console.log(persistentOneWayLinkedList.get(12, "value/home", [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/home/target", value: "Moscow" }] }]));
//console.log(persistentOneWayLinkedList.get(13, "value/home/target", [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value/job", value: "programmer" }] }]));
//console.log(persistentOneWayLinkedList.get(6, "value", [{ nameMethod: "findByKey", arrArgsForMethod: [{ path: "value", value: "pixel" }] }]));
//console.log(persistentOneWayLinkedList);

