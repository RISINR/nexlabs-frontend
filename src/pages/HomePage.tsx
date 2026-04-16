import { motion, useScroll, useSpring } from "framer-motion";
import NexLabsHomepage_Dev from "../imports/NexLabsHomepage_Dev";
import "../styles/homepage.css";

export default function HomePage() {
  // สร้าง Progress Bar ด้านบนสุดเพื่อความน่าสนใจ
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="w-full min-h-screen bg-[#ffffff] overflow-x-hidden flex flex-col items-center">
      {/* Scroll Progress Bar (ลูกเล่นแถม) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black z-[100] origin-left"
        style={{ scaleX }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full relative"
        style={{ minHeight: '100vh' }}
      >
        <NexLabsHomepage_Dev />
      </motion.div>
    </div>
  );
}