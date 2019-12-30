import React, { useState, useRef } from 'react'
import { useGetIdea } from '../hooks'

const useStaleClosure = callback => {
  const updaterRef = useRef()

  updaterRef.current = callback

  return (...args) => updaterRef.current(...args)
}

export const InspireYourWife = props => {
  const [ideaIndex, setIdeaIndex] = useState(1)
  const { data, error } = useGetIdea(ideaIndex)
  const [email, setEmail] = useState('')
  const [posting, setPosting] = useState(false)

  const updater = useStaleClosure(stuff => {
    setEmail('')
    setPosting(false)
  })

  return <main>
    <div className='flex-center flex-col max-w-xl mx-auto'>
      <h1 className='text-2xl text-center'><em>Inspire Your Wife</em></h1>
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
    </div>
    <hr className='my-16' />
    <div className='flex-center flex-col max-w-xl mx-auto'>
      <h2 className='text-xl'>Like These Tips?</h2>
      <p>Get them periodically in your inbox!</p>
      <input className='w-full border p-1 mt-6 mb-3 border-green-400 rounded' placeholder='yes.please@my.email.com' value={email} onChange={e => setEmail(e.target.value)} />
      <button
        className={`p-2 rounded shadow-md bg-green-500 hover:shadow-lg bg-green-600 focus:shadow focus:bg-green-300 text-white focus:outline-none`}
        onClick={e => {
          if (posting) return

          setPosting(true)

          fetch(`/api/email-me-inspiration`, {
            method: 'POST',
            body: JSON.stringify({ email })
          })
            .then(r => r.json())
            .then(stuff => {
              updater(stuff.ok && stuff)
            })
            .catch(err => {
              console.error(err)

              updater()
            })
        }}
      >
        {posting ? 'Sending...' : 'Go!'}
      </button>
    </div>
  </main>
}
