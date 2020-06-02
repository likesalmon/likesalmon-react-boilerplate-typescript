/**
 *
 * LanguageSwitcher
 *
 */
import React from 'react';

import styled from 'styles/styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

type LanguageCode = 'en-US' | 'en-GB';
interface Props {
  handler: (string: LanguageCode) => any;
  locale: string;
}

const List = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: row;
  li {
    padding-left: 10px;
  }
  li:last-child {
    color: white;
  }
`;
const Item = styled.button``;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LanguageSwitcher(props: Props) {
  const { handler, locale } = props;

  return (
    <List>
      <li>
        <Item onClick={() => handler('en-US')}>
          <FormattedMessage {...messages.enUS} />
        </Item>
      </li>
      <li>
        <Item onClick={() => handler('en-GB')}>
          <FormattedMessage {...messages.enGB} />
        </Item>
      </li>
      <li>Current Locale: {locale}</li>
    </List>
  );
}

export default LanguageSwitcher;
