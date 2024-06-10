import axios from 'axios'
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
  if (!req?.signal) {
    return { ...req, signal: abortSignal(req?.signalTtl) }
  }
  return { ...req }
}

export const instance = axios
