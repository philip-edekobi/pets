"use strict";
const read = require("fs").readdir;
const exists = require("fs").existsSync;

function check(path) {
  return new Promise((resolve, reject) => {
    if (!path) path = process.cwd();

    if (!exists(path)) {
      const err = new Error("the directory you used is invalid");
      err.type = "EUSAGE";
      reject(err);
    }

    read(path, (err, files) => {
      if (err) reject(err);

      files.forEach((file) => {
        if (file === "db.json") resolve(true);
      });
      resolve(false);
    });
  });
}

async function cli(path) {
  const dbExists = await check(path);
  if (!dbExists) {
    console.info("a db.json file does not exist in this directory");
    process.exit(1);
  }

  console.info("db.json found!");
  process.exit(1);
}

module.exports = {
  api: check,
  cli,
};
