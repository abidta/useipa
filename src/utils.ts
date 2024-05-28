import { abortSignal } from './helper'
import { RequestConfig } from './types'

type ApiType = 'mutate'
export const createConfig = (req: RequestConfig, apiType?: ApiType) => {
  if (!req?.method && apiType === 'mutate') {
    req.method = 'POST'
  }
  return defaultConfig(req)
}
export const defaultConfig = (req?: RequestConfig): RequestConfig => {
  return { ...req, withCredentials: true, signal: abortSignal(3000) }
}
