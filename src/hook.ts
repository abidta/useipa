import { useContext } from 'react'
import { createClient } from '.'
import { ApiClientContext } from './Provider'

export const useApiClient = () => {
  const context = useContext(ApiClientContext)
  if (!context) {
    return createClient()
  }
  return createClient(context)
}
