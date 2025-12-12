import { beforeEach, describe, expect, it, vi } from 'vitest'

import { supabaseService } from '../../../server/utils/supabase'

const createErrorMock = vi.fn((err) => new Error(JSON.stringify(err)))
vi.stubGlobal('createError', createErrorMock)

describe('server supabase utils', () => {
  beforeEach(() => {
    createErrorMock.mockClear()
  })

  describe('handleError', () => {
    it('should throw created error', () => {
      const error = {
        code: 'ERROR_CODE',
        details: '',
        hint: '',
        message: 'DB Error',
        name: 'ERROR_NAME'
      }

      expect(() => supabaseService.handleError(error, 500, 'Server Error')).toThrow()

      expect(createErrorMock).toHaveBeenCalledWith({
        message: 'DB Error',
        statusCode: 500,
        statusText: 'Server Error'
      })
    })
  })
})
