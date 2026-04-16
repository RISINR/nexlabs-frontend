import { motion, AnimatePresence } from "framer-motion";
import NexLabsHomepage from "../imports/NexLabsHomepage";
import { Navbar } from "./Navbar";

export default function NexLabsHomepageWithNav() {
  return (
    <div className="relative size-full">
      {/* 1. Navbar: ให้สไลด์ลงมาจากด้านบนตอนโหลดหน้าเว็บ */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50"
      >
        <Navbar />
      </motion.div>

      {/* 2. Main Content: ค่อยๆ Fade และ Scale ขึ้นเล็กน้อย */}
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2 // ให้ Navbar เริ่มก่อนนิดนึง
        }}
      >
        <NexLabsHomepage />
      </motion.main>

      {/* 3. ประยุกต์ใช้ Scroll Reveal (Optional แต่แนะนำ) */}
      {/* คุณสามารถเข้าไปใน NexLabsHomepage และหุ้ม Section ต่างๆ ด้วย 
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            ...content...
          </motion.section>
      */}
    </div>
  );
}