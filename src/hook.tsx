import { CreateAxiosDefaults } from 'axios'
import React, { ReactNode, createContext } from 'react'

type ApiClientProps = {
  children: React.JSX.Element | string | ReactNode
  client: CreateAxiosDefaults
}
export const ApiClientContext = createContext<CreateAxiosDefaults>({})

export const ApiClientProvider: React.FC<ApiClientProps> = ({ children, client }) => {
  return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>
}
