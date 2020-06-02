/*
 * LanguageSwitcher Messages
 *
 * This contains all the text for the LanguageSwitcher component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.LanguageSwitcher';

export default defineMessages({
  enUS: {
    id: `${scope}.enUS`,
    defaultMessage: '🇺🇸 US English (en-US)',
  },
  enGB: {
    id: `${scope}.enGB`,
    defaultMessage: '🇬🇧 UK English (en-GB)',
  },
});
