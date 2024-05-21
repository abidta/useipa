import { useState } from 'react'
import { AxiosResponse } from 'axios'
import { FetchData, Mutate, UseApi, UseApiSubmit, UseForm, UseFormResponse } from './types'
import axios, { AxiosInstance } from 'axios'
import { abortSignal } from './helper'

export const api: AxiosInstance = axios.create()
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log('error', error)
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

  const fetchData: FetchData = (endpoint) => {
    submitApi(endpoint)
  }
  const mutate: Mutate = (endpoint, body, method = 'POST') => {
    submitApi(endpoint, body, method)
  }
  /**
   *
   * @param endpoint
   * @param body
   * @param method
   * @param params
   * @param headers
   */
  const submitApi: UseApiSubmit = async (endpoint, body, method = 'GET', params, headers) => {
    try {
      setError(null)
      setFetching(true)
      const { data: response } = await api({
        method: method,
        url: endpoint,
        params: params,
        data: body,
        headers: headers,
        withCredentials: true,
        signal: abortSignal(1000),
      })

      if (response) {
        setSuccess(true)
        setData(response)
      }
    } catch (error) {
      console.log('Error =>  ', error)

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
   * @param inputata
   */
  const submitForm = async (endpoint: string, inputata: object) => {
    submitApi(endpoint, inputata, 'POST')
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
export const asyncApi = async (endpoint: string, method = 'GET') => {
  const { data } = await api({ method: method, url: endpoint, withCredentials: true })
  return data
}

export default useApi
