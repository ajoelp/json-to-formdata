# JSON to FormData
>Convert json data to a FormData object

## Install

This project uses [node](http://nodejs.org). Install from their website

```shell script
$ npm i @ajoelp/json-to-formdata
```

## Usage

```javascript

// Using ES6
import jsonToFormData from '@ajoelp/json-to-formdata';

// Using CommonJS
const jsonToFormData = require('@ajoelp/json-to-formdata');

// Use the package
const formData = jsonToFormData({
  foo: 'bar',
  bar: 'baz'
});

// With options
const formData = jsonToFormData({
  foo: 'bar',
  bar: 'baz'
}, {
  // Add indexes to arrays
  arrayIndexes: true,
  // Exclude nulls from data items
  excludeNull: true,
});

// Append an existing FormData Object
const formData = new FormData();
formData.append('key', 'value');

jsonToFormData({
  foo: 'bar',
  bar: 'baz'
}, {}, formData);

```

## License

[MIT License](https://opensource.org/licenses/MIT) © [Joel Podrebarac](https://joelpodrebarac.me/)



