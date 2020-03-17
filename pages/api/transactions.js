import {v4 as uuidv4} from 'uuid'
import {transactions, account} from '../../db/transactions'

// all operations will be sync, single threaded
// so no need for mutex

export default (req, res) => {
  switch (req.method) {
    case 'GET': return res.status(200).json(transactions)
    case 'POST':
      const {amount, type} = req.body
      if (account.balance < amount && type === 'debit') {
        return res.status(403).json(account)
      }
      transactions.push({
        ...req.body,
        id: uuidv4(),
        effectiveDate: new Date(Date.now()).toISOString()
      })
      account.balance += amount * (type === 'credit' ? 1 : -1)
      return res.status(202).json(account)
  }
}
