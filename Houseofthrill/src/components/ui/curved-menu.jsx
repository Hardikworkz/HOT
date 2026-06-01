"use client";
import { motion } from "framer-motion";
import { BsWhatsapp } from "react-icons/bs";


const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

const LINK_ANIMATION = {
  initial: { x: 80, opacity: 0 },
  enter: (i) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i) => ({
    x: 80,
    opacity: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

const NavLink = ({ heading, onClick, index }) => {
  return (
    <motion.div
      custom={index}
      variants={LINK_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      onClick={onClick}
      className="group relative flex items-center justify-center py-2 uppercase cursor-pointer"
    >
      <motion.span
        whileHover={{ scale: 1.05, letterSpacing: "0.15em" }}
        className="text-[clamp(1.5rem,4vw,2rem)] font-serif text-white tracking-[0.1em] transition-all duration-500 ease-out group-hover:text-white/70"
      >
        {heading}
      </motion.span>
    </motion.div>
  );
};

const Curve = () => {
  const initialPath = `M100 0 L200 0 L200 ${window.innerHeight} L100 ${window.innerHeight} Q-100 ${window.innerHeight / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${window.innerHeight} L100 ${window.innerHeight} Q100 ${window.innerHeight / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full fill-[#111212]">
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

const CurvedMenu = ({ items, onOpenProject, onVisit }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-[100dvh] w-screen max-w-sm fixed right-0 top-0 z-[45] bg-[#111212] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      {/* Header Section */}
      <div className="absolute top-10 left-0 w-full px-8 z-10">
        
       
      </div>

      <div className="h-full flex flex-col justify-center items-center relative">
        {/* Main Links Container */}
        <div className="flex flex-col items-center justify-center gap-4 w-full px-10">
          {items.map((item, index) => (
            <NavLink
              key={item.navLabel || index}
              index={index}
              heading={item.navLabel}
              onClick={(e) => onOpenProject(index, e.currentTarget)}
            />
          ))}
        </div>

        {/* Bottom Button Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute bottom-10 left-0 w-full px-8 flex gap-4 items-center"
        >
          <button 
            className="flex-1 bg-white !text-black py-4 rounded-full font-serif text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={onVisit}
          >
            Book a Visit
          </button>
          <button className="w-12 h-12 border-2 border-[#25D366] rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors shrink-0">
            <BsWhatsapp size={20} />
          </button>
        </motion.div>
      </div>
      <Curve />
    </motion.div>
  );
};

export default CurvedMenu;
