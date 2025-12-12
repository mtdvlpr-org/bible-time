import { afterEach, describe, expect, it, vi } from 'vitest'

import { decodeToken } from '../../../shared/utils/auth'

describe('auth utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const payload = { name: 'Test User', sub: '123' }
      const encodedPayload = btoa(JSON.stringify(payload))
      const token = `header.${encodedPayload}.signature`

      const decoded = decodeToken(token)
      expect(decoded).toEqual(payload)
    })

    it('should return null for invalid token structure', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const token = 'invalid-token'
      const decoded = decodeToken(token)
      expect(decoded).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should return null for malformed payload', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const token = 'header.invalid-base64.signature'
      const decoded = decodeToken(token)
      expect(decoded).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })
})
