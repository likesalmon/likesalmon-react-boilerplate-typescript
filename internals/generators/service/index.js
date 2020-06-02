/**
 * Service Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a service',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called? Convention says use upper case camelcase with a "Service" suffix.',
      default: 'GetStuffService',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'url',
      default: 'https://api.example.com',
      message: 'What is the base URL?',
    },
    {
      type: 'input',
      name: 'method',
      default: 'GET',
      message: 'What is the request method?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    const actions = [
      {
        type: 'add',
        path: '../../app/services/{{properCase name}}/index.tsx',
        templateFile: './service/index.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/services/{{properCase name}}/tests/index.test.tsx',
        templateFile: './service/index.test.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../../app/types/index.ts',
        pattern: new RegExp(/.*\/\/.*\[IMPORT NEW CONTAINERSTATE ABOVE\].+\n/),
        templateFile: './service/importContainerState.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../../app/types/index.ts',
        pattern: new RegExp(/.*\/\/.*\[INSERT NEW REDUCER KEY ABOVE\].+\n/),
        templateFile: './service/appendApplicationRootState.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../../app/containers/App/index.tsx',
        pattern: new RegExp(/.*\/\/.*\[IMPORT NEW SERVICE COMPONENT ABOVE\].+\n/),
        templateFile: './service/importComponent.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../../app/containers/App/index.tsx',
        pattern: new RegExp(/.*\{\/\*.*\[INSERT NEW SERVICE COMPONENT ABOVE\].+\n/),
        templateFile: './service/appendComponent.hbs',
        abortOnFail: true,
      },
      {
        type: 'prettify',
        path: '/services/',
      }
    ];

    return actions;
  },
};
