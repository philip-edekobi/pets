# pets-init(1) -- Create a JSON file consisting of a pets array

## SYNOPSIS

```bash
$ pets init [path] [--output || -o] [--rows || -r]
```

## DESCRIPTION

`path`, `output` and `rows` are optional args.

`path` provides the desired file path of the JSON file. If not specified, it defaults to the current directory.

`output` changes the name of the JSON file from "db" to a specified name. The format remains JSON.

`rows` specifies the number of pets in the db.
