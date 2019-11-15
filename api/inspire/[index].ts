import { NowRequest, NowResponse } from '@now/node'
import { ideas } from '../_data/inspiration'

export default (req: NowRequest, res: NowResponse) => {
  const { index } = req.query

  const indexInt = parseInt(Array.isArray(index) ? index[0]: index, 10)

  const idea = ideas[indexInt]

  res.status(200).json({ idea: idea || ideas[1], index: idea ? indexInt : 1 })
}