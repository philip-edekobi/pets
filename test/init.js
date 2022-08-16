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
            assert.deepEqual(fs.existsSync("./db.json"), true);
            done();
            cleanup();
          });

          function cleanup() {
            fs.unlinkSync("./db.json");
          }
        })();
      } catch (error) {
        throw new Error(error);
      }
    });

    it("creates db successfully with specified directory", (done) => {
      try {
        let buffer = "";

        (async () => {
          const child = spawn("node", ["./bin/pets-cli", "init", "./test"], {
            cwd: __dirname + "/..",
          });

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            assert.equal(buffer, "DB created and initialized successfully\n");
            assert.deepEqual(fs.existsSync("./test/db.json"), true);
            done();
            cleanup();
          });

          function cleanup() {
            fs.unlinkSync("./test/db.json");
          }
        })();
      } catch (error) {
        throw new Error(error);
      }
    });

    it("works with output flag", (done) => {
      try {
        let buffer = "";

        (async () => {
          const child = spawn(
            "node",
            ["./bin/pets-cli", "init", "./test", "-o", "test"],
            {
              cwd: __dirname + "/..",
            }
          );

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            assert.equal(buffer, "DB created and initialized successfully\n");
            assert.deepEqual(fs.existsSync("./test/test.json"), true);
            done();
            cleanup();
          });

          function cleanup() {
            fs.unlinkSync("./test/test.json");
          }
        })();
      } catch (error) {
        throw error;
      }
    });

    it("works with rows flag", (done) => {
      try {
        let buffer = "";

        (async () => {
          const child = spawn(
            "node",
            ["./bin/pets-cli", "init", "./test", "-r", "240"],
            {
              cwd: __dirname + "/..",
            }
          );

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            assert.equal(buffer, "DB created and initialized successfully\n");
            assert.deepEqual(fs.existsSync("./test/db.json"), true);
            const strJson = fs.readFileSync("./test/db.json");
            const json = JSON.parse(strJson);
            assert.equal(json.pets.length, 240);
            done();
            cleanup();
          });

          function cleanup() {
            fs.unlinkSync("./test/db.json");
          }
        })();
      } catch (error) {
        throw error;
      }
    });

    it("works with output and rows flag together", (done) => {
      try {
        let buffer = "";

        (async () => {
          const child = spawn(
            "node",
            ["./bin/pets-cli", "init", "./test", "-o", "test", "-r", "240"],
            {
              cwd: __dirname + "/..",
            }
          );

          child.stdout.on("data", (buffString) => {
            buffer += buffString.toString();
          });

          child.on("close", () => {
            assert.equal(buffer, "DB created and initialized successfully\n");
            assert.deepEqual(fs.existsSync("./test/test.json"), true);
            const strJson = fs.readFileSync("./test/test.json");
            const json = JSON.parse(strJson);
            assert.equal(json.pets.length, 240);
            done();
            cleanup();
          });

          function cleanup() {
            fs.unlinkSync("./test/test.json");
          }
        })();
      } catch (error) {
        throw error;
      }
    });
  });

  describe("api", () => {
    it("returns an error on invalid directory", async () => {
      return assert.rejects(async () => await init("ppp"));
    });

    it("creates db successfully at specified path", async () => {
      const testPath = `${__dirname}/placeholder`;

      try {
        await init(testPath);
        if (fs.existsSync(`${testPath}/db.json`)) return assert.ok(true);
        else throw new Error("create db failed");
      } catch (error) {
        throw new Error(error);
      } finally {
        fs.unlinkSync(`${testPath}/db.json`);
      }
    });

    it("works when output filename is provided", async () => {
      const testPath = `${__dirname}/..`;

      try {
        await init(testPath, "test");
        if (fs.existsSync(`${testPath}/test.json`)) return assert.ok(true);
        else throw new Error("create db failed");
      } catch (error) {
        throw new Error(error);
      } finally {
        fs.unlinkSync(`${testPath}/test.json`);
      }
    });

    it("works when number of rows is provided", async () => {
      const testPath = `${__dirname}/..`;

      try {
        await init(testPath, null, 210);

        if (fs.existsSync(`${testPath}/db.json`)) {
          const strJson = fs.readFileSync(`${testPath}/db.json`, {
            encoding: "utf-8",
          });

          const json = JSON.parse(strJson);

          assert.equal(json.pets.length, 210);
        } else {
          throw new Error("create db failed");
        }
      } catch (error) {
        throw new Error(error);
      } finally {
        fs.unlinkSync(`${testPath}/db.json`);
      }
    });

    it("works when all 3 arguments are passed", async () => {
      const testPath = `${__dirname}/..`;

      try {
        await init(testPath, "test", 240);

        if (fs.existsSync(`${testPath}/test.json`)) {
          const strJson = fs.readFileSync(`${testPath}/test.json`, {
            encoding: "utf-8",
          });

          const json = JSON.parse(strJson);

          assert.equal(json.pets.length, 240);
        } else {
          throw new Error("create db failed");
        }
      } catch (error) {
        throw error;
      } finally {
        fs.unlinkSync(`${testPath}/test.json`);
      }
    });
  });
});
