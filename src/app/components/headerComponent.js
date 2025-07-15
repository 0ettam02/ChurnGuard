"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${backendUrl}/utenti_rischio`);
        if (!res.ok) throw new Error("Errore nel recupero notifiche");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Errore nel fetch delle notifiche:", err);
      }
    };

    fetchNotifications();
  }, [backendUrl]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setHasUnread(false);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href={"/"}>
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            ChurnGuard
          </div>
        </Link>

        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-white/80 hover:text-cyan-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
            Funzionalità
          </a>
          <a href="#pricing" className="text-white/80 hover:text-cyan-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
            Prezzi
          </a>
          <a href="#demo" className="text-white/80 hover:text-cyan-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
            Demo
          </a>
          <a href="#contact" className="text-white/80 hover:text-cyan-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
            Contatti
          </a>
        </div>

        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative text-white hover:text-cyan-400 transition-colors"
          >
            <BellIcon className="h-7 w-7" />
            {hasUnread && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg z-50">
              <div className="p-4 font-semibold border-b">Notifiche</div>
              {notifications.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 border-b last:border-none"
                    >
                      <Link href={`/gestioneUtenti?customer_id=${notif.customer_id}`}>
                        <span className="text-sm cursor-pointer hover:underline">
                          {notif.message}
                        </span>
                      </Link>

                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                        aria-label="Rimuovi notifica"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-gray-500">Nessuna notifica</div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
