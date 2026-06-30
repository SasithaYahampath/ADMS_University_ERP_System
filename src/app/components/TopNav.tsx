import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  setIsMobileOpen: (open: boolean) => void;
}

export function TopNav({ setIsMobileOpen }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border fixed top-0 right-0 left-0 lg:left-64 z-10 flex items-center px-4 md:px-6 gap-4">
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden p-2 hover:bg-accent rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-input-background border border-transparent focus:border-ring focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-accent transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-lg p-4">
              <h3 className="mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent rounded-lg">
                  <p className="text-sm">New order #1234 received</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <p className="text-sm">Low stock alert: Product A</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <span className="text-sm">JD</span>
            </div>
            <span className="text-sm">John Doe</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-popover border border-border rounded-lg shadow-lg py-2">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors">
                Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors">
                Settings
              </button>
              <div className="border-t border-border my-1"></div>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors text-destructive">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
