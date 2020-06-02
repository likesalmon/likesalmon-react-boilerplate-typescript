/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a container component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
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
      type: 'confirm',
      name: 'memo',
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    {
      type: 'confirm',
      name: 'wantHeaders',
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: 'wantSaga',
      default: true,
      message: 'Do you want sagas for side effects?',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
  ],
  actions: data => {
    // Generate index.ts and index.test.tsx
    const actions = [
      {
        type: 'add',
        path: '../../app/containers/{{properCase name}}/index.tsx',
        templateFile: './container/index.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/containers/{{properCase name}}/tests/index.test.tsx',
        templateFile: './container/index.test.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../../app/types/index.ts',
        pattern: new RegExp(/.*\/\/.*\[IMPORT NEW CONTAINERSTATE ABOVE\].+\n/),
        templateFile: './container/importContainerState.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../../app/types/index.ts',
        pattern: new RegExp(/.*\/\/.*\[INSERT NEW REDUCER KEY ABOVE\].+\n/),
        templateFile: './container/appendApplicationRootState.hbs',
        abortOnFail: true,
      },
    ];

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/messages.ts',
        templateFile: './container/messages.ts.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: '/containers/',
    });

    return actions;
  },
};
