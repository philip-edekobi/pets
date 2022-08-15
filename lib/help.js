"use strict";

const pets = require("./pets.js");

const isWindows = require("os").platform() === "win32";
const spawnSync = require("child_process").spawnSync;
const opener = require("opener");
const path = require("path");

function help(command) {
  return new Promise((resolve, reject) => {
    if (!pets.cli[command]) {
      console.log(getGeneralHelpMessage());
    } else {
      openDocumentation(command);
    }

    resolve();
  });
}

function getGeneralHelpMessage() {
  const commands = Object.keys(pets.cli).join(", ");

  const message = `Usage: pets <command>

The available commands for pets are:

${commands}

You can get more help on each command with: pets help <command>

Example:
pets help init

pets v${pets.version} on Node.js ${process.version}`;

  return message;
}

function openDocumentation(command) {
  if (isWindows) {
    const htmlFile = path.resolve(
      __dirname + "/../website/cli-" + command + ".html"
    );
    return opener("file:///" + htmlFile);
  }

  spawnSync("man", ["pets-" + command], { stdio: "inherit" });
}

module.exports = {
  cli: help,
};
