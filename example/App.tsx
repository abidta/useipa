import { ApiClientProvider, CreateAxiosDefaults } from '../src'
import TestComponent from './Test'

function App() {
  const client: CreateAxiosDefaults = {
    baseURL: 'https://jsonplaceholder.typicode.com',
    withCredentials: true,
  }
  return (
    <>
      <ApiClientProvider
        events={{
          onError(err) {
            alert('error'+ JSON.stringify(err))
          },
          onSuccess() {
            console.log('success')
          },
        }}
        client={client}
      >
        <TestComponent />
      </ApiClientProvider>
    </>
  )
}

export default App
