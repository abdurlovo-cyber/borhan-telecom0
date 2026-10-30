import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePublicOffers } from '../hooks'
import OfferCard from '../components/OfferCard'
import { OPERATORS, CATEGORIES, effectiveStatus, calcDiscount, opById } from '../utils/offers'
const PAGE = 12
export default function OfferList({ cat }) {
  const { t } = useApp(), { opId } = useParams(), { offers, loading } = usePublicOffers()
  const [q, setQ] = useState(''), [op, setOp] = useState(''), [c, setC] = useState(['all', 'search'].includes(cat) ? '' : cat || ''), [sort, setSort] = useState('latest'), [shown, setShown] = useState(PAGE)
  const fixedOp = opId && opById(opId) ? opId : op
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    let r = offers.filter(o => effectiveStatus(o) === 'active')
      .filter(o => !fixedOp || o.operatorId === fixedOp)
      .filter(o => !c || c === 'latest' || (c === 'discount' ? calcDiscount(o.regularPrice, o.offerPrice) > 0 : o.categoryId === c))
      .filter(o => !s || [o.title, o.operatorName, o.categoryId, o.internetData, o.minutes, o.sms, o.offerPrice, calcDiscount(o.regularPrice, o.offerPrice) + '%'].join(' ').toLowerCase().includes(s))
    if (sort === 'price') r = [...r].sort((a, b) => a.offerPrice - b.offerPrice)
    if (sort === 'discount') r = [...r].sort((a, b) => calcDiscount(b.regularPrice, b.offerPrice) - calcDiscount(a.regularPrice, a.offerPrice))
    return r
  }, [offers, q, fixedOp, c, sort])
  return <>
    <h1 className="text-2xl font-extrabold mb-4">{opId ? opById(opId)?.name : t(cat || 'all')}</h1>
    <div className="grid gap-2 md:grid-cols-4 mb-4">
      <input className="input" placeholder={t('searchPh')} aria-label={t('search')} value={q} onChange={e => { setQ(e.target.value); setShown(PAGE) }} />
      {!opId && <select className="input" value={op} onChange={e => setOp(e.target.value)}><option value="">{t('allOps')}</option>{OPERATORS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>}
      <select className="input" value={c} onChange={e => setC(e.target.value)}><option value="">{t('allCats')}</option>{CATEGORIES.map(k => <option key={k} value={k}>{t(k)}</option>)}</select>
      <select className="input" value={sort} onChange={e => setSort(e.target.value)}><option value="latest">{t('latest')}</option><option value="price">{t('lowPrice')}</option><option value="discount">{t('highDisc')}</option></select></div>
    {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-72" />)}</div>
      : !list.length ? <p className="card p-8 text-center">{t('noOffers')}</p>
      : <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, shown).map(o => <OfferCard key={o.id} o={o} />)}</div>
        {shown < list.length && <button className="btn mx-auto mt-6 block" onClick={() => setShown(shown + PAGE)}>+</button>}</>}
  </>
}
