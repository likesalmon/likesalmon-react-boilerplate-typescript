/*
 *
 * RandomCats
 *
 */

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

export default function RandomCats() {
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
