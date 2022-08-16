"use strict";

const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const glob = require("glob");
const path = require("path");

const fs = require("fs");
const spawnSync = require("child_process").spawnSync;

function cleanUpMan() {
  //delete this directory
  rimraf.sync(__dirname + "/../man/");
  // recreate the target directory
  mkdirp.sync(__dirname + "/../man/");
}

function cleanUpWebsite() {
  rimraf.sync(__dirname + "/../website/");
  mkdirp.sync(__dirname + "/../website/");
}

function getSources(type) {
  const files = glob.sync("./" + type + "/*.md");

  return files.map((file) => path.resolve(file));
}

function getTargetForManpages(currentFile, type) {
  let target;
  // set the right section for the man page on unix systems
  if (type === "cli") {
    target = currentFile.replace(/\.md$/, ".1");
  }

  if (type === "api") {
    target = currentFile.replace(/\.md$/, ".3");
  }

  if (!target) {
    return;
  }

  // replace the source dir with the target dir
  // do it for the windows path (doc\\api) and the unix path (doc/api)
  target = target
    .replace(["doc", "cli"].join(path.sep), "man")
    .replace(["doc", "api"].join(path.sep), "man");

  return target;
}

const sources = {
  api: getSources("api"),
  cli: getSources("cli"),
  websiteIndex: getSources("website"),
};

(() => {
  cleanUpMan();

  Object.keys(sources).forEach((type) => {
    sources[type].forEach((currentFile) => {
      if (type === "websiteIndex") {
        return;
      }

      // convert markdown to manpages
      const out = spawnSync("node", [
        "../node_modules/marked-man/bin/marked-man",
        currentFile,
      ]);

      const target = getTargetForManpages(currentFile, type);

      // write output to target file
      fs.writeFileSync(target, out.stdout, "utf8");
    });
  });
})();

(() => {})();
