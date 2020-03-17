import 'bulma'
import {useState} from 'react'
import {animated, useSpring} from 'react-spring'
import fetch from 'isomorphic-unfetch'
import {parseISO, format} from 'date-fns'

const transactionStyle = {
  container: {marginBottom: '5px'},
  title: {margin: '0', textTransform: 'capitalize'}
}

const uncollapsed = {opacity: 1, transform: 'scaleY(1)', transformOrigin: '100% 0%', height: '50px'}
const collapsed = {opacity: 0, transform: 'scaleY(0)', transformOrigin: '100% 0%', height: '0px'}

function Transaction(props) {
  const detailStyle = useSpring(props.isOpen ? uncollapsed : collapsed)
  const color = props.type === 'credit' ? 'is-success' : 'is-danger'
  return (
    <div className="column is-full" style={transactionStyle.container}>
      <div onClick={props.onClick} className={'columns button is-mobile ' + color} style={transactionStyle.title}>
        <div className="column">{props.type}</div>
        <div className="column">{props.amount}</div>
      </div>
      <animated.div style={detailStyle}>
        <p><b>ID: </b>{props.id}</p>
        <p><b>Date: </b>{format(parseISO(props.effectiveDate), 'hh:mm:ss a MMMM do yyyy')}</p>
      </animated.div>
    </div>
  )
}

export default function Transactions({transactions}) {
  const [selected, setSelected] = useState()
  return (
    <section className="section">
      <h2 class="title">Transactions</h2>
      <h2 class="subtitle">Account balance: {
        transactions.reduce((r, tx) => r + tx.amount*(tx.type === 'credit' ? 1 : -1), 0)
      }</h2>
      <div className="columns is-multiline is-mobile is-gapless">
        {transactions.map(tx => <Transaction key={tx.id} {...tx}
          isOpen={selected === tx.id}
          onClick={() => setSelected(tx.id !== selected ? tx.id : null)}
        />)}
      </div>
    </section>
  )
}

Transactions.getInitialProps = async ctx => {
  const res = await fetch('http://localhost:3000/api/transactions')
  return { transactions: await res.json() }
}
