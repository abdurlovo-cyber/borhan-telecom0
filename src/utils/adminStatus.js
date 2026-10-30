import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
// 'approved' | 'pending' | 'none'. UI convenience only: Firestore/Storage rules enforce the same check.
export async function adminStatus(user) {
  try { if ((await user.getIdTokenResult(true)).claims.admin === true) return 'approved' } catch {}
  try {
    const s = await getDoc(doc(db, 'admins', user.uid))
    if (!s.exists()) return 'none'
    return s.data().status === 'approved' ? 'approved' : 'pending'
  } catch { return 'none' }
}
