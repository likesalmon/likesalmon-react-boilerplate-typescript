# Likesalmon React Boilerplate Typescript

A boilerplate for React projects based on [react-boilerplate-typescript](https://github.com/react-boilerplate/react-boilerplate-typescript), which was in turn based on [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate).

To quote from [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate):

> Please note that this boilerplate is production-ready and not meant for beginners! If you're just starting out with react or redux, please refer to [https://github.com/petehunt/react-howto](https://github.com/petehunt/react-howto) instead. If you want a solid, battle-tested base to build your next product upon and have some experience with react, this is the perfect start for you.

If you're already familiar with React and Redux, the [react-boilerplate docs](https://github.com/react-boilerplate/react-boilerplate/blob/master/docs/general/README.md) are a good place to start familiarizing yourself with how this all works. React and Redux are really just the beginning. Next take a look at the [react-boilerplate-typescript docs](https://github.com/react-boilerplate/react-boilerplate-typescript/tree/master/docs), which act as a supplement.

There are some key differences between this boilerplate and the projects it was based on:

- Unlike [react-boilerplate-typescript](https://github.com/react-boilerplate/react-boilerplate-typescript) we are not relying on [react-redux-typescript-guide](https://github.com/piotrwitek/react-redux-typescript-guide) or it's recommendation of [typesafe-actions](https://github.com/piotrwitek/typesafe-actions). They create a large amount of abstraction without a correspondingly large benefit. In this way, we are choosing flexibility over DRY-ness.
- Instead of splitting constants, actions, sagas, selectors, types, and components into different files, that stuff is all defined in one `index.ts` file separated by big airy comments. The hope is one file is less overhead than lots of files, and Typescript should make this  a safe thing to do.
- Services are used to make requests (see Service docs below).
- We are not using [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html) and it's partners [ErrorBoundary](https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors) and [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html) as provided by the Loadable HOC. Concurrent Mode solves a problem we don't have: services provide all the info we need to render components or their fallbacks with a cleaner separation of concerns.
- Memoize-ing your containers and components with [React.memo](https://dmitripavlutin.com/use-react-memo-wisely/) is an option, but it should probably only be used if the underlying data is refreshed a lot without necessarily causing changes to the view, such as when polling an API. See [this informative post](https://dmitripavlutin.com/use-react-memo-wisely/) for a well-reasoned argument.

## Services

Services make requests for you. They save the status of the request to the store so you can show different UI elements depending on how things are going.

### Services Usage

1. Generate a service: `npm run generate service`. This will create the service in the app/services/ directory, add the service to ApplicationRootState in app/types/index.ts, and add a component to the `<App />` container.
2. Make any customizations you need to the service configuration. Service implementations are meant to be extremely flexible so don't be afraid to get your hands dirty. There are lots of insightful comments in the selector code to help you out.
3. If everything worked you should see your service's namespace in the store when you load your app, with a `status` like `services/MyService/NOT_ASKED`.
4. To make requests, import the `makeRequest` action into your container, along with any of the provided selectors.

#### Example Service Usage in a Container

Here's an example of using a service called GetGiphyCats in a container. Notice how we show different components based on the status of the request.

```jsx
// app/containers/MyContainer/index.ts
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeRequest,
  makeSelectImageUrl,
  makeSelectHasNotBeenAsked,
  makeSelectIsLoading,
  makeSelectWasSuccessful,
  makeSelectHasFailed,
} from 'services/GetGiphyCats';
import Spinner from 'components/Spinner';

import Button from 'components/Button';
import styled from 'styles/styled-components';

/**
 * ############################################################################
 *
 * Constants
 *
 * ############################################################################
 */
export enum Constants {
  NAMESPACE = 'containers/RandomCats',
}

/**
 * ############################################################################
 *
 * Selectors
 *
 * ############################################################################
 */
// Combine selectors into an object that can be used by your main component
// with `useSelector`
const stateSelector = createStructuredSelector({
  hasNotBeenAsked: makeSelectHasNotBeenAsked,
  isLoading: makeSelectIsLoading,
  wasSuccessful: makeSelectWasSuccessful,
  hasFailed: makeSelectHasFailed,
  imageUrl: makeSelectImageUrl,
});

/**
 * ############################################################################
 *
 * Components
 *
 * ############################################################################
 */
const ErrorText = styled.p`
  color: red;
`;

export default function MyContainer() {
  const {
    hasNotBeenAsked,
    isLoading,
    wasSuccessful,
    hasFailed,
    imageUrl,
  } = useSelector(stateSelector);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Random Cat Generator</h1>
      <p>
        <Button onClick={() => dispatch(makeRequest())}>Moar Cats!</Button>
      </p>
      <div>
        {hasNotBeenAsked && <p>Click the button, get a cat!</p>}
        {isLoading && <Spinner />}
        {wasSuccessful && <img src={imageUrl} alt="This should be a cat" />}
        {hasFailed && <ErrorText>There was an error!</ErrorText>}
      </div>
    </div>
  );
}
```
