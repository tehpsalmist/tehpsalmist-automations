import useSWR from 'swr'

let lastIndex = 1

export const useGetIdea = index => {
  index = Number(index)

  if (0 < index && index < 51) {
    lastIndex = index
  }

  return useSWR(`/api/inspire/${lastIndex}`)
}
