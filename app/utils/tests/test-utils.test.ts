/**
 * Test Utils Tests
 */

import { AxiosError } from 'axios';
import { MockAxiosError } from 'utils/test-utils';

describe('test-utils', () => {
  describe('MockAxiosError', () => {
    it('should return an AxiosError', () => {
      const message = 'some error';
      const error: AxiosError = new MockAxiosError(message);
      expect(error.message).toBe(message);
    });
  });
});
