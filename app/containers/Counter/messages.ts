/*
 * Example Messages
 *
 * This contains all the text for the Example container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Counter';

export default defineMessages({
  description: {
    id: `${scope}.description`,
    defaultMessage: 'This is the Counter container!',
  },
  instructions: {
    id: `${scope}.instructions`,
    defaultMessage: 'Click the buttons to change the count.',
  },
  totalClicks: {
    id: `${scope}.totalClicks`,
    defaultMessage: 'Total clicks',
  },
});
