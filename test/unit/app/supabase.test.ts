import { beforeEach, describe, expect, it, vi } from 'vitest'

import { handleSupabaseError } from '../../../app/utils/supabase'

// Stub global createError
const createErrorMock = vi.fn((err) => err)
vi.stubGlobal('createError', createErrorMock)

describe('app supabase utils', () => {
  beforeEach(() => {
    createErrorMock.mockClear()
  })

  describe('handleSupabaseError', () => {
    it('should call createError with correct params', () => {
      const error = {
        code: 'ERROR_CODE',
        details: '',
        hint: '',
        message: 'Supabase error',
        name: 'ERROR_NAME'
      }

      try {
        handleSupabaseError(error, 500, 'Internal Server Error')
      } catch {
        // Expected to throw
      }

      expect(createErrorMock).toHaveBeenCalledWith({
        data: error,
        message: error.message,
        statusCode: 500,
        statusText: 'Internal Server Error'
      })
    })

    it('should throw the result of createError', () => {
      const error = {
        code: 'ERROR_CODE',
        details: '',
        hint: '',
        message: 'Supabase error',
        name: 'ERROR_NAME'
      }
      expect(() => handleSupabaseError(error, 400, 'Bad Request')).toThrow()
    })
  })
})
