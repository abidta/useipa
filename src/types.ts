/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosRequestConfig, CreateAxiosDefaults, Method } from 'axios'

export type UseForm = (instance?: CreateAxiosDefaults) => UseFormResponse

export type UseFormResponse = {
  submitForm: SubmitForm
} & Omit<UseApiResponse, 'submitApi' | 'mutate' | 'fetchData'>

type TError = Error & { status?: number; statusText?: string }
/**
 * Use api types
 */
export type UseApiResponse<D = any> = {
  fetching: boolean
  data: D | null
  error?: TError | null
  success: boolean
  clearState: () => void
  fetchData: FetchData
  mutate: Mutate
  submitApi: UseApiSubmit
}

export type FetchData = (endpoint: string, config?: RequestConfig) => void

export type Mutate = (endpoint: string, data?: any, config?: RequestConfig) => void

type SubmitForm = (endpoint: string, inputData: object) => void

export type RequestConfig = {
  signalTtl?: number
  identifier?: string
} & AxiosRequestConfig

export type UseApiSubmit = {
  (config: RequestConfig): void
  (endpoint: string, config: RequestConfig): void
}

export type AsyncApi = (endpoint: string, method?: Method, config?: RequestConfig) => Promise<any>
export type UseApi = <D = any>(instance?: CreateAxiosDefaults) => UseApiResponse<D>
