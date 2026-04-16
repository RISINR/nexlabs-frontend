import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/**
 * NexLabs_Homepage Component (Development Version)
 * 
 * This is a new development version of the NexLabs homepage.
 * Build and develop features here, then swap with the main homepage once complete.
 * 
 * Development Notes:
 * - Focus on UI/UX improvements
 * - Test new animation patterns
 * - Optimize performance
 * - Ensure mobile responsiveness
 */

export default function NexLabs_Homepage() {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <div className="relative w-full min-h-screen bg-white" data-name="NexLabs_Homepage_Dev">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full py-20 px-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-[600px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            Level Up Your Tech Profile
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Stand Out to Recruiters with AI-Powered Resume & Interview Coaching
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full hover:bg-blue-600 transition-colors"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </section>

      {/* ===== TAB SELECTOR SECTION ===== */}
      <section className="relative w-full py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-4 justify-center items-center"
          >
            {[1, 2, 3].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Step {tab}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative w-full py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl font-bold text-center mb-16 text-black"
          >
            Three Simple Steps to Tech Readiness
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Build & Audit",
                description: "Create or upload your resume with AI Co-Writer and get instant Readiness Score analysis.",
                icon: "📄",
              },
              {
                title: "Bridge the Gap",
                description: "Follow personalized recommendations to strengthen weak areas and build your tech skills.",
                icon: "🎯",
              },
              {
                title: "Ace the Interview",
                description: "Practice with AI Mock Interview simulations tailored to your target role.",
                icon: "🎙️",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="p-8 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-black">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative w-full py-20 px-6 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "20,000+", label: "Active Users" },
              { value: "92%", label: "Avg. Readiness" },
              { value: "150+", label: "Partner Companies" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative w-full py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6 text-black"
          >
            Ready to Transform Your Tech Career?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-700 mb-8"
          >
            Join thousands of students who've achieved their dream tech jobs
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-blue-500 text-white text-lg font-bold rounded-full hover:bg-blue-600 transition-colors"
          >
            Start Your Free Trial Now
          </motion.button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative w-full py-12 px-6 bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">NexLabs</h4>
              <p className="text-gray-400 text-sm">Empowering the next generation of tech talent</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Resume AI</a></li>
                <li><a href="#" className="hover:text-white transition">Interview AI</a></li>
                <li><a href="#" className="hover:text-white transition">Talent Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 NexLabs. All rights reserved. | "Promoting equal opportunity for every student"</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
