[![npm version](https://img.shields.io/npm/v/useipa?color=brightgreen&label=npm%20package)](https://www.npmjs.org/package/useipa)
&nbsp;
[![Build status](https://img.shields.io/github/actions/workflow/status/abidta/useipa/CI.yml?branch=main&label=CI&logo=github)](https://github.com/abidta/useipa/actions/workflows/ci.yml)
&nbsp;
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/abidta/useipa/blob/main/LICENSE)

 # useipa Package

### A Powerful and Lightweight React Hook for Managing API Calls and Forms

The `useipa` package provides custom hooks for API interaction in React applications using Axios. It includes hooks for fetching data, mutating data, and submitting forms with integrated state management for loading, success, and error states.

## Installation

To install the package, run:

```sh
npm install useipa
# or
yarn add useipa
```

## Usage

### `ApiClientProvider`

Setting Up `ApiClientProvider`
First, import the necessary components and set up your ApiClientProvider with the desired configuration.Within any child component, you can use the [useApi](#useapi-the-core-hook) hook to access the configured Axios instance.

```tsx
import { ApiClientProvider } from 'useipa';

const apiClientConfig = {
  baseURL: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
  },
};

const App = () => {
  return (
    <ApiClientProvider client={apiClientConfig}>
      <YourComponent />
    </ApiClientProvider>
  );
};

export default App;
```

### `useApi` The Core Hook

The `useApi` hook provides methods for fetching and mutating data from an API.
Fetches data, mutates resources, and submits forms using a unified API.

Provides state management for data, error, fetching, and success.

Offers the following methods:

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
      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
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

The [ApiClientProvider](#apiclientprovider) allows you to configure and manage a centralized Axios instance for all your API requests. If no configuration is provided, a default instance is used. Alternatively, you can explicitly pass an `instanceConfig` argument to the [`useApi`](#useapi-the-core-hook) hook to override the default or context-provided instance.
Example:
```tsx
import { useEffect } from 'react'
import { ApiClientProvider, useApi } from 'useipa';

const apiClientConfig = {
  baseURL: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
  },
};

const App = () => {
  return (
    <ApiClientProvider client={apiClientConfig}>
      <YourComponent />
      <AnotherComponent />
    </ApiClientProvider>
  );
};

const YourComponent = () => {
  const { fetching, data, error, fetchData } = useApi();

  useEffect(() => {
    fetchData('/users');
  }, []);

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
};

const AnotherComponent = () => {
  const customConfig = { baseURL: 'https://custom-api.example.com' };
 // override ApiClientProvider Instance
  const { fetching, data, error, fetchData } = useApi(customConfig);

  useEffect(() => {
    fetchData('/users');
  }, []);

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
};

export default App;
```

### `useFormApi` Hook

The `useFormApi` hook is designed for handling form submissions.

- Extends `useApi` with a `submitForm` method for form submissions.
- Inherits state management for `data`,` error`, `fetching`, and `success` from `useApi`.

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
      <input type="text" name="name" value={formData.name} onChange={handleChange} />
      <input type="email" name="email" value={formData.email} onChange={handleChange} />
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

- The `asyncApi` function allows for simple asynchronous API calls.
- Allows making direct API calls without using the state management features of `useApi`.
- Useful for cases where you don't need to manage state within a React component.

#### Example: Async API Call

```js
const getUsers = async () => {
  const data = await asyncApi('/api/users')
  console.log(data)
}
```

### or

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
- **Parameters:**
  - `instanceConfig?` : AxiosInstanceConfig
-  **Methods:**

  - `fetchData(endpoint, config?)`: Fetches data from an API endpoint. - `endpoint`: The URL of the API endpoint. - `config `(optional): An object containing configuration options like headers or method (defaults to `GET`).
    <br>

  - `mutate(endpoint, data, config?)`: Mutates data on an API endpoint.

    - `endpoint`: The URL of the API endpoint.
    - `data`: The data to be sent for mutation.
    - `config` (optional): An object containing configuration options like headers or method (defaults to `POST`).
      <br>

  - `submitApi(endpointOrConfig, config?)` (internal method): Handles the actual API request.
    - `endpointOrConfig`: Either a string representing the endpoint URL or a configuration object.
    - `config `(optional): Additional configuration options for the request.

### `useFormApi`

- **State and Methods:** Inherits all state and methods from `useApi`.
- **Parameters:**
  - `instanceConfig?` : AxiosInstanceConfig
- **Methods:**
  - `submitForm(endpoint: string, inputData: object,config?)`: Submit form data to the specified endpoint using the POST method.

### `asyncApi`

- **Parameters:**

  - `endpoint: string`: The API endpoint to call.
  - `method?: string`: The HTTP method to use (default is 'GET').
  - `config?: RequestConfig`: Additional configuration options for the request

- **Returns:** A promise that resolves with the API response data.

### Request Configuration

The `createConfig` function (not directly exported) helps build request configurations. You can provide custom configurations when calling `fetchData`, `mutate`, or passing them to `submitApi` and `submitForm`:

```js
const config = {
  headers: {
    Authorization: `Bearer ${myAuthToken}`,
  },
}

fetchData('/api/data', config)
```

### Error Handling

`useApi` logs errors to the console by default. You can implement custom error handling in your component.
The `error` property in `useApi` and `useFormApi` stores the error object for programmatic handling.

## Contributing
If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request on [GitHub](https://github.com/abidta/useipa).

## Conclusion

The `useipa` package simplifies API interactions in React applications, providing a robust and easy-to-use set of hooks for data fetching and form submission. For more detailed usage and advanced configurations, refer to the provided examples and API reference.

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

---
