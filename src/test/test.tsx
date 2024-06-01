import { renderHook, act, waitFor } from '@testing-library/react'
import { ApiClientProvider, api, asyncApi, useApi, useFormApi } from '../'
import MockAdapter from 'axios-mock-adapter'
import '@testing-library/jest-dom'
import { useApiClient } from '../hook'
import axios from 'axios'
import { UseApiResponse, UseFormResponse } from '../types'

// ckeckSuccess function params type
type ResponseType = typeof postResponse | typeof deleteResponse | typeof fetchResponse
type Result = {
  current: UseApiResponse<ResponseType> | UseFormResponse
}

jest.mock('../hook')

let mock: MockAdapter
const fetchResponse = {
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false,
}

const postResponse = { data: { message: 'User created' } }
const deleteResponse = { data: { message: 'User deleted' } }
const formdata = new FormData()
formdata.append('foo', 'bar')
formdata.append('ping', 'pong')

describe('UseApi with custom instance', () => {
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
    mock.onGet('/get').reply(200, fetchResponse)

    const { result } = renderHook(() => useApi(api.defaults))
    act(() => result.current.fetchData('/get'))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      checkSuccess(result, fetchResponse)
    })
  })

  test('should handle successful API call, Mutate without config', async () => {
    const body = { user: { name: 'abid' } }

    mock.onPost('/post', body).reply(200, postResponse)

    const { result } = renderHook(() => useApi(api.defaults))
    act(() => result.current.mutate('/post', body))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      checkSuccess(result)
    })
  })

  test('should handle successful API call, Mutate without body, Delete Method', async () => {
    mock.onDelete('/post?id=1', {}).reply(200, deleteResponse)
    const { result } = renderHook(() => useApi(api.defaults))
    act(() => result.current.mutate('/post?id=1', {}, { method: 'DELETE' }))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      checkSuccess(result, deleteResponse)
    })
  })

  test('should handle errors', async () => {
    mock.onAny('/long').networkError()
    const { result } = renderHook(() => useApi(api.defaults))

    act(() => result.current.mutate('/long'))
    expect(result.current.fetching).toBe(true)

    await waitFor(() => {
      expect(result.current.success).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeTruthy()
    })
  })
})

describe('ApiClientProvider wrapper', () => {
  test('should handle successful Api call with ApiClientProvider wrapper', async () => {
    const mockedClient = useApiClient as jest.MockedFunction<typeof useApiClient>
    mockedClient.mockReturnValue(api)
    mock.onPost('/provider', formdata).reply(200, postResponse)
    const { result } = renderHook(() => useApi(), {
      wrapper: ({ children }) => (
        <ApiClientProvider client={api.defaults}>{children}</ApiClientProvider>
      ),
    })
    act(() => {
      result.current.mutate('/provider', formdata)
    })
    expect(result.current.fetching).toBe(true)
    await waitFor(() => {
      checkSuccess(result)
    })
  })
})

describe('Without Provider and instance config, raw call', () => {
  test('should handle successful Api call without Provide and instance config', async () => {
    mock.onPost('/raw', formdata).reply(200, postResponse)
    const { result } = renderHook(() => useApi())
    act(() => {
      result.current.mutate('/raw', formdata)
    })
    expect(result.current.fetching).toBe(true)
    await waitFor(() => {
      checkSuccess(result)
    })
  })
})

describe('UseFormApi hook', () => {
  test('should handle successful Api call with submit form ', async () => {
    mock.onPost('/submit', formdata).reply(200, postResponse)
    const { result } = renderHook(() => useFormApi(api.defaults))

    act(() => {
      result.current.submitForm('/submit', formdata)
    })
    expect(result.current.fetching).toBe(true)
    await waitFor(() => {
      checkSuccess(result)
    })
  })
})

describe('asyncApi check', () => {
  test('should success asyncApi', async () => {
    mock.onPost('/promise').reply(200, postResponse)
    const data = await asyncApi('/promise', 'POST', { data: postResponse })
    expect(data).toEqual(postResponse)
  })
})

describe('Without Provider and with instance config,', () => {
  test('should handle successful Api call without Provide and with instance config', async () => {
    mock = new MockAdapter(axios)
    mock.onPost('/raw', formdata).reply(200, postResponse)
    const { result } = renderHook(() =>
      useApi({
        baseURL: 'api.com',
        headers: { test: 'test', 'Content-Type': 'multiprt/formdata' },
      })
    )
    act(() => {
      result.current.mutate('/raw', formdata)
    })
    expect(result.current.fetching).toBe(true)
    await waitFor(() => {
      checkSuccess(result)
    })
  })
})

function checkSuccess(result: Result, response: ResponseType = postResponse) {
  expect(result.current.success).toBe(true)
  expect(result.current.data).toEqual(response)
  expect(result.current.error).toBe(null)
}
