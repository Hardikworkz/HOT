import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LineReveal from "../shared/LineReveal.jsx";
import { useAuth } from "../../../context/auth-context";
import './footer.css';
import { BsInstagram, BsWhatsapp } from "react-icons/bs";


gsap.registerPlugin(ScrollTrigger);

function FooterSection() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isLoggedIn = Boolean(user || isAuthenticated);

  const handleFooterAuthClick = () => {
    navigate(isLoggedIn ? "/welcome" : "/login");
  };

  useEffect(() => {
    const footer = document.querySelector('.elyse-footer');
    if (!footer) return;

    const ctx = gsap.context(() => {
      // Animate all text and border line reveals together
      gsap.to('.line-reveal-inner', {
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: footer,
          start: "top 90%",
        }
      });
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="elyse-footer">
      <div className="footer-top-section">
        
        {/* Desktop Full-Width Line (Hidden on mobile to match image) */}
        <div className="line-container desktop-only-line">
          <div className="line-reveal-inner line-bg"></div>
        </div>

        {/* Column 1: Brand */}
        <div className="footer-col col-brand">
          <div className="label-container">
            <LineReveal className="footer-label" lines={["(GET IN TOUCH)"]} />
          </div>
          
          {/* Mobile-only Line under GET IN TOUCH (Matches image exactly) */}
          <div className="line-container mobile-only-line">
            <div className="line-reveal-inner line-bg"></div>
          </div>

          <div className="content-container">
            <LineReveal as="h2" className="brand-title" lines={["HOUSE OF THRILL"]} />
          </div>
        </div>

        {/* Column 2: Location */}
        <div className="footer-col col-location">
          <div className="label-container">
            <LineReveal className="footer-label" lines={["(LOCATION)"]} />
          </div>
          <div className="content-container">
            <LineReveal href='https://www.google.com/maps/place/House+Of+Thrill/@23.2144,77.4291727,17z/data=!3m1!4b1!4m6!3m5!1s0x397c436cf54f7441:0xf4fcd58b7017fd33!8m2!3d23.2144!4d77.4317476!16s%2Fg%2F11yty38w_y?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D' as="p" className="location-text" lines={["E4/105, Near Vande Mataram Square, ", "Arera Colony, Bhopal, M.P."]} />
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-col col-contact">
          <div className="label-container">
            <LineReveal className="footer-label" lines={["(CONTACT)"]} />
          </div>
          <div className="content-container">
            <LineReveal as="p" className="contact-highlight" lines={["houseofthrillindia@gmail.com"]} />
            <LineReveal as="p" className="contact-highlight" lines={["+91 7987097199"]} />
            <div className="social flex gap-4 text-[clamp(1.4rem,1vw,1.1rem)]">
              <a href="https://www.instagram.com/houseofthrill_/" target="_blank" rel="noopener noreferrer" className="social-link">
                <BsInstagram />
              </a>
              <a href="https://wa.me/917987097199" target="_blank" rel="noopener noreferrer" className="social-link">
                <BsWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-section">
        {/* Bottom Divider */}
        <div className="line-container bottom-divider">
          <div className="line-reveal-inner line-bg"></div>
        </div>

        <div className="footer-bottom-content">
          <div className="bottom-left">
            &copy;HOUSE OF THRILL @ 2026 All rights reserved.
          </div>
          <div className="bottom-right-group">
            <button
              type="button"
              onClick={handleFooterAuthClick}
              className="cookie-link"
            >
              {isLoggedIn ? "Logout" : "Sign In"}
            </button>
            <a href="mailto:workzhardik@gmail.com" target="_blank" rel="noopener noreferrer" className="bottom-right">
              Made by ✳ HARDIK LALWANI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;