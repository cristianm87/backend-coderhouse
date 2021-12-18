"use strict";
process.on('message', function (message) {
    var min = 1;
    var max = 1000;
    var number;
    var object = {};
    for (var index = 0; index < message; index++) {
        number = Math.floor(min + Math.random() * (max - min + 1));
        if (object[number] === undefined) {
            object[number] = 1;
            continue;
        }
        object[number]++;
    }
    if (typeof process.send === 'function') {
        process.send(object);
    }
});
