/**
 * GetGiphyCats service tests
 */
import React from 'react';
import { render } from '@testing-library/react';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { take, call, put } from 'redux-saga/effects';
import { Provider } from 'react-redux';
import history from 'utils/history';
import { MockAxiosError } from 'utils/test-utils';
import configureStore from '../../../configureStore';
import GetGiphyCats, {
  axiosConfig,
  makeRequest,
  Constants,
  ActionTypes,
  notAsked,
  loading,
  success,
  failure,
  ContainerState,
  reducer,
  watchFlow,
  requestFlow,
  State,
  makeSelectStatus,
  makeSelectHasNotBeenAsked,
  makeSelectIsLoading,
  makeSelectWasSuccessful,
  makeSelectHasFailed,
  makeSelectResponseData,
  makeSelectError,
  makeSelectErrorMessage,
} from '../index';

describe('GetGiphyCats', () => {
  /**
   * ############################################################################
   *
   * Actions
   *
   * ############################################################################
   */
  describe('actions', () => {
    describe('makeRequest', () => {
      it('should return an action with default configOverrides', () => {
        expect(makeRequest()).toEqual({
          type: Constants.MAKE_REQUEST,
          configOverrides: {},
        });
      });

      it('should return an action with configOverrides', () => {
        const configOverrides: AxiosRequestConfig = {
          params: { foo: 'bar' },
        };
        expect(makeRequest(configOverrides)).toEqual({
          type: Constants.MAKE_REQUEST,
          configOverrides,
        });
      });
    });

    describe('notAsked', () => {
      it('should return an action', () => {
        expect(notAsked()).toEqual({ type: ActionTypes.NOT_ASKED });
      });
    });

    describe('loading', () => {
      it('should return an action', () => {
        expect(loading()).toEqual({ type: ActionTypes.LOADING });
      });
    });

    describe('success', () => {
      it('should return an action', () => {
        const responseData = {};
        expect(success(responseData)).toEqual({
          type: ActionTypes.SUCCESS,
          responseData,
        });
      });
    });

    describe('failure', () => {
      it('should return an action', () => {
        const error = new Error('Some error');
        expect(failure(error)).toEqual({ type: ActionTypes.FAILURE, error });
      });
    });
  });

  /**
   * ############################################################################
   *
   * Reducer
   *
   * ############################################################################
   */
  describe('reducer', () => {
    let containerState: ContainerState;
    beforeEach(async () => {
      containerState = {
        status: ActionTypes.NOT_ASKED,
      };
    });

    it('should set status to NOT_ASKED', () => {
      const expected: ContainerState = {
        status: ActionTypes.NOT_ASKED,
      };
      expect(reducer(containerState, { type: ActionTypes.NOT_ASKED })).toEqual(
        expected,
      );
    });

    it('should set status to LOADING', () => {
      const expected: ContainerState = {
        status: ActionTypes.LOADING,
      };
      expect(reducer(containerState, { type: ActionTypes.LOADING })).toEqual(
        expected,
      );
    });

    it('should set response and status to SUCCESS', () => {
      const responseData = {};
      const expected: ContainerState = {
        status: ActionTypes.SUCCESS,
        responseData,
      };
      expect(
        reducer(containerState, { type: ActionTypes.SUCCESS, responseData }),
      ).toEqual(expected);
    });

    it('should set error status to FAILURE', () => {
      const error: AxiosError = {
        name: 'error',
        message: 'Some error',
        config: {},
        isAxiosError: true,
        toJSON: jest.fn(),
      };

      const expected: ContainerState = {
        status: ActionTypes.FAILURE,
        error,
      };
      expect(
        reducer(containerState, { type: ActionTypes.FAILURE, error }),
      ).toEqual(expected);
    });
  });

  /**
   * ############################################################################
   *
   * Sagas
   *
   * ############################################################################
   */
  describe('sagas', () => {
    describe('watchFlow', () => {
      const gen = watchFlow();

      it('should dispatch the notAsked action', () => {
        expect(gen.next().value).toEqual(put(notAsked()));
      });

      it('should watch for the MAKE_REQUEST action type', () => {
        expect(gen.next().value).toEqual(take(Constants.MAKE_REQUEST));
      });

      it('should call requestFlow with config', () => {
        const makeRequestAction = {
          type: Constants.MAKE_REQUEST,
          configOverrides: {
            params: {
              foo: 'bar',
            },
          },
        };
        expect(gen.next(makeRequestAction).value).toEqual(
          call(requestFlow, {
            ...axiosConfig,
            ...makeRequestAction.configOverrides,
          }),
        );
      });

      it('should watch for the next MAKE_REQUEST action', () => {
        expect(gen.next().value).toEqual(take(Constants.MAKE_REQUEST));
      });
    });

    describe('requestFlow', () => {
      describe('success', () => {
        const gen = requestFlow(axiosConfig);
        let response: AxiosResponse;
        beforeEach(async () => {
          response = {
            status: 200,
            statusText: 'Ok',
            headers: {},
            config: {},
            data: {},
          };
        });

        it('should dispatch the loading action', () => {
          expect(gen.next().value).toEqual(put(loading()));
        });

        it('should make a request', () => {
          expect(gen.next().value).toEqual(call(axios.request, axiosConfig));
        });

        it('should dispatch success action', () => {
          expect(gen.next({ data: {} }).value).toEqual(
            put(success(response.data)),
          );
        });

        it('should be done', () => {
          expect(gen.next().done).toBe(true);
        });
      });

      describe('failure', () => {
        const gen = requestFlow(axiosConfig);
        const error: AxiosError = new MockAxiosError('some error');

        it('should dispatch the loading action', () => {
          expect(gen.next().value).toEqual(put(loading()));
        });

        it('should make a request', () => {
          expect(gen.next().value).toEqual(call(axios.request, axiosConfig));
        });

        it('should dispatch failure action', () => {
          // See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
          expect(gen.throw!(error).value).toEqual(put(failure(error.toJSON())));
        });

        it('should be done', () => {
          expect(gen.next().done).toBe(true);
        });
      });
    });
  });

  /**
   * ############################################################################
   *
   * Selectors
   *
   * ############################################################################
   */
  describe('selectors', () => {
    describe('makeSelectStatus', () => {
      it('should get the status', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectStatus(state)).toEqual(ActionTypes.NOT_ASKED);
      });
    });

    describe('makeSelectHasNotBeenAsked', () => {
      it('should return true', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectHasNotBeenAsked(state)).toBe(true);
      });

      it('should return false', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.SUCCESS,
          },
        };
        expect(makeSelectHasNotBeenAsked(state)).toBe(false);
      });
    });

    describe('makeSelectIsLoading', () => {
      it('should return true', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.LOADING,
          },
        };
        expect(makeSelectIsLoading(state)).toBe(true);
      });

      it('should return false', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.SUCCESS,
          },
        };
        expect(makeSelectIsLoading(state)).toBe(false);
      });
    });

    describe('makeSelectWasSuccessful', () => {
      it('should return true', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.SUCCESS,
          },
        };
        expect(makeSelectWasSuccessful(state)).toBe(true);
      });

      it('should return false', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectWasSuccessful(state)).toBe(false);
      });
    });

    describe('makeSelectHasFailed', () => {
      it('should return true', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.FAILURE,
          },
        };
        expect(makeSelectHasFailed(state)).toBe(true);
      });

      it('should return false', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectHasFailed(state)).toBe(false);
      });
    });

    describe('makeSelectResponseData', () => {
      it('should return response data', () => {
        const responseData = { foo: 'bar' };
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.FAILURE,
            responseData,
          },
        };
        expect(makeSelectResponseData(state)).toBe(responseData);
      });

      it('should return an empty object', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectResponseData(state)).toEqual({});
      });
    });

    describe('makeSelectError', () => {
      it('should return the error', () => {
        const error: AxiosError = {
          name: 'Error',
          message: 'some error',
          isAxiosError: true,
          config: {},
          toJSON: jest.fn(),
        };
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.FAILURE,
            error,
          },
        };
        expect(makeSelectError(state)).toBe(error);
      });

      it('should return null', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectError(state)).toBe(null);
      });
    });

    describe('makeSelectErrorMessage', () => {
      const error: AxiosError = {
        name: 'Error',
        message: 'some error',
        isAxiosError: true,
        config: {},
        toJSON: jest.fn(),
      };
      it('should return true', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.FAILURE,
            error,
          },
        };
        expect(makeSelectErrorMessage(state)).toBe(error.message);
      });

      it('should return an empty string', () => {
        const state: State = {
          [Constants.NAMESPACE]: {
            status: ActionTypes.NOT_ASKED,
          },
        };
        expect(makeSelectErrorMessage(state)).toBe('');
      });
    });
  });

  /**
   * ############################################################################
   *
   * Component
   *
   * ############################################################################
   */
  describe('component', () => {
    let store;

    beforeEach(() => {
      store = configureStore({}, history);
    });

    it('Expect to not log errors in console', () => {
      const spy = jest.spyOn(global.console, 'error');
      render(
        <Provider store={store}>
          <GetGiphyCats />
        </Provider>,
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
