/*
 * Idioms Messages
 *
 * This contains all the text for the Idioms component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Idioms';

export default defineMessages({
  header: {
    id: `${scope}.idiom0`,
    // eslint-disable-next-line quotes
    defaultMessage: "Here's a beloved idiom from your locale:",
  },
  idiom0: {
    id: `${scope}.idiom0`,
    defaultMessage: '🇺🇸 Put up your dukes.',
  },
  idiom1: {
    id: `${scope}.idiom1`,
    defaultMessage: '🇺🇸 Give me a ballpark figure.',
  },
  idiom2: {
    id: `${scope}.idiom2`,
    // eslint-disable-next-line quotes
    defaultMessage: "🇺🇸 The cat's out of the bag.",
  },
});
