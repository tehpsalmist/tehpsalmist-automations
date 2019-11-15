import React, { useState } from 'react'
import { render } from 'react-dom'
import { useGetIdea, useWhat } from './hooks'
import { SWRConfig } from 'swr'

export const App = props => {
  const [ideaIndex, setIdeaIndex] = useState(1)
  const { data, error } = useGetIdea(typeof ideaIndex === 'number' ? ideaIndex : 1)

  return <main>
    <h1 className='text-2xl text-center'>Inspire Your Wife</h1>
    {error && <p className='text-red-500'>Unable to fetch idea.</p>}
{data && data.idea ? <p>{data.index}. {data.idea}</p> : <p>Searching for Inspiration...</p>}
    <label>
      <span className='mr-2'>Idea Number (out of 50):</span>
      <input
        className='border rounded w-12'
        type='number'
        value={ideaIndex}
        onChange={e => setIdeaIndex(e.target.value ? Number(e.target.value) : '')} />
    </label>
  </main>
}

render(
  <SWRConfig
    value={{
      refreshInterval: 0,
      fetcher: (...args) => fetch(...args).then(res => res.json())
    }}
  >
    <App />
  </SWRConfig>,
  document.getElementById('app')
)
