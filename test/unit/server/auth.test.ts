/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authService } from '../../../server/utils/auth'

// Mock #supabase/server
const serverSupabaseClientMock = vi.fn()
const serverSupabaseUserMock = vi.fn()

vi.mock('#supabase/server', () => ({
  serverSupabaseClient: (...args: any[]) => serverSupabaseClientMock(...args),
  serverSupabaseUser: (...args: any[]) => serverSupabaseUserMock(...args)
}))

// Stub createError
const createErrorMock = vi.fn((err) => new Error(JSON.stringify(err)))
vi.stubGlobal('createError', createErrorMock)

describe('server auth utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUser', () => {
    it('should return user if exists', async () => {
      const mockUser = { email: 'test@example.com', id: '123' }
      serverSupabaseUserMock.mockResolvedValue(mockUser)

      const event = {} as any
      const user = await authService.getUser(event)

      expect(user).toEqual(mockUser)
      expect(serverSupabaseUserMock).toHaveBeenCalledWith(event)
    })

    it('should throw 401 if no user', async () => {
      serverSupabaseUserMock.mockResolvedValue(null)

      const event = {} as any
      await expect(authService.getUser(event)).rejects.toThrow()

      expect(createErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          statusMessage: 'Unauthorized'
        })
      )
    })
  })

  describe('can', () => {
    it('should resolve if permission is granted', async () => {
      const rpcMock = vi.fn().mockResolvedValue({ data: true, error: null })
      serverSupabaseClientMock.mockResolvedValue({ rpc: rpcMock })

      const event = {} as any
      await authService.can(event, 'some_permission' as any)

      expect(rpcMock).toHaveBeenCalledWith('authorize', { requested_permission: 'some_permission' })
    })

    it('should throw error if rpc returns error', async () => {
      const rpcMock = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'RPC Error' },
        status: 500,
        statusText: 'Error'
      })
      serverSupabaseClientMock.mockResolvedValue({ rpc: rpcMock })

      const event = {} as any
      await expect(authService.can(event, 'perm' as any)).rejects.toThrow()

      expect(createErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'RPC Error',
          statusCode: 500,
          statusMessage: 'Error'
        })
      )
    })

    it('should throw 403 if data is falsy', async () => {
      const rpcMock = vi.fn().mockResolvedValue({ data: false, error: null })
      serverSupabaseClientMock.mockResolvedValue({ rpc: rpcMock })

      const event = {} as any
      await expect(authService.can(event, 'perm' as any)).rejects.toThrow()

      expect(createErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          statusMessage: 'Forbidden'
        })
      )
    })
  })
})
