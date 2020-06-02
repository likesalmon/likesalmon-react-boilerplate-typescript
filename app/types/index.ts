import { Reducer, Store } from 'redux';
import { RouterState } from 'connected-react-router';
import { Saga } from 'redux-saga';
import { SagaInjectionModes } from 'redux-injectors';

import { ContainerState as LanguageProviderState } from 'containers/LanguageProvider/types';
import {
  Constants as GetGiphyCatsServiceConstants,
  ContainerState as GetGiphyCatsServiceState,
} from 'services/GetGiphyCats';
import {
  Constants as CounterConstants,
  ContainerState as CounterState,
} from 'containers/Counter';
import { ContainerState as ExampleState } from 'containers/Example/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

export interface InjectedStore extends Store {
  injectedReducers: any;
  injectedSagas: any;
  runSaga(saga: Saga<any[]> | undefined, args: any | undefined): any;
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState;
  reducer: Reducer<any, any>;
}

export interface InjectSagaParams {
  key: keyof ApplicationRootState;
  saga: Saga;
  mode?: SagaInjectionModes;
}

/**
 * ############################################################################
 *
 * ApplicationRootState
 *
 * Used by the root reducer, this defines your application state. All
 * Containers and services that interact with the state must be added
 * to this interface.
 *
 * ############################################################################
 */
export interface ApplicationRootState {
  readonly router: RouterState;
  readonly language: LanguageProviderState;
  readonly [GetGiphyCatsServiceConstants.NAMESPACE]: GetGiphyCatsServiceState;
  readonly [CounterConstants.NAMESPACE]: CounterState;
  readonly example: ExampleState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly

  // for testing purposes
  readonly test: any;
}

export interface Action {
  type: string;
  [key: string]: any;
}
