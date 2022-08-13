"use strict";

const fs = require("fs");
const pkg = require("../package.json");

const pets = {
    loaded: false,
    version: pkg.version,
};

const cli = {},
    api = {};

Object.defineProperty(pets, "commands", {
    get: () => {
        if (!pets.loaded) throw new Error("you need to run pets.load first");
        return api;
    },
});

Object.defineProperty(pets, "cli", {
    get: () => {
        if (!pets.loaded) throw new Error("you need to run pets.load first");
        return cli;
    },
});

pets.load = async function load(opts) {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname, (err, files) => {
            files.forEach(file => {
                if (!/\.js$/.test(file) || file === "pets.js") {
                    return;
                }
                const cmd = file.match(/(.*)\.js$/)[1];
                const module = require(`./${file}`);
                if (module.cli) cli[cmd] = module.cli;

                if (module.api) cli[cmd] = module.api;
            });
            pets.loaded = true;
            resolve(pets);
        });
    });
};

module.exports = pets;
