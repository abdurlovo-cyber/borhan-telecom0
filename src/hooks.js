import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore'
import { db } from './firebase/config'
const toList = s => s.docs.map(d => ({ id: d.id, ...d.data() }))
const ms = o => o.createdAt?.toMillis?.() ?? 0
// public: only stored-active offers (matches Firestore rules); expiry computed client-side
export function usePublicOffers() {
  const [offers, setOffers] = useState([]), [loading, setLoading] = useState(true)
  useEffect(() => onSnapshot(query(collection(db, 'offers'), where('status', '==', 'active'), limit(300)),
    s => { setOffers(toList(s).sort((a, b) => ms(b) - ms(a))); setLoading(false) }, () => setLoading(false)), [])
  return { offers, loading }
}
export function useAdminOffers() {
  const [offers, setOffers] = useState([]), [loading, setLoading] = useState(true)
  useEffect(() => onSnapshot(query(collection(db, 'offers'), orderBy('createdAt', 'desc'), limit(500)),
    s => { setOffers(toList(s)); setLoading(false) }, () => setLoading(false)), [])
  return { offers, loading }
}
