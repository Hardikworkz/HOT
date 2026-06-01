import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import CurvedMenu from "../../ui/curved-menu.jsx";
import { BurgerIcon } from "../shared/Icons.jsx";
import { LOGO_URL, LOGO_URL2 } from "../data.js";
import "./header-section.css";

function HeaderSection({ headerRef, menuOpen, onMenuToggle, onVisit }) {
  const desktopLinks = ["About", "Rooms", "Activities", "Reviews" ];

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const isMiniPage = location.pathname === "/mini";
  const showAdminProfile = !loading && isAuthenticated && isAdmin;

  const handleLinkClick = (linkName) => {
    if (linkName === "Mini H.O.T.") {
      if (isMiniPage) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/mini");
      }
    } else {
      const sectionMap = {
        "About": "about-section",
        "Rooms": "rooms-section",
        "Activities": "activities-section",
        "Reviews": "reviews-section",
      };
      const sectionId = sectionMap[linkName];
      if (sectionId) {
        if (!isMiniPage) {
          const target = document.getElementById(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          navigate(`/#${sectionId}`);
        }
      }
    }
    if (menuOpen) {
      onMenuToggle();
    }
  };

  const handleVisitClick = () => {
    if (typeof onVisit === 'function') {
      onVisit();
      return;
    }
    navigate("/book");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (menuOpen) return;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, menuOpen]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? "0%" : "-100%" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className="relative px-[clamp(0.95rem,3.2vw,3rem)]"
        data-hero="nav"
      >
        <div className="header-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,15,0.68),rgba(17,16,15,0))] opacity-0 transition-opacity duration-300" />

        {/* Desktop & Base Header Row */}
        <div className="mx-auto flex max-w-[104rem] items-center justify-between py-[15px] relative z-[60]">
           <div className="flex items-center gap-6">
              <a
                aria-label="THRILL logo"
                className="inline-flex h-[1.625rem] w-[5.875rem] items-center min-w-[90px] cursor-pointer border-r border-white pr-6"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                <img alt="THRILL logo" className="h-full w-full object-contain" src={LOGO_URL} />
              </a>

              <a
                aria-label="THRILL logo"
                className="inline-flex h-[1.625rem] w-[5.875rem] items-center min-w-[90px] cursor-pointer"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/mini");
                }}
              >
                <img alt="THRILL logo" className="h-full w-full object-contain" src={LOGO_URL2} />
              </a>
          </div>
          {/* Desktop Middle Links */}
          <ul className="hidden md:flex list-none items-center gap-[1.5rem] lg:gap-[2.2rem] p-0 absolute left-1/2 -translate-x-1/2 w-max max-w-[60vw] justify-center">
            {desktopLinks.map((link) => (
              <li key={link}>
                <button
                  className="nav-link relative bg-transparent p-0 text-[clamp(0.82rem,1.1vw,0.95rem)] font-bold uppercase tracking-[0.08em] [font-family:var(--font-body)] white-space-nowrap cursor-pointer"
                  type="button"
                  onClick={() => handleLinkClick(link)}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {showAdminProfile && (
              <Link
                to="/admin/dashboard"
                aria-label="Admin dashboard"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all duration-200 hover:bg-white/20 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <User size={18} strokeWidth={2.2} />
              </Link>
            )}

            {/* Desktop Book a Visit */}
            <button
              className="hidden md:block bg-white !text-black px-5 py-2 lg:px-6 lg:py-2 rounded-full text-[clamp(0.78rem,1vw,0.85rem)] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all whitespace-nowrap cursor-pointer"
              type="button"
              onClick={handleVisitClick}
            >
              Book a Visit
            </button>

            {/* Burger Icon (Mobile / Tablet Only) */}
            <button
              aria-expanded={menuOpen}
              aria-label="menu"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white md:hidden"
              type="button"
              onClick={onMenuToggle}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {/*
          Border line — plays the scaleX 0→1 reveal exactly once on page load.
          No key prop, no state dependency — Framer Motion only runs initial→animate
          on first mount, so this never re-triggers on scroll or re-renders.
        */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
          className="h-[2px] w-full bg-white relative z-[60] origin-center"
        />

        {/* Curved Mobile Menu */}
        <AnimatePresence mode="wait">
          {menuOpen && (
            <CurvedMenu
              items={desktopLinks.map((link) => ({ navLabel: link }))}
              onOpenProject={(index) => {
                const link = desktopLinks[index];
                handleLinkClick(link);
              }}
              onVisit={handleVisitClick}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default HeaderSection;

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
