/**
 *
 * Tests for Counter
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import history from 'utils/history';
import { take, put } from 'redux-saga/effects';

import Counter, {
  Constants,
  ActionTypes,
  increment,
  decrement,
  incrementTotalClicks,
  ContainerState,
  reducer,
  saga,
  State,
  makeSelectCount,
  makeSelectTotalClicks,
} from '../index';
import { DEFAULT_LOCALE } from '../../../locales';
import configureStore from '../../../configureStore';

describe('Counter', () => {
  describe('actions', () => {
    describe('increment', () => {
      it('should return an action', () => {
        expect(increment()).toEqual({ type: ActionTypes.INCREMENT });
      });
    });

    describe('decrement', () => {
      it('should return an action', () => {
        expect(decrement()).toEqual({ type: ActionTypes.DECREMENT });
      });
    });

    describe('incrementTotalClicks', () => {
      it('should return an action', () => {
        expect(incrementTotalClicks()).toEqual({
          type: ActionTypes.INCREMENT_TOTAL_CLICKS,
        });
      });
    });
  });

  describe('reducer', () => {
    let initialState: ContainerState;

    beforeEach(() => {
      initialState = {
        count: 0,
        totalClicks: 0,
      };
    });

    it('should increment count', () => {
      expect(reducer(initialState, increment())).toEqual({
        count: 1,
        totalClicks: 0,
      });
    });

    it('should decrement count', () => {
      expect(reducer(initialState, decrement())).toEqual({
        count: -1,
        totalClicks: 0,
      });
    });

    it('should increment totalClicks', () => {
      expect(reducer(initialState, incrementTotalClicks())).toEqual({
        count: 0,
        totalClicks: 1,
      });
    });
  });

  describe('selectors', () => {
    const state: State = {
      [Constants.NAMESPACE]: {
        count: 0,
        totalClicks: 0,
      },
    };

    describe('makeSelectCount', () => {
      it('should select the count', () => {
        expect(makeSelectCount(state)).toEqual(0);
      });
    });

    describe('makeSelectTotalClicks', () => {
      it('should select the totalClicks', () => {
        expect(makeSelectTotalClicks(state)).toEqual(0);
      });
    });
  });

  describe('sagas', () => {
    describe('saga', () => {
      const gen = saga();

      it('should watch for INCREMENT or DECREMENT', () => {
        expect(gen.next().value).toEqual(
          take([ActionTypes.INCREMENT, ActionTypes.DECREMENT]),
        );
      });

      it('should dispatch incrementTotalClicks', () => {
        expect(gen.next().value).toEqual(put(incrementTotalClicks()));
      });

      it('should watch for the next INCREMENT or DECREMENT', () => {
        expect(gen.next().value).toEqual(
          take([ActionTypes.INCREMENT, ActionTypes.DECREMENT]),
        );
      });
    });
  });

  describe('components', () => {
    describe('<Counter />', () => {
      let store;

      beforeEach(() => {
        store = configureStore({}, history);
      });

      it('Expect to not log errors in console', () => {
        const spy = jest.spyOn(global.console, 'error');
        render(
          <Provider store={store}>
            <IntlProvider locale={DEFAULT_LOCALE}>
              <Counter title="Counter" />
            </IntlProvider>
          </Provider>,
        );
        expect(spy).not.toHaveBeenCalled();
      });

      /**
       * Unskip this test to use it
       *
       * @see {@link https://jestjs.io/docs/en/api#testskipname-fn}
       */
      it.skip('Should render and match the snapshot', () => {
        const {
          container: { firstChild },
        } = render(
          <Provider store={store}>
            <IntlProvider locale={DEFAULT_LOCALE}>
              <Counter title="Counter" />
            </IntlProvider>
          </Provider>,
        );
        expect(firstChild).toMatchSnapshot();
      });
    });
  });
});
