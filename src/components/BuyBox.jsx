import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
export default function BuyBox({ o, st }) {
  const { t, user, isAdmin, notify } = useApp(), loc = useLocation(), [sim, setSim] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(false)
  if (st !== 'active') return <p className="card p-4">{t('unavailable')}</p>
  if (!user || isAdmin) return isAdmin ? null : <Link className="btn" to="/login" state={{ from: loc.pathname }}>{t('loginToBuy')}</Link>
  const order = async e => {
    e.preventDefault(); if (busy) return
    if (!/^01[3-9]\d{8}$/.test(sim)) return notify(t('phoneBad'), 'err')
    setBusy(true)
    try {
      await addDoc(collection(db, 'orders'), { offerId: o.id, offerTitle: o.title, operatorName: o.operatorName, price: Number(o.offerPrice), simNumber: sim,
        userId: user.uid, userName: user.displayName || '', userEmail: user.email, status: 'pending', createdAt: serverTimestamp() })
      setDone(true); notify(t('orderPlaced'))
    } catch { notify(t('err'), 'err') } finally { setBusy(false) }
  }
  if (done) return <p className="card p-4 text-teal-700">{t('orderPlaced')} <Link className="underline" to="/my-orders">{t('myOrders')}</Link></p>
  return <form onSubmit={order} className="card p-4 grid gap-2"><h2 className="font-bold">{t('buy')}</h2>
    <label>{t('orderFor')}<input className="input" inputMode="numeric" value={sim} onChange={e => setSim(e.target.value)} /></label>
    <p className="text-xs text-slate-500">{t('payNote')}</p><button className="btn" disabled={busy}>{t('placeOrder')}</button></form>
}
