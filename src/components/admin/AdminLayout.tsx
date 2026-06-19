import { useState } from 'react'
import { Bell, LogOut, Settings, Menu, X, Search, ChevronRight, TrendingUp, Users, FileText, MessageSquare, BarChart2, Shield, Home, Briefcase, CreditCard, Bell as BellIcon, UserCheck, Lock } from 'lucide-react'
import Overview from './pages/Overview'
import Clients from './pages/Clients'
import Portfolios from './pages/Portfolios'
import Transactions from './pages/Transactions'
import Messages from './pages/Messages'
import Content from './pages/Content'
import Reports from './pages/Reports'
import Team from './pages/Team'
import Notifications from './pages/Notifications'
import SettingsPage from './pages/Settings'
import Security from './pages/Security'
import { mockNotifications } from './adminData'

type Page = 'overview'|'clients'|'portfolios'|'transactions'|'messages'|'content'|'reports'|'team'|'notifications'|'settings'|'security'

interface Props { onLogout: () => void }

const navGroups = [
  { title: 'الرئيسية', items: [
    { key: 'overview', Icon: Home, label: 'لوحة التحكم' },
  ]},
  { title: 'إدارة العملاء', items: [
    { key: 'clients', Icon: Users, label: 'العملاء', badge: 3 },
    { key: 'portfolios', Icon: Briefcase, label: 'المحافظ' },
    { key: 'transactions', Icon: CreditCard, label: 'العمليات', badge: 7 },
    { key: 'messages', Icon: MessageSquare, label: 'الرسائل', badge: 3 },
  ]},
  { title: 'المنصة', items: [
    { key: 'content', Icon: FileText, label: 'المحتوى' },
    { key: 'reports', Icon: BarChart2, label: 'التقارير' },
    { key: 'team', Icon: UserCheck, label: 'الفريق' },
  ]},
  { title: 'النظام', items: [
    { key: 'notifications', Icon: BellIcon, label: 'الإشعارات', badge: mockNotifications.filter(n=>!n.read).length },
    { key: 'settings', Icon: Settings, label: 'الإعدادات' },
    { key: 'security', Icon: Lock, label: 'الأمان' },
  ]},
]

const pageTitles: Record<Page,string> = {
  overview:'لوحة التحكم',clients:'العملاء',portfolios:'المحافظ',
  transactions:'العمليات',messages:'الرسائل',content:'المحتوى',
  reports:'التقارير',team:'الفريق',notifications:'الإشعارات',
  settings:'الإعدادات',security:'الأمان',
}

export default function AdminLayout({ onLogout }: Props) {
  const [page, setPage] = useState<Page>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [search, setSearch] = useState('')
  const unread = mockNotifications.filter(n=>!n.read).length

  const renderPage = () => {
    switch(page) {
      case 'overview': return <Overview />
      case 'clients': return <Clients />
      case 'portfolios': return <Portfolios />
      case 'transactions': return <Transactions />
      case 'messages': return <Messages />
      case 'content': return <Content />
      case 'reports': return <Reports />
      case 'team': return <Team />
      case 'notifications': return <Notifications />
      case 'settings': return <SettingsPage />
      case 'security': return <Security />
      default: return <Overview />
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060E1A', display:'flex', fontFamily:"'Cairo',sans-serif", direction:'rtl', color:'#E2E8F4', minWidth:1280 }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background:'#0A1628', borderLeft:'1px solid #1A2E4A',
        display:'flex', flexDirection:'column', transition:'width 0.25s ease',
        flexShrink:0, zIndex:100, height:'100vh', position:'sticky', top:0, overflowX:'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding:'0 12px', height:60, borderBottom:'1px solid #1A2E4A', display:'flex', alignItems:'center', justifyContent:'space-between', overflow:'hidden' }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#C9A84C,#8B6914)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>⚡</div>
              <div>
                <div style={{ fontSize:'0.8rem', fontWeight:800, color:'#E2E8F4', whiteSpace:'nowrap' }}>Golden Horizon</div>
                <div style={{ fontSize:'0.6rem', color:'#C9A84C', whiteSpace:'nowrap' }}>Admin Panel</div>
              </div>
            </div>
          )}
          {collapsed && <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#C9A84C,#8B6914)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', margin:'0 auto' }}>⚡</div>}
          {!collapsed && (
            <button onClick={()=>setCollapsed(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'#4A6080', padding:4, display:'flex' }}>
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={()=>setCollapsed(false)} style={{ margin:'8px 10px', background:'none', border:'1px solid #1A2E4A', borderRadius:6, cursor:'pointer', color:'#6B84A8', display:'flex', alignItems:'center', justifyContent:'center', padding:6 }}>
            <Menu size={15} />
          </button>
        )}

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'4px 0', scrollbarWidth:'none' }}>
          {navGroups.map(group => (
            <div key={group.title} style={{ marginBottom:2 }}>
              {!collapsed && (
                <div style={{ fontSize:'0.58rem', fontWeight:700, color:'#3A5070', letterSpacing:'1.5px', textTransform:'uppercase', padding:'8px 14px 4px' }}>
                  {group.title}
                </div>
              )}
              {group.items.map(item => {
                const isActive = page === item.key
                const { Icon } = item
                return (
                  <button key={item.key}
                    onClick={()=>setPage(item.key as Page)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width:'100%', display:'flex', alignItems:'center', gap:9,
                      padding: collapsed ? '9px 0' : '9px 14px',
                      background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                      border:'none', borderRight: isActive ? '2px solid #C9A84C' : '2px solid transparent',
                      borderLeft:'none', cursor:'pointer',
                      color: isActive ? '#C9A84C' : '#7A9AB8',
                      fontSize:'0.82rem', fontWeight: isActive ? 700 : 400,
                      fontFamily:"'Cairo',sans-serif", transition:'all 0.15s',
                      textAlign:'right', justifyContent: collapsed ? 'center' : 'flex-start',
                      position:'relative',
                    }}
                    onMouseEnter={e=>{if(!isActive){e.currentTarget.style.color='#C9A84C';e.currentTarget.style.background='rgba(201,168,76,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){e.currentTarget.style.color='#7A9AB8';e.currentTarget.style.background='transparent'}}}>
                    <Icon size={16} style={{ flexShrink:0 }} />
                    {!collapsed && <>
                      <span style={{ flex:1, whiteSpace:'nowrap' }}>{item.label}</span>
                      {(item as any).badge > 0 && (
                        <span style={{ background:'#FF4560', color:'white', borderRadius:10, padding:'1px 6px', fontSize:'0.6rem', fontWeight:700 }}>{(item as any).badge}</span>
                      )}
                    </>}
                    {collapsed && (item as any).badge > 0 && (
                      <span style={{ position:'absolute', top:4, right:8, width:6, height:6, background:'#FF4560', borderRadius:'50%' }} />
                    )}
                  </button>
                )
              })}
              {!collapsed && <div style={{ height:1, background:'rgba(26,46,74,0.3)', margin:'4px 12px' }} />}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid #1A2E4A', position:'relative' }}>
          <button onClick={()=>setShowUserMenu(!showUserMenu)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:8, background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, cursor:'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#E8C96A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:'#060E1A', flexShrink:0 }}>أ</div>
            {!collapsed && <div style={{ flex:1, textAlign:'right' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#E2E8F4', whiteSpace:'nowrap' }}>أحمد المشرف</div>
              <div style={{ fontSize:'0.58rem', color:'#C9A84C' }}>Super Admin</div>
            </div>}
          </button>
          {showUserMenu && !collapsed && (
            <div style={{ position:'absolute', bottom:'100%', right:8, left:8, marginBottom:4, background:'#111E33', border:'1px solid #1A2E4A', borderRadius:8, overflow:'hidden', zIndex:200 }}>
              <button onClick={()=>{setPage('settings');setShowUserMenu(false)}} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'none', border:'none', color:'#E2E8F4', fontSize:'0.8rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <Settings size={13} color="#6B84A8" /> الإعدادات
              </button>
              <div style={{ height:1, background:'#1A2E4A' }} />
              <button onClick={onLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'none', border:'none', color:'#FF4560', fontSize:'0.8rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,69,96,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <LogOut size={13} /> خروج
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Topbar */}
        <header style={{ height:60, background:'#0A1628', borderBottom:'1px solid #1A2E4A', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:90, gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', color:'#6B84A8' }}>
            <span>Golden Horizon</span>
            <ChevronRight size={12} />
            <span style={{ color:'#E2E8F4', fontWeight:600 }}>{pageTitles[page]}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, maxWidth:360 }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'#060E1A', border:'1px solid #1A2E4A', borderRadius:8, padding:'7px 12px', fontSize:'0.78rem', color:'#6B84A8' }}>
              <Search size={13} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{ background:'none', border:'none', outline:'none', color:'#E2E8F4', fontSize:'0.78rem', fontFamily:"'Cairo',sans-serif", flex:1, minWidth:0 }} />
              <kbd style={{ background:'#1A2E4A', borderRadius:3, padding:'1px 5px', fontSize:'0.65rem', color:'#4A6080', flexShrink:0 }}>⌘K</kbd>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Live indicator */}
            <div style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', background:'rgba(0,217,126,0.08)', border:'1px solid rgba(0,217,126,0.2)', borderRadius:6, fontSize:'0.7rem', color:'#00D97E' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#00D97E', display:'inline-block', animation:'blink 1.5s infinite' }} />
              مباشر
            </div>
            {/* Notif */}
            <div style={{ position:'relative' }}>
              <button onClick={()=>setShowNotif(!showNotif)} style={{ width:36, height:36, background: showNotif ? 'rgba(201,168,76,0.1)' : '#060E1A', border:`1px solid ${showNotif ? 'rgba(201,168,76,0.3)' : '#1A2E4A'}`, borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6B84A8', position:'relative' }}>
                <Bell size={15} />
                {unread > 0 && <span style={{ position:'absolute', top:5, left:5, width:7, height:7, background:'#FF4560', border:'2px solid #0A1628', borderRadius:'50%' }} />}
              </button>
              {showNotif && (
                <div style={{ position:'absolute', top:'100%', left:0, marginTop:8, width:320, background:'#111E33', border:'1px solid #1A2E4A', borderRadius:12, boxShadow:'0 20px 50px rgba(0,0,0,0.5)', zIndex:200, overflow:'hidden' }}>
                  <div style={{ padding:'12px 14px', borderBottom:'1px solid #1A2E4A', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:700, fontSize:'0.85rem' }}>الإشعارات</span>
                    <span style={{ fontSize:'0.7rem', color:'#C9A84C', cursor:'pointer' }}>تعليم الكل مقروء</span>
                  </div>
                  {mockNotifications.slice(0,5).map(n => (
                    <div key={n.id} style={{ display:'flex', gap:10, padding:'10px 14px', borderBottom:'1px solid rgba(26,46,74,0.3)', cursor:'pointer', background: !n.read ? 'rgba(201,168,76,0.03)' : 'transparent' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.06)'}
                      onMouseLeave={e=>e.currentTarget.style.background=!n.read?'rgba(201,168,76,0.03)':'transparent'}>
                      <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{n.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'0.78rem', fontWeight:600, color:'#E2E8F4' }}>{n.title}</div>
                        <div style={{ fontSize:'0.7rem', color:'#6B84A8', marginTop:2 }}>{n.desc}</div>
                      </div>
                      <div style={{ fontSize:'0.65rem', color:'#4A6080', flexShrink:0 }}>{n.time}</div>
                    </div>
                  ))}
                  <button onClick={()=>{setPage('notifications');setShowNotif(false)}} style={{ width:'100%', padding:'10px', background:'none', border:'none', color:'#C9A84C', fontSize:'0.78rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif", borderTop:'1px solid #1A2E4A' }}>
                    عرض الكل
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, padding:24, overflowY:'auto' }}>
          {renderPage()}
        </main>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#1A2E4A; border-radius:4px }
      `}</style>
    </div>
  )
}
