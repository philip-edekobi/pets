"use strict";
const read = require("fs").readdir;
const exists = require("fs").existsSync;

function check(path) {
  return new Promise((resolve, reject) => {
    if (!path) path = process.cwd();

    if (!exists(path)) {
      const err = new Error("the given path does not exist");
      err.type = "EUSAGE";
      return reject(err);
    }

    read(path, (err, files) => {
      if (err) return reject(err);

      files.forEach((file) => {
        if (file === "db.json") return resolve(true);
      });
      return resolve(false);
    });
  });
}

async function cli(path) {
  try {
    const dbExists = await check(path);
    if (!dbExists) {
      console.info("a db.json file does not exist in this directory");
      process.exit(1);
    }

    console.info("db.json found!");
    process.exit(1);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  api: check,
  cli,
};
