/**
 * Utils tests
 */

import { notMyAction } from '../utils';

describe('utils', () => {
  describe('notMyAction', () => {
    enum ExpectedTypes {
      FIRST = 'namespace/FIRST',
      SECOND = 'namespace/SECOND',
    }

    it('should return true if action is not in ExpectedTypes', () => {
      expect(notMyAction(ExpectedTypes, 'namespace/EXAMPLE')).toBe(true);
    });

    it('should return false if action type is in ExpectedTypes', async () => {
      expect(notMyAction(ExpectedTypes, 'namespace/FIRST')).toBe(false);
    });
  });
});
