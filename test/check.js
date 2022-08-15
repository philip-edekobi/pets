"use strict";

const assert = require("assert");
const fs = require("fs");
const spawn = require("child_process").spawn;

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
        assert.equal(buffer, "ERR! the given path does not exist \n");
      });
      done();
    });
  });

  describe("api", () => {
    it("works without a specified path when db exists", async () => {
      let testPath = `${process.cwd()}/db.json`;

      try {
        fs.writeFileSync(testPath, "");

        const result = await check();

        fs.unlinkSync(testPath);

        return assert.deepEqual(result, true);
      } catch (err) {
        throw err;
      }
    });

    it("works without a specified path when db does not exist", async () => {
      let testPath = `${process.cwd()}/db.json`;

      try {
        if (fs.existsSync(testPath)) fs.unlinkSync(testPath);

        const result = await check();

        return assert.deepEqual(result, false);
      } catch (err) {
        throw err;
      }
    });

    it("works with a specified path when db exists", async () => {
      let testPath = `${__dirname}/placeholder`;

      try {
        fs.writeFileSync(`${testPath}/db.json`, "");

        const result = await check(testPath);

        fs.unlinkSync(`${testPath}/db.json`);

        return assert.deepEqual(result, true);
      } catch (err) {
        throw err;
      }
    });

    it("works with a specified path when db does not exist", async () => {
      let testPath = `${__dirname}/placeholder`;

      try {
        if (fs.existsSync(`${testPath}/db,json`))
          fs.unlinkSync(`${testPath}/db.json`);

        const result = await check(testPath);

        return assert.deepEqual(result, false);
      } catch (error) {
        throw error;
      }
    });

    it("returns an error on invalid directory", async () => {
      return assert.rejects(async () => await check("ppp"));
    });
  });
});
