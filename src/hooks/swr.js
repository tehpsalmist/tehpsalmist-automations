import useSWR from 'swr'

export const useGetIdea = index => {
  return useSWR(`/api/inspire/${index}`)
}
