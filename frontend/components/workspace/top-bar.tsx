'use client';

import React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Share2, 
  GitBranch, 
  Users, 
  MoreVertical, 
  Search,
  Settings,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  activeProject: string;
}

export function TopBar({ activeProject }: TopBarProps) {
  const projectNames: Record<string, string> = {
    'smart-iot-sensor': 'Smart IoT Sensor Hub',
    'power-management': 'Power Management Module',
    'wireless-module': 'Wireless Communication Module',
  };

  return (
    <div className="h-16 border-b border-foreground/10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-xl flex items-center justify-between px-8 gap-6 transition-all duration-500">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-display tracking-tight">DunkAI</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        {/* Share */}
        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all duration-300 active:scale-90">
          <Share2 className="w-4 h-4" />
        </Button>

        {/* Git */}
        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all duration-300 active:scale-90">
          <GitBranch className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all duration-300 active:scale-90">
          <Bell className="w-4 h-4" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all duration-300 active:scale-90">
          <Settings className="w-4 h-4" />
        </Button>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all duration-300 active:scale-90">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-foreground/10">
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-background/50 transition-colors">Export Design</DropdownMenuItem>
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-background/50 transition-colors">View History</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuItem className="text-sm cursor-pointer text-destructive hover:bg-destructive/10 transition-colors">Archive Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
