"use strict";

const { faker } = require("@faker-js/faker");
const fs = require("fs");

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

function generatePet(i) {
  let pet = {
    id: i || faker.datatype.uuid(),
    name: faker.name.middleName(randChoice() % 2 ? "male" : "female"),
    type: animalTypes[randChoice()],
    owner: faker.name.fullName(),
    age: faker.datatype.number({ max: 13, min: 2 }),
    furColor: faker.color.human(),
    eyeColor: faker.color.human(),
  };
  return pet;
}

function init(path) {
  return new Promise((resolve, reject) => {
    path = path ? path : process.cwd();

    let json = {
      pets: [],
    };
    for (let i = 1; i <= 200; i++) {
      json.pets.push(generatePet(i));
    }
    fs.writeFileSync(`${path}/db.json`, JSON.stringify(json, null, 2));
  });
}

function cli(path) {
  console.log(init(path));
}

module.exports = {
  api: init,
  cli,
};
