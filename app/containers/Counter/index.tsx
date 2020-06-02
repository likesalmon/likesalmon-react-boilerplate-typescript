/*
 *
 * Counter
 *
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector, Selector } from 'reselect';
import { take, put } from 'redux-saga/effects';
import { add, subtract, prop } from 'ramda';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import styled from 'styles/styled-components';
import { notMyAction } from 'utils/utils';
import messages from './messages';

/**
 * ############################################################################
 *
 * Constants
 *
 * ############################################################################
 */
export enum Constants {
  NAMESPACE = 'containers/Counter',
}

/**
 * ############################################################################
 *
 * Actions
 *
 * ############################################################################
 */
export enum ActionTypes {
  INCREMENT = 'containers/Counter/INCREMENT',
  DECREMENT = 'containers/Counter/DECREMENT',
  INCREMENT_TOTAL_CLICKS = 'containers/Counter/INCREMENT_TOTAL_CLICKS',
}

interface Increment {
  type: ActionTypes.INCREMENT;
}
export const increment = (): Increment => ({ type: ActionTypes.INCREMENT });

interface Decrement {
  type: ActionTypes.DECREMENT;
}
export const decrement = (): Decrement => ({ type: ActionTypes.DECREMENT });

interface IncrementTotal {
  type: ActionTypes.INCREMENT_TOTAL_CLICKS;
}
export const incrementTotalClicks = (): IncrementTotal => ({
  type: ActionTypes.INCREMENT_TOTAL_CLICKS,
});

type Action = Increment | Decrement | IncrementTotal;

/**
 * ############################################################################
 *
 * Reducer
 *
 * ############################################################################
 */
// ContainerState is used by app/types/type.ts to define this slice
// of ApplicationRootState
export interface ContainerState {
  readonly count: number;
  readonly totalClicks: number;
}
const initialState: ContainerState = {
  count: 0,
  totalClicks: 0,
};

/**
 * Generate a random integer from 0 to max.
 */
export const reducer = (
  state: ContainerState = initialState,
  action: Action,
): ContainerState => {
  // Return the state if this is not an action from this container
  if (notMyAction(ActionTypes, action.type)) return state;

  switch (action.type) {
    case ActionTypes.INCREMENT:
      return { ...state, count: add(state.count, 1) };
    case ActionTypes.DECREMENT:
      return { ...state, count: subtract(state.count, 1) };
    case ActionTypes.INCREMENT_TOTAL_CLICKS:
      return { ...state, totalClicks: add(state.totalClicks, 1) };
    // No default
  }
};

/**
 * ############################################################################
 *
 * Sagas
 *
 * ############################################################################
 */
export function* saga() {
  /* eslint-disable no-constant-condition */
  while (true) {
    // Watch for either action
    yield take([ActionTypes.INCREMENT, ActionTypes.DECREMENT]);
    // Dispatch
    yield put(incrementTotalClicks());
  }
}

/**
 * ############################################################################
 *
 * Selectors
 *
 * ############################################################################
 */
// State represents the application state
export interface State {
  [Constants.NAMESPACE]: ContainerState;
  [x: string]: any;
}
// Arguments to createSelector must be of type Selector<input, results>
const selectDomain: Selector<State, ContainerState> = prop(Constants.NAMESPACE);
export const makeSelectCount = createSelector(
  [selectDomain],
  prop('count') as Selector<ContainerState, number>,
);
export const makeSelectTotalClicks = createSelector(
  [selectDomain],
  prop('totalClicks') as Selector<ContainerState, number>,
);
// Combine selectors into an object that can be used by the main component
// with `useSelector`
const stateSelector = createStructuredSelector({
  count: makeSelectCount,
  totalClicks: makeSelectTotalClicks,
});

/**
 * ############################################################################
 *
 * Components
 *
 * ############################################################################
 */
const Bigger = styled.span`
  font-size: 1.5em;
  margin: 0 10px;
`;

interface Props {
  title: string;
}

const Counter = (props: Props) => {
  const { title } = props;
  useInjectReducer({ key: Constants.NAMESPACE, reducer: reducer });
  useInjectSaga({ key: Constants.NAMESPACE, saga });

  const { count, totalClicks } = useSelector(stateSelector);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>{title}</h2>
      <h3>
        <FormattedMessage {...messages.description} />
      </h3>
      <p>
        <FormattedMessage {...messages.instructions} />
      </p>
      <Button onClick={() => dispatch(increment())}>+</Button>
      <Bigger>{count as number}</Bigger>
      <Button onClick={() => dispatch(decrement())}>-</Button>
      <p>
        <FormattedMessage {...messages.totalClicks} />: {totalClicks}
      </p>
    </div>
  );
};

export default Counter;
