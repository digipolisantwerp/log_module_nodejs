
[![Build Status](https://travis-ci.com/digipolisantwerp/authz_module_nodejs.svg?branch=master)](https://travis-ci.com/digipolisantwerp/authz_module_nodejs)
[![Coverage Status](https://coveralls.io/repos/github/digipolisantwerp/authz_module_nodejs/badge.svg?branch=master)](https://coveralls.io/github/digipolisantwerp/authz_module_nodejs?branch=master)
[![npm version](https://badge.fury.io/js/%40digipolis%2Fauthz.svg)](https://badge.fury.io/js/%40digipolis%2Fauthz)

**npm:** [npmjs.com/package/@digipolis/log](https://www.npmjs.com/package/@digipolis/log)
# @digipolis/log
<img src="assets/log.svg" alt="log" width="100"/>

Log helper which converts default logs to indexable json log.


### Table of contents:

<!--ts-->
   * [Installing](#installing)
      * [npm](#npm)
      * [Yarn](#yarn)
   * [Configuration](#configuration)
   * [Logging](#logging)
   * [Running the tests](#running-the-tests)
   * [Versioning](#versioning)
   * [Authors](#authors)
   * [License](#license)
<!--te-->

## Installing

#### npm:
```sh
$ npm i @digipolis/log
```

#### Yarn:
```sh
$ yarn add @digipolis/log
```

## Configuration

##### Params:
| Param                   | Description        | Values                                  |
| :---                    | :---               | :---                                    |
| ***type*** *(optional)* | Set logging mode   | **log**(default) / **json** / **text**  |

##### Example:
```javascript
const digipolisLogger = require('@digipolis/log');

digipolisLogger(console, {
  type: 'text', // log | json | text
});

// human readable for local development
console.log('hello');
/*
type: 'text' -> INFO: 2021-12-01T09:43:19.173Z hello
*/

// human readable json local development
console.log('hello');
/*
type: 'json' -> {
  message: 'hello',
  timestamp: '2021-12-01T09:44:20.565Z',
  type: [ 'technical' ],
  level: 'INFO',
  correlationId: ''
}
*/

// log for kibana json for production
console.log('hello');
/*
type: 'log' -> {"message":"hello","timestamp":"2021-12-01T09:45:56.515Z","type":["technical"],"level":"INFO","correlationId":""}
*/

```

## Logging

#### examples
```javascript

// type: json
console.log('hello');
/*
{
  message: 'hello',
  timestamp: '2021-12-01T09:44:20.565Z',
  type: [ 'technical' ],
  level: 'INFO',
  correlationId: ''
}
*/

// type: json
console.error('hello');
/*
{
  message: 'hello',
  timestamp: '2021-12-01T09:44:20.565Z',
  type: [ 'technical' ],
  level: 'ERROR',
  correlationId: ''
}
// type: json
*/

console.error(new Error('hello'));
/*
{
  message: 'hello',
  timestamp: '2021-12-01T09:44:20.565Z',
  type: [ 'technical' ],
  level: 'ERROR',
  correlationId: ''
}
*/
```

