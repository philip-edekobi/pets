# pets-init(3) -- Create a JSON file consisting of a pets array

## SYNOPSIS

```js
pets.commands.init(path?: String, output?: String, rows?: Number): undefined
```

## DESCRIPTION

`path`, `output` and `rows` are optional arguments.

`path` provides the desired file path of the JSON file. If not specified, it defaults to the current directory.

`output` changes the name of the output JSON file from "db" to a specified name. The format remains JSON.

`rows` specifies the number of pets in the db.
