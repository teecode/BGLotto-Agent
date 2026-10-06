/**
 * The one list of where things live in the agent portal. The sidebar, the
 * phone menu, the bottom tabs, the header trail and the browser tab title
 * are all built from it, so a page added here shows up everywhere at once.
 */
import type { IconName } from '@/components/AppIcon.vue'

export interface NavLink {
  title: string
  to: string
  icon: IconName
}

export interface NavGroup {
  title: string
  links: NavLink[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: '',
    links: [{ title: 'Dashboard', to: '/dashboard', icon: 'home' }],
  },
  {
    title: 'Sales',
    links: [
      { title: 'Tickets', to: '/dashboard/tickets', icon: 'ticket' },
      { title: 'Shop Statistics', to: '/dashboard/shop-statistics', icon: 'chart' },
      { title: 'Game Statistics', to: '/dashboard/game-statistics', icon: 'grid' },
      { title: 'Terminal Statistics', to: '/dashboard/terminal-statistic', icon: 'device' },
      { title: 'Transactions', to: '/dashboard/transactions', icon: 'swap' },
    ],
  },
  {
    title: 'Cashiers',
    links: [
      { title: 'Cashier Details', to: '/dashboard/cashier-details', icon: 'users' },
      { title: 'Cashier Reports', to: '/dashboard/cashier-reports', icon: 'report' },
      { title: 'Cashier Summary', to: '/dashboard/cashier-summary-report', icon: 'trend' },
      { title: 'Commission Calculator', to: '/dashboard/commission-calculator', icon: 'calculator' },
      { title: 'Bonus Log', to: '/dashboard/bonus-log', icon: 'gift' },
    ],
  },
  {
    title: 'Money',
    links: [
      { title: 'Cashout', to: '/dashboard/cashout', icon: 'cash' },
      { title: 'Payouts', to: '/dashboard/payout', icon: 'wallet' },
      { title: 'Lodgement', to: '/dashboard/lodgement', icon: 'bank' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { title: 'Agency Details', to: '/dashboard/agent-details', icon: 'shop' },
      { title: 'Notifications', to: '/dashboard/notifications', icon: 'bell' },
      { title: 'Maxi University', to: '/dashboard/maxi-university', icon: 'book' },
    ],
  },
]

/** What an agent reaches for most on a phone; everything else is one tap away under Menu */
export const BOTTOM_TABS: NavLink[] = [
  { title: 'Home', to: '/dashboard', icon: 'home' },
  { title: 'Tickets', to: '/dashboard/tickets', icon: 'ticket' },
  { title: 'Cashout', to: '/dashboard/cashout', icon: 'cash' },
  { title: 'Payouts', to: '/dashboard/payout', icon: 'wallet' },
]

export interface NavPlace {
  link: NavLink
  group: string
}

const ALL: NavPlace[] = NAV_GROUPS.flatMap((group) => group.links.map((link) => ({ link, group: group.title })))

/**
 * The menu entry a URL belongs to. A page nested under an entry counts as that
 * entry (a Maxi University lesson is "Maxi University"), and the longest match
 * wins so that every /dashboard/... page is not also "Dashboard".
 */
export function locate(path: string): NavPlace | null {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  let best: NavPlace | null = null
  for (const place of ALL) {
    const to = place.link.to
    if ((clean === to || clean.startsWith(to + '/')) && (!best || to.length > best.link.to.length)) best = place
  }
  return best
}

export function isActive(link: NavLink, path: string): boolean {
  return locate(path)?.link.to === link.to
}
