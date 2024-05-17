[![npm version](https://badgen.net/npm/v/useipa)](https://www.npmjs.org/package/useipa)

# useipa Package

The `useipa` package provides custom hooks for API interaction in React applications using Axios. It includes hooks for fetching data, mutating data, and submitting forms with integrated state management for loading, success, and error states.

## Installation

To install the package, run:

```sh
npm install useipa
```

## Usage

### `useApi` Hook

The `useApi` hook provides methods for fetching and mutating data from an API.

#### Example: Fetching Data

```jsx
import { useEffect } from 'react'
import { useApi } from 'useipa'

const FetchComponent = () => {
  const { data, fetching, error, fetchData } = useApi()

  useEffect(() => {
    fetchData('/api/data')
  }, [fetchData])

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default FetchComponent
```

#### Example: Mutating Data

```jsx
import { useState } from 'react'
import { useApi } from 'useipa'

const MutateComponent = () => {
  const [inputValue, setInputValue] = useState('')
  const { data, success, error, mutate } = useApi()

  const handleSubmit = () => {
    mutate('/api/data', { value: inputValue })
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      {success && <p>Success!</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h1>Response</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default MutateComponent
```

### `useFormApi` Hook

The `useFormApi` hook is designed for handling form submissions.

#### Example: Form Submission

```jsx
import { useState } from 'react'
import { useFormApi } from 'useipa'

const FormComponent = () => {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const { data, success, error, submitForm } = useFormApi()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitForm('/api/form', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
      {success && <p>Form submitted successfully!</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h1>Response</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </form>
  )
}

export default FormComponent
```

### `asyncApi` Function

The `asyncApi` function allows for simple asynchronous API calls.

#### Example: Async API Call

```jsx
import { useEffect, useState } from 'react'
import { asyncApi } from 'useipa'

const AsyncComponent = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await asyncApi('/api/data')
        setData(response)
      } catch (err) {
        setError(err)
      }
    }

    fetchData()
  }, [])

  if (error) return <p>Error: {error.message}</p>
  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default AsyncComponent
```

## API Reference

### `useApi`

- **State:**
  - `data`: The response data from the API.
  - `fetching`: A boolean indicating if the request is in progress.
  - `error`: An error object if the request fails.
  - `success`: A boolean indicating if the request was successful.

- **Methods:**
  - `fetchData(endpoint: string)`: Fetch data from the specified endpoint.
  - `mutate(endpoint: string, body: object, method?: string)`: Send a mutation request (POST, PUT, DELETE, etc.) to the specified endpoint. Default is POST.
  - `submitApi(endpoint: string, body?: object, method?: string, params?: object, headers?: object)`: A low-level function to handle API requests with detailed configurations.

### `useFormApi`

- **State and Methods:** Inherits all state and methods from `useApi`.

- **Methods:**
  - `submitForm(endpoint: string, inputData: object)`: Submit form data to the specified endpoint using the POST method.

### `asyncApi`

- **Parameters:**
  - `endpoint: string`: The API endpoint to call.
  - `method?: string`: The HTTP method to use (default is 'GET').

- **Returns:** A promise that resolves with the API response data.

## Conclusion

The `useipa` package simplifies API interactions in React applications, providing a robust and easy-to-use set of hooks for data fetching and form submission. For more detailed usage and advanced configurations, refer to the provided examples and API reference.

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

---
