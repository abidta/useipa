import { useState } from 'react'
import {
  AsyncApi,
  FetchData,
  Mutate,
  RequestConfig,
  UseApi,
  UseApiResponse,
  UseApiSubmit,
  UseForm,
  UseFormResponse,
} from './types'
import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from 'axios'
import { createConfig, defaultConfig } from './utils'
import { ApiClientProvider } from './Provider'
import { useApiClient } from './hook'

export const createClient = (config?: CreateAxiosDefaults) => {
  const api: AxiosInstance = axios.create(config || {})
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log('error', error.message)
      const errObj = error?.response

      return Promise.reject(errObj ?? error)
    }
  )
  return api
}
export const api = createClient()

// This for only for hooks not asyncApi

// The core hook
export const useApi: UseApi = (instanceConfig): UseApiResponse => {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const hook = useApiClient()
  const apiClient = instanceConfig ? createClient(instanceConfig) : hook

  let requestConfig: RequestConfig = {}
  const fetchData: FetchData = (endpoint, config) => {
    submitApi(endpoint, createConfig(config || {}))
  }
  const mutate: Mutate = (endpoint, data, config) => {
    submitApi(endpoint, createConfig({ ...config, data }, 'mutate'))
  }

  const clearState = () => {
    setSuccess(false)
    setError(null)
  }
  /**
   *
   * @param {(string|object)} endpointOrConfig
   * @param {RequestConfig} [config]
   */
  const submitApi: UseApiSubmit = async (
    endpointOrConfig: string | RequestConfig,
    config?: RequestConfig
  ) => {
    try {
      setError(null)
      setFetching(true)
      if (typeof endpointOrConfig === 'string' && typeof config === 'object') {
        requestConfig = createConfig({ ...config, url: endpointOrConfig })
      }
      if (typeof endpointOrConfig === 'string' && !config) {
        requestConfig = defaultConfig({ url: endpointOrConfig })
      }
      if (typeof endpointOrConfig === 'object') {
        requestConfig = endpointOrConfig
      }

      const { data: response } = await apiClient({ ...requestConfig })
      if (response) {
        setSuccess(true)
        setData(response)
      }
    } catch (error) {
      const err = error as AxiosResponse
      setError(err.data ?? err)
    } finally {
      setFetching(false)
    }
  }
  return {
    data,
    error,
    fetching,
    success,
    clearState,
    fetchData,
    mutate,
    submitApi,
  }
}

// Form hook. this extends useApi states and omit fetchData and mutate methods.
export const useFormApi: UseForm = (instance): UseFormResponse => {
  const { data, fetching, error, success, submitApi, clearState } = useApi(instance)

  /**
   *
   * @param {string} endpoint
   * @param {object} formData
   * @param {RequestConfig} [config]
   */
  const submitForm = async (endpoint: string, formData: object, config?: RequestConfig) => {
    submitApi(endpoint, createConfig({ ...config, data: formData }, 'mutate'))
  }
  return {
    data,
    error,
    fetching,
    success,
    clearState,
    submitForm,
  }
}

/**
 * This for directly call apis without hooks and states.
 *
 * @param {string} endpoint
 * @param {string} [method=GET]
 * @param {RequestConfig} [config]
 * @returns {Promise<T>}
 */
export const asyncApi: AsyncApi = async <T>(
  endpoint: string,
  method = 'GET',
  config?: RequestConfig
) => {
  const apiClient = api

  const { data } = await apiClient<T>({ ...config, url: endpoint, method })
  return data
}

export { ApiClientProvider }
export type { CreateAxiosDefaults }
