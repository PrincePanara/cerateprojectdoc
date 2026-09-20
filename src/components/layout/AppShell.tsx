import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FolderIcon, ImageIcon, LayoutDashboardIcon, LayoutTemplateIcon, MenuIcon, PenLineIcon, SettingsIcon, ShapesIcon, XIcon, BoxIcon } from "lucide-react";
import { Logo } from "../brand/Logo";
import { SaveIndicator } from "./SaveIndicator";
import { UserMenu } from "./UserMenu";
import { cn } from "../../utils/cn";
import { useProjects } from "../../contexts/ProjectsContext";
const NAV = [{
  to: '/app',
  label: 'Dashboard',
  icon: LayoutDashboardIcon,
  end: true
}, {
  to: '/app/projects',
  label: 'My Projects',
  icon: FolderIcon
}, {
  to: '/app/templates',
  label: 'Templates',
  icon: LayoutTemplateIcon
}, {
  to: '/app/builder',
  label: 'Documentation Builder',
  icon: PenLineIcon
}, {
  to: '/app/screenshots',
  label: 'Screenshots',
  icon: ImageIcon
}, {
  to: '/app/diagrams',
  label: 'Diagrams',
  icon: ShapesIcon
}];
const NAV_FOOTER = [{
  to: '/app/settings',
  label: 'Settings',
  icon: SettingsIcon
}, {
  to: '/app/help',
  label: 'Help',
  icon: BoxIcon
}];
export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const {
    projects
  } = useProjects();
  const linkClass = ({
    isActive


  }: {isActive: boolean;}) => cn('flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-[13.5px] transition-colors duration-150 ease-out', isActive ? 'bg-brandSoft text-brandInk font-medium' : 'text-ink2 hover:bg-surface2 hover:text-ink');
  const sidebar = <div className="flex flex-col h-full">
      <div className="h-14 flex items-center px-4 border-b border-line2">
        <button onClick={() => navigate('/app')} aria-label="Go to dashboard">
          <Logo />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scroll-thin" aria-label="Workspace">
        {NAV.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setMobileOpen(false)}>
            <item.icon className="w-4 h-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </NavLink>)}

        <p className="text-[10.5px] font-semibold tracking-[0.08em] text-ink3 px-2.5 pt-5 pb-2">RECENT PROJECTS</p>
        {projects.slice(0, 4).map((p) => <button key={p.id} onClick={() => {
        setMobileOpen(false);
        navigate(`/project/${p.id}/basic`);
      }} className="w-full flex items-center gap-2.5 h-8 px-2.5 rounded-lg text-[13px] text-ink2 hover:bg-surface2 hover:text-ink transition-colors duration-150 ease-out">
            <span className="w-1.5 h-1.5 rounded-full bg-line shrink-0" aria-hidden />
            <span className="truncate">{p.basicInfo.projectName}</span>
          </button>)}
      </nav>
      <div className="p-3 border-t border-line2 space-y-0.5">
        {NAV_FOOTER.map((item) => <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setMobileOpen(false)}>
            <item.icon className="w-4 h-4 shrink-0" aria-hidden />
            {item.label}
          </NavLink>)}
      </div>
    </div>;
  return <div className="min-h-full w-full bg-canvas flex">
      <aside className="hidden lg:flex w-[236px] shrink-0 border-r border-line bg-surface flex-col fixed inset-y-0">
        {sidebar}
      </aside>

      {mobileOpen && <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[260px] bg-surface border-r border-line">
            <button onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="absolute top-4 right-3 text-ink3 hover:text-ink">
              <XIcon className="w-4 h-4" />
            </button>
            {sidebar}
          </aside>
        </div>}

      <div className="flex-1 min-w-0 lg:ml-[236px]">
        <header className="sticky top-0 z-30 h-14 bg-canvas/90 backdrop-blur border-b border-line2 flex items-center gap-3 px-4 sm:px-6">
          <button className="lg:hidden text-ink2 hover:text-ink transition-colors duration-150 ease-out" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <MenuIcon className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <SaveIndicator />
          <UserMenu />
        </header>
        <main className="px-4 sm:px-6 py-6 max-w-[1240px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>;
}