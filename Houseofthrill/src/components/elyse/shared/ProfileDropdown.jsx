import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSignOut = async () => {
    const result = await logout();
    setIsOpen(false);
    navigate(result?.success ? "/login" : "/");
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-[2.35rem] w-[2.35rem] lg:h-[2.6rem] lg:w-[2.6rem] rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white cursor-pointer"
        aria-label="Profile menu"
      >
        <User size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 rounded-xl bg-[#11100f]/95 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden z-50 text-white"
          >
            {!isAuthenticated ? (
              <div className="p-4 flex flex-col gap-3">
                <p className="text-sm text-gray-300 text-center mb-1">
                  Access your profile
                </p>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all cursor-pointer"
                >
                  Log In / Sign In
                </button>
              </div>
            ) : isAdmin ? (
              <div className="flex flex-col">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-amber-400 mt-0.5 uppercase font-bold tracking-wider">Admin Account</p>
                </div>
                <button
                  onClick={() => handleNavigation("/admin/dashboard")}
                  className="px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors w-full cursor-pointer font-medium"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-3 text-sm text-left text-red-400 hover:bg-white/10 transition-colors w-full cursor-pointer border-t border-white/10 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5 uppercase font-bold tracking-wider">User Account</p>
                </div>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors w-full cursor-pointer font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation("/terms")}
                  className="px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors w-full cursor-pointer font-medium"
                >
                  Terms and Policies
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-3 text-sm text-left text-red-400 hover:bg-white/10 transition-colors w-full cursor-pointer border-t border-white/10 font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
