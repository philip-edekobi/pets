"use strict";

const { faker } = require("@faker-js/faker");
const fs = require("fs");
const pets = require("./pets");

const animalTypes = [
  "horse",
  "fish",
  "dog",
  "cat",
  "snake",
  "rabbit",
  "hamster",
  "bird",
];

const randChoice = () => Math.floor(Math.random() * 8);

const DEFAULTROWS = 200;
const FILENAME = "db";

function generatePet(i) {
  let pet = {
    id: i || faker.datatype.uuid(),
    name: faker.name.middleName(randChoice() % 2 ? "male" : "female"),
    type: animalTypes[randChoice()],
    owner: faker.name.fullName(),
    age: faker.datatype.number({ max: 13, min: 2 }),
    eyeColor: faker.color.human(),
  };
  return pet;
}

function init(path, output, rows) {
  return new Promise((resolve, reject) => {
    output = output || FILENAME;
    rows = rows || DEFAULTROWS;

    try {
      if (!fs.existsSync(path)) {
        const err = new Error("the given path does not exist");
        err.type = "EUSAGE";
        throw err;
      }

      let json = {
        pets: [],
      };
      for (let i = 1; i <= rows; i++) {
        json.pets.push(generatePet(i));
      }
      fs.writeFileSync(`${path}/${output}.json`, JSON.stringify(json, null, 2));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function cli(path) {
  return new Promise(async (resolve, reject) => {
    const rows = pets.config.get("rows");
    const output = pets.config.get("output");
    if (!path) path = process.cwd();
    try {
      await init(path, output, rows);
      console.log("DB created and initialized successfully");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  api: init,
  cli,
};
