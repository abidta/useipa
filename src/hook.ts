import { useContext } from 'react'
import { createClient } from '.'
import { ApiClientContext } from './Provider'

export const useApiClient = () => {
  const context = useContext(ApiClientContext)
  console.log(context)

  if (!context) {
    return createClient()
  }
  return createClient(context)
}
