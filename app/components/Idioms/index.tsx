/**
 *
 * Idioms
 *
 */
import React from 'react';

// import styled from 'styles/styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

interface Props {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Idioms(props: Props) {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

export default Idioms;
