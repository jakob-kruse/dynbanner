# ts-base
A base template for Typescript Node.js Projects 

## Getting started
```bash
npx degit jakob-kruse/ts-base <my-project>
```

(or clone this repo)

```bash
npm install
```

## Contents

This template contains the following folders and files:

- **src/** - The source code of your project

- **test/** - The test code of your project using jest via [ts-jest](https://github.com/kulshekhar/ts-jest)

### Config Module

Inside `src/config.ts` you can find a config module, that is ablet to parse the included environment file (.env) with 100% test coverage

Note: You can safely delete this file, if you don't need it. Dont forget to also delete the test file.

#### Usage

The module provides a `ensureEnv` function. It will take a pattern in this format `{ nameInConfig: "NAME_IN_ENV" }`.

This will read `process.env["NAME_IN_ENV"]` and return an object with the key `nameInConfig` and the value of the environment variable.

#### Example

Lets say you have .env file with the following content
```
HOST=localhost
```

Then you could you use the following code to get the value of the `HOST` environment variable

```ts
interface AppConfig {
    host: string
}

const config = ensureEnv<AppConfig>({ host: "HOST"})
// { host: "localhost" }
```

#### Additional options

Instead of providing just the name of the environment variable, you can also provide an object with the type and/or a default value like this:

```
PORT=3000
```

```ts
interface AppConfig {
    host: string
    port: number
}

const config = ensureEnv<AppConfig>({
    host: { key: "HOST", type: "string", default: "localhost" },
    port: { key: "PORT", type: "number", default: 3000 }
});

// { host: "localhost", port: 3000 }
```
##### Nesting

Nesting is not supported by the config module, but you can create an object and call ensureEnv multiple times for each key wth a different config.

## Scripts

- **build** - Builds the project with the typescript compiler

- **dev** - Uses nodemon to watch for changes and rerun the project with [ts-node](https://github.com/TypeStrong/ts-node)

- **start** - Builds the project with the typescript compiler and starts the it

- **format** - Formats the code with [prettier](https://github.com/prettier/prettier)

- **lint** - Lints the code with [eslint](https://github.com/eslint/eslint)

- **lint:fix** - Lints the code with [eslint](https://github.com/eslint/eslint) and fixes auto-fixable issues

- **test** - Runs the tests

- **test:watch** - Runs the tests and watches for changes

- **test:coverage** - Runs the tests and generates a coverage report

- **prepare** - Installs [husky](https://github.com/typicode/husky) commit hooks

## Commit hooks

Commit hooks run on commit and will automatically lint the project and run the tests.
