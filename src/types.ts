/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosRequestConfig, Method } from 'axios'

export type UseForm = () => UseFormResponse

export type UseFormResponse = {
  submitForm: SubmitForm
} & Omit<UseApiResponse, 'submitApi' | 'mutate' | 'fetchData'>

/**
 * Use api types
 */
export type UseApiResponse = {
  fetching: boolean
  data: any
  error?: Error | null
  success: boolean
  fetchData: FetchData
  mutate: Mutate
  submitApi: UseApiSubmit
}

export type FetchData = (endpoint: string, identifier?: number | string) => void

export type Mutate = UseApiSubmit

type SubmitForm = (endpoint: string, inputData: object) => void

export type UseApiSubmit<D = any> = (
  endpoint: string,
  body?: D,
  method?: Method,
  params?: any,
  headers?: AxiosRequestConfig['headers']
) => void

export type UseApi = () => UseApiResponse
