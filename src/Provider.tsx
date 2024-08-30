import { CreateAxiosDefaults } from 'axios'
import React, { ReactNode, createContext } from 'react'

type ApiClientProps = {
  children: React.JSX.Element | string | ReactNode
  client: CreateAxiosDefaults
  events?: BaseEvents
}
export type BaseEvents = {
  onError?: (err?: object) => void
  onSuccess?: () => void
}
export const ApiClientContext = createContext<CreateAxiosDefaults & { methods?: BaseEvents }>({})

export const ApiClientProvider: React.FC<ApiClientProps> = ({ children, client, events }) => {
  return (
    <ApiClientContext.Provider value={{ ...client, methods: { ...events } }}>
      {children}
    </ApiClientContext.Provider>
  )
}
