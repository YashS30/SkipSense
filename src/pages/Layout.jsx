
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BarChart3, 
  Music, 
  TrendingUp, 
  Zap, 
  ListMusic,
  Mic,
  Settings,
  Upload
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Track Analysis",
    url: createPageUrl("TrackAnalysis"),
    icon: Music,
  },
  {
    title: "Playlist Optimizer",
    url: createPageUrl("PlaylistOptimizer"),
    icon: ListMusic,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: TrendingUp,
  },
  {
    title: "Artist Tools",
    url: createPageUrl("ArtistTools"),
    icon: Mic,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <style>{`
          :root {
            --primary: 280 100% 70%;
            --primary-foreground: 0 0% 98%;
            --secondary: 260 15% 15%;
            --secondary-foreground: 0 0% 98%;
            --accent: 280 100% 80%;
            --accent-foreground: 280 100% 10%;
            --background: 224 71% 4%;
            --foreground: 0 0% 98%;
            --card: 224 71% 4%;
            --card-foreground: 0 0% 98%;
            --border: 215 27% 17%;
            --input: 215 27% 17%;
            --ring: 280 100% 70%;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          .glass-effect {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .neon-glow {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          
          .waveform-animation {
            animation: waveform 2s ease-in-out infinite;
          }
          
          @keyframes waveform {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.5); }
          }
        `}</style>
        
        <Sidebar className="border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center neon-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">SkipSense</h2>
                <p className="text-xs text-purple-300">Music Skip Prediction</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-purple-500/20 hover:text-purple-200 transition-all duration-300 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-purple-500/30 text-purple-200 shadow-lg' : 'text-gray-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">Model Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Music className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Tracks Analyzed</span>
                    <span className="ml-auto font-semibold text-purple-200">0</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-pink-400" />
                    <span className="text-gray-300">Accuracy</span>
                    <span className="ml-auto font-semibold text-pink-200">94.2%</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">SkipSense AI</p>
                <p className="text-xs text-purple-300 truncate">Music Intelligence</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-white/10 p-2 rounded-lg transition-colors duration-200 text-white" />
              <h1 className="text-xl font-bold text-white">SkipSense</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
