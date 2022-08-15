"use strict";

const assert = require("assert");
const fs = require("fs");
const spawn = require("child_process").spawn;

const init = require("../lib/init").api;

describe("init", () => {
  describe("cli", () => {
    it("returns an error on invalid directory", (done) => {
      let buffer = "";

      const child = spawn("node", ["../bin/pets-cli", "init", "ppp"], {
        cwd: __dirname,
      });

      child.stderr.on("data", (buffString) => {
        buffer += buffString.toString();
      });

      child.on("close", () => {
        assert.equal(buffer, "ERR! the given path does not exist \n");
      });
      done();
    });

    it("creates db successfully without specified directory", (done) => {
      try {
        let buffer = "";

        (async () => {
          const child = spawn("node", ["./bin/pets-cli", "init"], {
            cwd: __dirname + "/..",
          });

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            assert.equal(buffer, "DB created and initialized successfully\n");
            done();
            cleanup();
          });

          function cleanup() {
            fs.unlinkSync("./db.json");
          }
        })();
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe("api", () => {
    it("returns an error on invalid directory", async () => {
      return assert.rejects(async () => await init("ppp"));
    });
  });
});
