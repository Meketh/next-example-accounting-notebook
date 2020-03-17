import {transactions} from '../../../db/transactions'

export default (req, res) => {
  if (req.method === 'GET') {
    const tx = transactions.find(tx => tx.id === req.query.id)
    if (tx) return res.status(200).json(tx)
  }
  return res.status(404).json({error: 'Transaction Not Found'})
}
