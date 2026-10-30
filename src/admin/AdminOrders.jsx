import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
export default function AdminOrders() {
  const { t, notify } = useApp(), [list, setList] = useState([])
  useEffect(() => onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(200)), s => setList(s.docs.map(d => ({ id: d.id, ...d.data() })))), [])
  const set = async (o, status) => { try { await updateDoc(doc(db, 'orders', o.id), { status }) } catch { notify(t('err'), 'err') } }
  return <><h1 className="text-2xl font-bold mb-4">{t('manageOrders')}</h1>
    {!list.length ? <p className="card p-8 text-center">{t('noOrders')}</p> :
      <div className="card overflow-x-auto"><table className="w-full text-sm"><tbody>{list.map(o => <tr key={o.id} className="border-b border-slate-200 dark:border-slate-800">
        <td className="p-3">{o.offerTitle}<div className="text-xs text-slate-500">{o.operatorName} · ৳{o.price}</div></td>
        <td>{o.userName}<div className="text-xs text-slate-500">{o.userEmail}</div></td><td className="font-mono">{o.simNumber}</td><td>{t(o.status)}</td>
        <td className="p-2 flex gap-1"><button className="btn" onClick={() => set(o, 'confirmed')}>{t('confirmed')}</button><button className="btn btn-ghost" onClick={() => set(o, 'cancelled')}>{t('cancelled')}</button></td></tr>)}</tbody></table></div>}</>
}
