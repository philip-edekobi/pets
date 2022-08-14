"use strict";

const assert = require("assert");
const fs = require("fs");
const spawn = require("child_process").spawn;
const spawnSync = require("child_process").spawnSync;

const check = require("../lib/check").api;

describe("check", () => {
  describe("cli", () => {
    it("works without a specified path when db exists", (done) => {
      let testPath = `${__dirname}/db.json`;
      try {
        fs.writeFileSync(testPath, "");
        test();

        function test() {
          let buffer = "";

          const child = spawn("node", ["../bin/pets-cli", "check"], {
            cwd: __dirname,
          });

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            done();
            cleanup();
            assert.equal(buffer, "db.json found!\n");
          });

          function cleanup() {
            if (fs.existsSync(testPath))
              fs.unlink(testPath, (err) => {
                if (err) throw err;
              });
          }
        }
      } catch (err) {
        throw err;
      }
    });

    it("works without a specified path when db does not exist", (done) => {
      let testPath = `${__dirname}/db.json`;
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }
      test();

      function test() {
        let buffer = "";

        const child = spawn("node", ["../bin/pets-cli", "check"], {
          cwd: __dirname,
        });

        child.stdout.on("data", (buffString) => {
          buffer += buffString.toString();
        });

        child.on("close", () => {
          assert.equal(
            buffer,
            "a db.json file does not exist in this directory\n"
          );
        });
        done();
      }
    });

    it("works with a specified path when db exists", (done) => {
      let testPath = `${__dirname}/placeholder`;
      try {
        fs.writeFileSync(`${testPath}/db.json`, "");
        test();

        function test() {
          let buffer = "";

          const child = spawn(
            "node",
            ["../bin/pets-cli", "check", `${testPath}`],
            {
              cwd: __dirname,
            }
          );

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            done();
            cleanup();
            assert.equal(buffer, "db.json found!\n");
          });

          function cleanup() {
            return fs.unlinkSync(`${testPath}/db.json`);
          }
        }
      } catch (err) {
        throw err;
      }
    });

    it("works with a specified path when db does not exist", (done) => {
      let testPath = `${__dirname}/placeholder`;
      if (fs.existsSync(`${testPath}/db.json`)) {
        fs.unlinkSync(`${testPath}/db.json`);
      }
      test();

      function test() {
        let buffer = "";

        const child = spawn(
          "node",
          ["../bin/pets-cli", "check", `${testPath}`],
          {
            cwd: __dirname,
          }
        );

        child.stdout.on("data", (buffString) => {
          buffer += buffString.toString();
        });

        child.on("close", () => {
          assert.equal(
            buffer,
            "a db.json file does not exist in this directory\n"
          );
        });
        done();
      }
    });

    it("returns an error on invalid directory", (done) => {
      let buffer = "";

      const child = spawn("node", ["../bin/pets-cli", "check", "ppp"], {
        cwd: __dirname,
      });

      child.stderr.on("data", (buffString) => {
        buffer += buffString.toString();
      });

      child.on("close", () => {
        assert.equal(buffer, "ERR! the directory you used is invalid \n");
      });
      done();
    });
  });

  describe("api", () => {
    it("works works without a specified path when db exists", (done) => {
      assert.equal(check());
    });
  });
});
