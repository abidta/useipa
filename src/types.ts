/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosRequestConfig } from 'axios'

export type UseForm = () => UseFormResponse

export type UseFormResponse = {
  submitForm: SubmitForm
} & Omit<UseApiResponse, 'submitApi' | 'mutate' | 'fetchData'>

/**
 * Use api types
 */
export type UseApiResponse<D = any> = {
  fetching: boolean
  data: D
  error?: Error | null
  success: boolean
  fetchData: FetchData
  mutate: Mutate
  submitApi: UseApiSubmit
}

export type FetchData = (endpoint: string, config?: RequestConfig) => void

export type Mutate = (endpoint: string, data?: any, config?: RequestConfig) => void

type SubmitForm = (endpoint: string, inputData: object) => void

export type RequestConfig = {
  identifier?: string
} & AxiosRequestConfig

export type UseApiSubmit = {
  (config: RequestConfig): void
  (endpoint: string, config: RequestConfig): void
}

export type UseApi = () => UseApiResponse
