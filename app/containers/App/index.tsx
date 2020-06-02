/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { path } from 'ramda';
import { ThemeProvider } from 'styled-components';
import styled, { theme } from 'styles/styled-components';
import { createStructuredSelector } from 'reselect';

// [IMPORT NEW SERVICE COMPONENT ABOVE] < Needed for generating services

import LanguageSwitcher from 'components/LanguageSwitcher';
import { changeLocale } from '../LanguageProvider/actions';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import GetGiphyCats from 'services/GetGiphyCats';
import HomePage from 'containers/HomePage';
import RandomCats from 'containers/RandomCats';
import Counter from 'containers/Counter';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PageLink from 'components/PageLink';

import GlobalStyle from '../../global-styles';

/**
 * ############################################################################
 *
 * Constants
 *
 * ############################################################################
 */
export enum Constants {
  NAMESPACE = 'containers/App',
}

/**
 * ############################################################################
 *
 * Selectors
 *
 * ############################################################################
 */
const stateSelector = createStructuredSelector({
  locale: makeSelectLocale(),
});

/**
 * ############################################################################
 *
 * Components
 *
 * ############################################################################
 */
const NavBar = styled.div`
  background-color: ${path(['theme', 'default', 'black'])};
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Container = styled.div`
  margin: 20px 20px;
`;

function App() {
  const { locale } = useSelector(stateSelector);
  const dispatch = useDispatch();

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div>
          <NavBar>
            <PageLink to="/random-cats">Random Cats</PageLink>
            <PageLink to="counter">Counter</PageLink>
            <LanguageSwitcher
              handler={code => dispatch(changeLocale(code))}
              locale={locale}
            />
          </NavBar>
          <Container>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/random-cats" component={RandomCats} />
              <Route exact path="/counter">
                <Counter title="Counter" />
              </Route>
              <Route component={NotFoundPage} />
            </Switch>
          </Container>
        </div>
      </ThemeProvider>
      <GlobalStyle />
      <GetGiphyCats />
      {/* [INSERT NEW SERVICE COMPONENT ABOVE] < Needed for generating services */}
    </div>
  );
}
export default hot(App);
