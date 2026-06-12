"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Pill, FileText, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Módulo 1", desc: "Identidades", href: "/modulo-1", icon: Users },
    { name: "Módulo 2", desc: "Trazabilidad", href: "/trazabilidad", icon: FileText },
    { name: "Módulo 3", desc: "Control de Stock", href: "/stock", icon: BarChart3 },
    { name: "Módulo 4", desc: "Dispensación", href: "/modulo-4", icon: Pill },
    { name: "Módulo 5", desc: "Auditoría", href: "/modulo-5", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#c41c1d] rounded-md flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div className="leading-tight">
            <h1 className="font-bold text-gray-900 text-sm">SITAF</h1>
            <p className="text-xs text-gray-500">Sistema de Trazabilidad</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 ml-1 mt-4">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Blockchain activa
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              <div className="flex flex-col">
                <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.name}
                </span>
                {item.desc && (
                  <span className={`text-xs ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                    {item.desc}
                  </span>
                )}
              </div>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#c41c1d] rounded-l-md" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          N
        </div>
      </div>
    </aside>
  );
}
