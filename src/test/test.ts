import { renderHook, act, waitFor } from '@testing-library/react'
import { useApi } from '..'
import { api } from '..'
import MockAdapter from 'axios-mock-adapter'
import '@testing-library/jest-dom'

let mock: MockAdapter
const mockResponse = {
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false,
}
const postResponse = { data: { message: 'User crteated' } }
describe('UseApi', () => {
  beforeEach(() => {
    mock = new MockAdapter(api)
  })
  afterEach(() => {
    mock.reset()
  })

  test('should return the initial values for data, error and loading', async () => {
    const { result } = renderHook(() => useApi())
    const { data, fetching, error, success } = result.current
    expect(data).toBe(null)
    expect(fetching).toBe(false)
    expect(error).toBe(null)
    expect(success).toBe(false)
  })

  test('should handle successful API call, fetchData', async () => {
    mock.onGet('/get').reply(200, mockResponse)

    const { result } = renderHook(() => useApi())
    act(() => result.current.fetchData('/get'))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      expect(result.current.success).toBe(true)
      expect(result.current.data).toEqual(mockResponse)
      expect(result.current.error).toBe(null)
    })
  })

  test('should handle successful API call, Mutate', async () => {
    const body = { user: { name: 'abid' } }

    mock.onPost('/post', body).reply(200, postResponse)

    const { result } = renderHook(() => useApi())
    act(() => result.current.mutate('/post', body))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      expect(result.current.success).toBe(true)
      expect(result.current.data).toEqual(postResponse)
      expect(result.current.error).toBe(null)
    })
  })

  test('should handle errors', async () => {
    mock.onAny('/long').networkError()
    const { result } = renderHook(() => useApi())

    act(() => result.current.mutate('/long'))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      expect(result.current.success).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeTruthy()
    })
  })
})
