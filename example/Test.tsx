import { useEffect } from 'react'
import { useApi } from '../src'

function Test() {
  const { fetchData, data } = useApi()
  useEffect(() => {
    fetchData('/todos/1')
  }, [])

  return (
    <>
      <textarea
        readOnly
        style={{ height: '200px', width: '400px' }}
        value={data ? JSON.stringify(data, null, 2) : ''}
      ></textarea>
    </>
  )
}

export default Test
