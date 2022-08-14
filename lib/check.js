"use strict";
const read = require("fs").readdir;
const spawnProcess = require("child_process").spawnSync;

const check = path => {
    return new Promise((resolve, reject) => {
        if (!path) path = process.cwd();

        read(path, (err, files) => {
            if (err) reject(err);

            files.forEach(file => {
                if (file === "db.json") resolve(true);
            });
            resolve(false);
        });
    });
};

const cli = async path => {
    const dbExists = await check(path);
    if(!dbExists) {
        console.info("a db.json file does not exist in this directory");
        process.exit(1);
    }

    console.info("db.json found!");
    process.exit(1);
};

module.exports = {
    api: check,
    cli,
};
