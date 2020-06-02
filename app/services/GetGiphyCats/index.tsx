/**
 *
 * GetGiphyCats Service
 *
 * Services make requests for you. They provide lots of introspection so you
 * can display different states depending on the status of the request.
 *
 * Structurally services are very similar to containers, but they output no HTML.
 * Instead, they provide a `makeRequest` action you can dispatch from any
 * container to initiate a request.
 *
 * Services track their status in the store. When you initialize your
 * app, the status is `NOT_ASKED`. After you initiate a request, the status
 * will change to `LOADING`. If the request fails, the status becomes
 * `ERROR` and if the request succeeds it will be `SUCCESS`. Errors and
 * response data are stored alongside the status.
 *
 * Lots of selectors are provided for you to get data from the store. The
 * general purpose selectors defined below are meant to be imported into
 * your container and used as is or composed into custom selectors to fit
 * your needs.
 *
 * Response data and errors are purposely _not_ modified before placing
 * them in the store. This is nice for debugging, but more importantly
 * it doesn't force you to make any decisions about the data you might
 * regret later. When you need to manipulate the data, use one of the
 * provided selectors or create your own. They are quite efficient at
 * this. If you absolutely _must_ manipulate the data before it goes
 * into the store (for instance if you are worried about the size of
 * the payload), document your decision thoroughly so other developers
 * don't assume all the data is there.
 *
 * Usage
 * -----
 *
 * To use this service, first make any customizations you need to
 * `axiosConfig` below. Feel free to make any other customizations
 * you need, APIs are weird and this meant to be as flexible as
 * possible.
 *
 * Next, import and add the <GetGiphyCats /> component to the <App />
 * container.
 *
 * To initiate a request, dispatch the `makeRequest` action. Watch the
 * `services/GetGiphyCats` namespace in the store to see the `status`
 * update. Response data and errors will show up there when the request
 * completes.
 *
 * Access response data and errors by importing the selectors
 * defined below into your container, or use them to define your own.
 *
 */

import { notMyAction } from 'utils/utils';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { take, call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { createSelector, Selector } from 'reselect';
import { prop, ifElse, has, always, equals, isNil } from 'ramda';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';

/**
 * ############################################################################
 *
 * Axios Config
 *
 * See: https://github.com/axios/axios#request-config
 *
 * Config may be overridden or extended when you dispatch
 * `makeRequest` with an configOverrides object, e.g.
 * `dispatch(makeRequest({ params: { foo: 'bar' } }))`
 *
 * ############################################################################
 */
export const axiosConfig: AxiosRequestConfig = {
  // Required config
  url: 'https://api.giphy.com/v1/gifs/random',
  method: 'get',
  // Additional config
  params: {
    api_key: 'dc6zaTOxFJmzC',
    tag: 'cat',
  },
};

/**
 * ############################################################################
 *
 * Constants
 *
 * ############################################################################
 */
export enum Constants {
  NAMESPACE = 'services/GetGiphyCats',
  // MakeRequest is not used by the reducer,
  // and so is not included in the ActionTypes enum.
  MAKE_REQUEST = 'services/GetGiphyCats/MAKE_REQUEST',
}

/**
 * ############################################################################
 *
 * Actions
 *
 * Import the makeRequest action into your container to initiate a request.
 *
 * Example:
 *
 * ```javascript
 * function MyContainer() {
 *   const dispatch = useDispatch();
 *
 *   return (
 *     <button onClick={() => dispatch(makeRequest())}>Engage!</button>
 *   )
 * }
 * ```
 *
 * ############################################################################
 */

interface MakeRequest {
  type: Constants.MAKE_REQUEST;
  configOverrides?: any;
}
/**
 * makeRequest initiates a request when dispatched.
 */
export const makeRequest = (
  configOverrides: AxiosRequestConfig = {},
): MakeRequest => ({
  type: Constants.MAKE_REQUEST,
  configOverrides,
});

/**
 * The rest of these actions are used internally.
 */
export enum ActionTypes {
  NOT_ASKED = 'services/GetGiphyCats/NOT_ASKED',
  LOADING = 'services/GetGiphyCats/LOADING',
  SUCCESS = 'services/GetGiphyCats/SUCCESS',
  FAILURE = 'services/GetGiphyCats/FAILURE',
}

interface NotAsked {
  type: ActionTypes.NOT_ASKED;
}
export const notAsked = (): NotAsked => ({ type: ActionTypes.NOT_ASKED });

interface Loading {
  type: ActionTypes.LOADING;
}
export const loading = (): Loading => ({ type: ActionTypes.LOADING });

interface Success {
  type: ActionTypes.SUCCESS;
  responseData: any;
}
export const success = (responseData: any): Success => ({
  type: ActionTypes.SUCCESS,
  responseData,
});

interface Failure {
  type: ActionTypes.FAILURE;
  error: any;
}
export const failure = (error: any): Failure => ({
  type: ActionTypes.FAILURE,
  error,
});

// Combine into a union type for exhaustive type checking
// in the reducer.
type Action = NotAsked | Loading | Success | Failure;

/**
 * ############################################################################
 *
 * Reducer
 *
 * ############################################################################
 */

// ContainerState represents this service's slice of state
export interface ContainerState {
  readonly status: ActionTypes;
  readonly responseData?: any;
  readonly error?: AxiosError;
}

const initialState: ContainerState = {
  status: ActionTypes.NOT_ASKED,
};

export const reducer = (
  state: ContainerState = initialState,
  action: Action,
): ContainerState => {
  // Return the state if this is not an action from this container
  if (notMyAction(ActionTypes, action.type)) return state;

  switch (action.type) {
    case ActionTypes.NOT_ASKED:
      return { status: ActionTypes.NOT_ASKED };
    case ActionTypes.LOADING:
      return { status: ActionTypes.LOADING };
    case ActionTypes.SUCCESS:
      return { status: ActionTypes.SUCCESS, responseData: action.responseData };
    case ActionTypes.FAILURE:
      return { status: ActionTypes.FAILURE, error: action.error };
    // No default
  }
};

/**
 * ############################################################################
 *
 * Sagas
 *
 * Service sagas are imported into the App container and added to the
 * `serviceSagas` list for initialization.
 * ############################################################################
 */
export function* requestFlow(config: AxiosRequestConfig): SagaIterator {
  // Set the status to LOADING and store the params
  yield put(loading());

  try {
    // Make the request
    const { data } = yield call(axios.request, config);
    // Set the status to SUCCESS and store the results
    yield put(success(data));
  } catch (error) {
    // Set the status to FAILURE and store the error
    yield put(failure(error.toJSON()));
  }
}

export function* watchFlow(): SagaIterator {
  // Set the initial status
  yield put(notAsked());

  /* eslint-disable no-constant-condition */
  while (true) {
    // Watch for MAKE_REQUEST to be dispatched
    const { configOverrides } = yield take(Constants.MAKE_REQUEST);
    // Make the request
    yield call(requestFlow, { ...axiosConfig, ...configOverrides });
  }
}

/**
 * ############################################################################
 *
 * Selectors
 *
 * Feel free to import and use these selectors in your container.
 *
 * By convention, selectors composed with createSelector are prefixed
 * with `makeSelect`, e.g. `makeSelectSomething`. These are probably the
 * selectors you want, because they can get a slice of state from the
 * application state. Selectors prefixed only with `make` are used as
 * composable pieces of other selectors.
 *
 * General-purpose selectors go here. Selectors that aren't reusable
 * should be defined in your container.
 *
 * ############################################################################
 */

/**
 * ----------------------------------------------------------------------------
 * Common selectors
 *
 * Selectors defined on all services.
 * ----------------------------------------------------------------------------
 */

// State represents the application state
export interface State {
  [Constants.NAMESPACE]: ContainerState;
  [x: string]: any;
}

/**
 * Composable helper functions used by selectors.
 *
 * Not exported as they are just pieces
 * used in `createSelector` calls.
 *
 * Define the type on helper functions like this:
 *
 * selectThing: Selector<argument, return value> = myMethod
 *
 * Or within createSelector like this:
 *
 * createSelector([
 *   myMethod as Selector<argument, return value>
 * ], myOtherMethod)
 */

const selectDomain: Selector<State, ContainerState> = prop(Constants.NAMESPACE);

/**
 * The following selectors convenient way to track the status of your request.
 *
 * Example:
 * // MyContainer.js
 *
 * // ...imports and whatnot
 *
 * const selectFoo: Selector<ResponseData, string> = state => state.foo;
 * // makeSelectResponseData is a selector defined in the service
 * const makeSelectFoo = createSelector([makeSelectResponseData], selectFoo)
 *
 * const stateSelector = createStructuredSelector({
 *   hasNotBeenAsked: makeSelectHasNotBeenAsked,
 *   isLoading: makeSelectIsLoading,
 *   wasSuccessful: makeSelectWasSuccessful,
 *   hasFailed: makeSelectHasFailed,
 *   foo: makeSelectFoo,
 * });
 *
 * const MyContainer = () => {
 *   const {
 *     hasNotBeenAsked,
 *     isLoading,
 *     wasSuccessful,
 *     hasFailed,
 *     foo
 *   } = useSelector(stateSelector);
 *
 *   return (
 *     <div>
 *     <p>
 *       <Button onClick={() => dispatch(makeRequest())}>Click me to make a request!</Button>
 *     </p>
 *     <div>
 *       {hasNotBeenAsked && <p>Please click the button.</p>}
 *       {isLoading && <Spinner />}
 *       {wasSuccessful && <p>{foo}</p>}
 *       {hasFailed && <p>There was an error!</p>}
 *     </div>
 *   </div>
 *   )
 * }
 */
export const makeSelectStatus = createSelector([selectDomain], prop('status'));
export const makeSelectHasNotBeenAsked = createSelector(
  [makeSelectStatus],
  equals(ActionTypes.NOT_ASKED),
);
export const makeSelectIsLoading = createSelector(
  [makeSelectStatus],
  equals(ActionTypes.LOADING),
);
export const makeSelectWasSuccessful = createSelector(
  [makeSelectStatus],
  equals(ActionTypes.SUCCESS),
);
export const makeSelectHasFailed = createSelector(
  [makeSelectStatus],
  equals(ActionTypes.FAILURE),
);

// Data selectors
export const makeSelectResponseData = createSelector(
  [selectDomain],
  ifElse(has('responseData'), prop('responseData'), always({})) as Selector<
    ContainerState,
    any
  >,
);

// Error selector
export const makeSelectError = createSelector(
  [selectDomain],
  ifElse(has('error'), prop('error'), always(null)) as Selector<
    ContainerState,
    object | null
  >,
);
export const makeSelectErrorMessage = createSelector(
  [makeSelectError],
  ifElse(isNil, always(''), prop('message')) as Selector<object | null, string>,
);

/**
 * ----------------------------------------------------------------------------
 * Custom Selectors
 *
 * Custom selectors just for this service.
 * ----------------------------------------------------------------------------
 */
// Data represents the response.data object.
interface Data {
  image_url: string;
  [x: string]: any;
}
// Giphy response contains a nested `data` prop, e.g. { data: { data, meta }}
interface ResponseData {
  data: Data;
  meta: object;
}

// Composable helper functions
export const selectData: Selector<ResponseData, Data> = prop('data');
export const selectImageUrl: Selector<Data, string> = prop('image_url');

export const makeSelectData = createSelector(
  [makeSelectResponseData],
  prop('data') as Selector<ResponseData, Data>,
);
export const makeSelectImageUrl = createSelector(
  [makeSelectData],
  prop('image_url') as Selector<Data, string>,
);

/**
 * ############################################################################
 *
 * Components
 *
 * Add this component to the App container to register sagas and the reducer.
 *
 * ############################################################################
 */

function GetGiphyCats() {
  useInjectReducer({ key: Constants.NAMESPACE, reducer });
  useInjectSaga({ key: Constants.NAMESPACE, saga: watchFlow });

  // Return null so no HTML is rendered.
  return null;
}

export default GetGiphyCats;
