'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  Image,
  Globe
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Properties',
    href: '/admin/properties',
    icon: Building2
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: FileText
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Leads',
    href: '/admin/leads',
    icon: Users
  },
  {
    title: 'Landing Pages',
    href: '/admin/landing-pages',
    icon: Globe
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: Image
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </Link>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <MessageSquare className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}