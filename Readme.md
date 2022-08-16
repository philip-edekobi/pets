# Pets-CLI

## Synopsis

A CLI application for generating a JSON database of pets in a specified directory.
If a directory is not specified, it uses the current directory where the command is being run.
The database is stored in a `<name>.json` file where name is either passed by the user or defaults to "db".

## Usage

### CLI

#### init

```bash
$ pets init [path] [--output || -o] [--rows || -r]
```

Creates a JSON file consisting of an array of pets.

```json
{
  "pets": [
    {
        "id": 1,
        "name": "Alex",
        "type": "bird",
        "owner": "Rex Wilderman",
        "age": 13,
        "eyeColor": "cyan"
    },
    ...
  ]
}
```

`path`, `output` and `rows` are optional args.

`path` provides the desired file path of the JSON file. If not specified, it defaults to the current directory.

`output` changes the name of the JSON file from "db" to a specified name. The format remains JSON.

`rows` specifies the number of pets in the db.

#### check

```bash
$ pets check [path]
```

Checks if a "db.json" file exists in a given file path. If `path` is not specified, it is the current directory.

#### help

```bash
$ pets help [command]
```

Displays a general help utility when `command` is not specified, otherwise a specific help utility on `command` is opened.

### API

#### init

```js
pets.commands.init(path: String?, output: String, rows: Number): undefined
```

This function functions exactly alike the CLI version.

See [CLI](#init) for an apt description of this functionality.

#### check

```js
pets.commands.check(path?: String): Boolean
```

This function returns true if a file named "db.json" exists in the given path or current directory if path is not passed, else it returns false.
