import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
export default function MyOrders() {
  const { t, user, authReady } = useApp(), [list, setList] = useState([])
  useEffect(() => { if (!user) return; return onSnapshot(query(collection(db, 'orders'), where('userId', '==', user.uid)),
    s => setList(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)))) }, [user])
  if (authReady && !user) return <Navigate to="/login" state={{ from: '/my-orders' }} replace />
  return <><h1 className="text-2xl font-bold mb-4">{t('myOrders')}</h1>
    {!list.length ? <p className="card p-8 text-center">{t('noOrders')}</p> :
      <ul className="card divide-y divide-slate-200 dark:divide-slate-800">{list.map(o => <li key={o.id} className="p-3 flex flex-wrap justify-between gap-2">
        <span>{o.offerTitle} · {o.operatorName} · {o.simNumber}</span><span>৳{o.price} · {t(o.status)}</span></li>)}</ul>}</>
}
