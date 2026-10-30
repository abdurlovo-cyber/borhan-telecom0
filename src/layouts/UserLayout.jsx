import { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { OPERATORS } from '../utils/offers'
const links = [['/', 'home'], ['/offers', 'all'], ['/internet', 'internet'], ['/minutes', 'minute'], ['/combo', 'combo'], ['/sms', 'sms'], ['/latest', 'latest']]
export default function UserLayout() {
  const { t, lang, setLang, dark, setDark, user, isAdmin, logout } = useApp(), [open, setOpen] = useState(false), nav = useNavigate(), loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])
  const cls = ({ isActive }) => `px-2 py-1 rounded ${isActive ? 'text-teal-600 font-bold' : 'hover:text-teal-600'}`
  const customer = user && !isAdmin
  const bottom = [['/', 'home', '🏠'], ['/offers', 'all', '📶'], ['/search', 'search', '🔍'], customer ? ['/my-orders', 'myOrders', '🧾'] : ['/login', 'login', '👤']]
  return <div className="min-h-screen flex flex-col">
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 font-bold text-teal-600 text-base sm:text-lg shrink-0">
          <span className="w-8 h-8 rounded-lg bg-teal-600 text-white grid place-items-center">B</span><span className="truncate max-w-[9rem] sm:max-w-none">{t('brand')}</span></Link>
        <nav className="hidden lg:flex gap-1 ml-4 text-sm">{links.map(([to, k]) => <NavLink key={to} to={to} end className={cls}>{t(k)}</NavLink>)}</nav>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="btn btn-ghost !px-3 hidden sm:inline-flex" aria-label={t('search')} onClick={() => nav('/search')}>🔍</button>
          <button className="btn btn-ghost !px-3" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}>{lang === 'bn' ? 'EN' : 'বাং'}</button>
          <button className="btn btn-ghost !px-3" aria-label="theme" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
          {customer ? <><Link className="btn btn-ghost hidden md:inline-flex" to="/my-orders">{t('myOrders')}</Link><button className="btn btn-ghost hidden md:inline-flex" onClick={logout}>{t('logout')}</button></>
            : !user && <><Link className="btn btn-ghost hidden md:inline-flex" to="/login">{t('login')}</Link><Link className="btn hidden md:inline-flex" to="/register">{t('register')}</Link></>}
          <button className="btn btn-ghost !px-3 lg:hidden" aria-label="menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        </div></div>
      {open && <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 grid gap-1 max-h-[75vh] overflow-y-auto">
        {links.map(([to, k]) => <NavLink key={to} to={to} end className={({ isActive }) => `py-2 ${isActive ? 'text-teal-600 font-bold' : ''}`}>{t(k)}</NavLink>)}
        <NavLink to="/special" className="py-2">{t('special')}</NavLink><NavLink to="/discount" className="py-2">{t('discount')}</NavLink>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-2 text-xs text-slate-500">{t('operators')}</div>
        {OPERATORS.map(o => <NavLink key={o.id} to={`/operator/${o.id}`} className="py-2 flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: o.color }} />{o.name}</NavLink>)}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-3 flex gap-2">
          {customer ? <><Link className="btn flex-1" to="/my-orders">{t('myOrders')}</Link><button className="btn btn-ghost flex-1" onClick={logout}>{t('logout')}</button></>
            : !user && <><Link className="btn btn-ghost flex-1" to="/login">{t('login')}</Link><Link className="btn flex-1" to="/register">{t('register')}</Link></>}</div>
      </nav>}
    </header>
    <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 lg:pb-6"><Outlet /></main>
    <footer className="text-center text-xs sm:text-sm text-slate-500 py-6 pb-24 lg:pb-6 px-4">© BORHAN TELECOM · {t('footer')}</footer>
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-4 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {bottom.map(([to, k, ic]) => <NavLink key={to} to={to} end className={({ isActive }) => `flex flex-col items-center py-2 text-xs ${isActive ? 'text-teal-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}><span className="text-lg leading-none">{ic}</span>{t(k)}</NavLink>)}
    </nav>
  </div>
}
