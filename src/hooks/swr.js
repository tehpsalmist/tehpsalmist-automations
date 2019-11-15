import useSWR from 'swr'

export const useGetIdea = index => {
  return useSWR(`/api/inspire/${index}`)
}

export const useWhat = () => {
  return useSWR(`/api/inspire/deeper/mongo`)
}