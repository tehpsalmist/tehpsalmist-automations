import React, { useState, useEffect } from 'react'
import { useGetIdea, useFreshClosure } from '../hooks'

export const InspireYourWife = props => {
  const [ideaIndex, setIdeaIndex] = useState(1)
  const { data, error } = useGetIdea(ideaIndex)
  const [email, setEmail] = useState('')
  const [posting, setPosting] = useState(false)
  const [signedUp, setSignedUp] = useState(false)
  const [alreadyUsed, setAlreadyUsed] = useState(false)

  const updater = useFreshClosure(email => {
    if (email) {
      setEmail('')
      localStorage.setItem(`inspire-wife-email:${email}`, 1)
      setSignedUp(true)
    }

    setPosting(false)
  })

  useEffect(() => {
    if (localStorage.getItem(`inspire-wife-email:${email}`)) {
      setAlreadyUsed(true)
    } else {
      setAlreadyUsed(false)
    }
  }, [email])

  return <main>
    <div className='flex-center flex-col max-w-xl mx-auto p-2'>
      <h1 className='text-2xl text-center'>Inspire Your Wife</h1>
      <p><em>Helpful thoughts from some <a className='text-blue-500' href='https://www.familylife.com/articles/topics/marriage/staying-married/husbands/50-ways-to-inspire-your-wife/' target='_blank'>friends on the internet</a></em></p>
      <label className='my-4'>
        <span className='mr-2'>Idea</span>
        <input
          className='border rounded w-12 px-2 border border-green-400 focus:border-2 focus:outline-none'
          type='number'
          value={ideaIndex}
          onChange={e => setIdeaIndex(e.target.value ? Number(e.target.value) : '')} />
        <span className='ml-2'>of 50:</span>
      </label>
      {error && <p className='text-red-500'>Unable to fetch this idea.</p>}
      {data && data.idea ? <p>{data.idea}</p> : <p>Searching for Inspiration...</p>}
    </div>
    <hr className='my-16' />
    {signedUp
      ? <div className='flex-center flex-col max-w-xl mx-auto'>
        <h2 className='text-xl'>Thanks for signing up.</h2>
        <p className='text-blue-500'>Now go tell your wife she's beautiful!</p>
      </div>
      : <div className='flex-center flex-col max-w-xl mx-auto p-2'>
        <h2 className='text-xl'>Like These Tips?</h2>
        <p>Get them <abbr style={{ cursor: 'help' }} title='every 2 days in the afternoon'>periodically</abbr> in your inbox!</p>
        <input
          type='email'
          className='mx-auto max-w-md w-full border p-1 mt-6 mb-3 border-green-400 focus:border-2 focus:outline-none rounded text-center'
          placeholder='yes.please@my.email.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={posting}
        />
        {alreadyUsed && <p className='text-blue-500 mb-4'>This email is already signed up! Enjoy!</p>}
        <button
          className={`p-2 rounded shadow-md bg-green-500 hover:shadow-lg hover:bg-green-600 focus:shadow focus:bg-green-600 text-white focus:outline-none`}
          onClick={e => {
            if (posting || !email) return

            if (alreadyUsed && !confirm('It looks like this email is already signed up. Want to sign up again anyway?')) return

            const currentEmail = email

            setPosting(true)

            fetch(`/api/email-me-inspiration`, {
              method: 'POST',
              body: JSON.stringify({ email }),
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(r => r.ok && r.json())
              .then(stuff => {
                updater(stuff && currentEmail)
              })
              .catch(err => {
                console.error(err)

                updater()
              })
          }}
        >
          {posting ? 'Hooking a brother up...' : 'Sign me up!'}
        </button>
      </div>}
  </main>
}
