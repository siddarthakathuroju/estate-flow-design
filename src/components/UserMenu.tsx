
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Settings, LogIn, BarChart3, Shield, Building, ClipboardList, Users } from 'lucide-react';

export default function UserMenu() {
  const { user, logout, isAuthenticated, isManager, isWorker } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <Button variant="outline" onClick={() => navigate('/auth')} className="gap-2">
        <LogIn className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : user?.email.substring(0, 2).toUpperCase();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar_url} alt={user?.name || user?.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            {user?.role && (
              <p className="text-xs font-medium text-estate-500 capitalize">{user.role}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/portfolio" className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Portfolio</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Role-specific menu items */}
        {(isManager || isWorker) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspace
            </DropdownMenuLabel>
            
            {isManager && (
              <DropdownMenuItem asChild>
                <Link to="/properties/manage" className="cursor-pointer">
                  <Building className="mr-2 h-4 w-4" />
                  <span>Manage Properties</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {isWorker && (
              <DropdownMenuItem asChild>
                <Link to="/jobs/new" className="cursor-pointer">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Available Jobs</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {(isManager || isWorker) && (
              <DropdownMenuItem asChild>
                <Link to="/tasks" className="cursor-pointer">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Tasks</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {isManager && (
              <DropdownMenuItem asChild>
                <Link to="/team" className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/kyc" className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>KYC Verification</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
