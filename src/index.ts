import { useState } from 'react'
import { AxiosResponse } from 'axios'
import {
  FetchData,
  Mutate,
  RequestConfig,
  UseApi,
  UseApiSubmit,
  UseForm,
  UseFormResponse,
} from './types'
import axios, { AxiosInstance } from 'axios'
import { createConfig, defaultConfig } from './utils'

export const api: AxiosInstance = axios.create()
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
/**
 *
 * @returns
 */
export const useApi: UseApi = () => {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  let requestConfig: RequestConfig = {}
  const fetchData: FetchData = (endpoint, config) => {
    submitApi(endpoint, createConfig(config || {}))
  }
  const mutate: Mutate = (endpoint, data, config) => {
    submitApi(endpoint, createConfig({ ...config, data }, 'mutate'))
  }

  /**
   *
   * @param endpoint
   * @param body
   * @param method
   * @param params
   * @param headers
   */
  const submitApi: UseApiSubmit = async (
    endpointOrConfig: string | RequestConfig,
    config?: RequestConfig
  ) => {
    try {
      setError(null)
      setFetching(true)
      if (typeof endpointOrConfig === 'string' && typeof config === 'object') {
        requestConfig = { ...config, url: endpointOrConfig }
      }
      if (typeof endpointOrConfig === 'string' && !config) {
        requestConfig = defaultConfig({ url: endpointOrConfig })
      }
      if (typeof endpointOrConfig === 'object') {
        requestConfig = endpointOrConfig
      }

      const { data: response } = await api({ ...requestConfig })
      if (response) {
        setSuccess(true)
        setData(response)
      }
    } catch (error) {
      // console.log('Error =>  ', error.message)

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
    fetchData,
    mutate,
    submitApi,
  }
}
/**
 *
 * @param endpoint
 * @returns
 */
export const useFormApi: UseForm = (): UseFormResponse => {
  const { data, fetching, error, success, submitApi } = useApi()

  /**
   *
   * @param endpoint
   * @param inputData
   */
  const submitForm = async (endpoint: string, inputData: object, config?: RequestConfig) => {
    submitApi(endpoint, createConfig({ ...config, data: inputData }, 'mutate'))
  }
  return {
    data,
    error,
    fetching,
    success,
    submitForm,
  }
}

/**
 *
 * @param endpoint
 * @param method
 * @returns Promise
 */
export const asyncApi = async (endpoint: string, method = 'GET', config: RequestConfig) => {
  const { data } = await api({ ...config, url: endpoint, method })
  return data
}

export default useApi
