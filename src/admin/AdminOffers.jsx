import { useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { useAdminOffers } from '../hooks'
import { OPERATORS, effectiveStatus } from '../utils/offers'
export default function AdminOffers({ only }) {
  const { t, notify } = useApp(), { offers, loading } = useAdminOffers(), [q, setQ] = useState(''), [op, setOp] = useState('')
  const list = offers.filter(o => (!only || effectiveStatus(o) === only) && (!op || o.operatorId === op) && (!q || o.title?.toLowerCase().includes(q.toLowerCase())))
  const toggle = async o => { try { await updateDoc(doc(db, 'offers', o.id), { status: o.status === 'active' ? 'inactive' : 'active', updatedAt: serverTimestamp() }) } catch { notify(t('err'), 'err') } }
  const del = async o => { if (!confirm(t('confirmDel'))) return; try { await deleteDoc(doc(db, 'offers', o.id)); notify(t('deleted')) } catch { notify(t('err'), 'err') } }
  return <><div className="flex flex-wrap gap-2 mb-4"><h1 className="text-2xl font-bold mr-auto">{t(only ? only + 'Offers' : 'offers')}</h1>
    <input className="input sm:!w-48" placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} />
    <select className="input sm:!w-44" value={op} onChange={e => setOp(e.target.value)}><option value="">{t('allOps')}</option>{OPERATORS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
    <Link className="btn" to="/admin/add-offer">+ {t('addOffer')}</Link></div>
    {loading ? <div className="card h-40 animate-pulse" /> : !list.length ? <p className="card p-8 text-center">{t('noOffers')}</p> :
    <div className="card overflow-x-auto"><table className="w-full text-sm"><tbody>{list.map(o => <tr key={o.id} className="border-b border-slate-200 dark:border-slate-800">
      <td className="p-3">{o.title}<div className="text-xs text-slate-500">{o.operatorName} · {o.expiryDate}</div></td><td>৳{o.offerPrice}</td><td>{t(effectiveStatus(o))}</td>
      <td className="p-2 flex flex-wrap gap-1"><Link className="btn btn-ghost" to={`/admin/edit-offer/${o.id}`}>{t('edit')}</Link>
        <button className="btn btn-ghost" onClick={() => toggle(o)}>{o.status === 'active' ? t('deactivate') : t('activate')}</button>
        <button className="btn !bg-red-600" onClick={() => del(o)}>{t('del')}</button></td></tr>)}</tbody></table></div>}</>
}
