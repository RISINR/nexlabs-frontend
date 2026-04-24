import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ResumePreview from "../components/resume/ResumePreview";
import { Navbar } from "../components/Navbar";
import styles from "./NexLabsHomepage_Dev.module.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import logo1 from "../assets/images/logo1.png";
import logo2 from "../assets/images/logo2.png";
import logo3 from "../assets/images/logo3.png";
import logo4 from "../assets/images/logo4.png";
import logo5 from "../assets/images/logo5.png";
import { API_BASE_URL } from '../utils/apiBase';

/**
 * NexLabs Homepage Development Version
 * Clean, simple version for building new features
 * URL: /homepage-dev
 */

export default function NexLabs_HomepageDev() {
  const [activeTab, setActiveTab] = useState<number>(1);
  // start with video visible so it autoplays (muted) on load
  const [showVideo, setShowVideo] = useState<boolean>(true);
  // hero preview image controls (first image served from public/)
  const previewImages = ['/images/preivew1.png', logo2, logo3];
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [trustedUsersCount, setTrustedUsersCount] = useState<number | null>(null);
  const [trustedAvatars, setTrustedAvatars] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadTrustMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/trust-metrics`);
        if (!response.ok) {
          throw new Error('Failed to fetch trust metrics');
        }

        const payload = await response.json();
        const totalUsers = Number(payload?.data?.totalUsers || 0);
        const avatars = Array.isArray(payload?.data?.avatars)
          ? payload.data.avatars
              .map((avatar: unknown) => String(avatar || '').trim())
              .filter(Boolean)
          : [];

        if (!isMounted) return;

        setTrustedUsersCount(totalUsers);
        setTrustedAvatars(avatars.slice(0, 3));
      } catch (error) {
        if (!isMounted) return;
        setTrustedUsersCount(null);
        setTrustedAvatars([]);
      }
    };

    void loadTrustMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const trustedCountLabel = (trustedUsersCount ?? 20000).toLocaleString();

  const faqs = [
    {
      q: "I've never had an internship or job before — can the AI create a resume for me?",
      a: "Absolutely. NexLabs is built for students: our AI extracts skills from classroom projects, club activities, or even hobbies and converts them into professional STAR-format achievements that tech employers recognize."
    },
    {
      q: "If my Readiness Score is low, how will the system help me improve?",
      a: "Don't worry — the system provides a personalized \"Recommended Path\", such as suggested bootcamps, hackathons, or projects to close your skill gaps and raise your readiness score."
    },
    {
      q: "Is NexLabs paid? Will my resume data be secure?",
      a: "NexLabs offers a free starter plan, and we prioritize your privacy. Your data and PDF files are stored securely and used only to analyze and improve your profile."
    },
    {
      q: "What kind of questions will the AI Mock Interview ask?",
      a: "The AI analyzes your resume to generate targeted questions based on your experience, then gives immediate feedback on strengths and areas to improve so you can better impress real interviewers."
    }
  ];

  return (
    <div className={styles.pageContainer}>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <motion.section
        className={styles.heroSection}
        data-hero-section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Video background (place MP4 at public/videos/Curved_gradient_shape_moving_e3b322e4ac.mp4) */}
        <video
          className={styles.heroVideo}
          src="/videos/Curved_gradient_shape_moving_e3b322e4ac.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.heroVideoOverlay} aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          {/* Trust Badge */}
          <motion.div 
            className={styles.trustBadge}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.avatarGroup}>
              {[0, 1, 2].map((index) => {
                const avatarSrc = trustedAvatars[index];
                return (
                  <div className={styles.avatar} key={`trust-avatar-${index}`}>
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="NexLabs user"
                        className={styles.avatarImage}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <span className={styles.trustText}>Trusted by {trustedCountLabel} Users</span>
          </motion.div>

          <h1 className={styles.heroTitle}>
            Level Up Your Tech Profile<br />Stand Out to Recruiters
          </h1>
          <p className={styles.heroSubtitle}>
            Practice interviews and upgrade your resume with AI agents trained on expert hiring logic, connecting your potential to global tech standards.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.heroButton}
          >
            Start Free
          </motion.button>
        </motion.div>

        {/* Hero preview card: shows a sample resume preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={styles.heroPreviewBox}
        >
          <div className={styles.previewCard}>
            <AnimatePresence mode="wait">
              {previewImages[previewIndex] ? (
                <motion.img
                  key={previewImages[previewIndex]}
                  className={styles.previewCardImage}
                  src={previewImages[previewIndex]}
                  alt={`preview-${previewIndex}`}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              ) : (
                <ResumePreview scale={0.9} showExample />
              )}
            </AnimatePresence>
          </div>

          <div className={styles.previewControls} aria-hidden>
            {previewImages.map((src, i) => (
              <button
                key={i}
                className={`${styles.controlBtn} ${previewIndex === i ? styles.activeControl : ""}`}
                onClick={() => setPreviewIndex(i)}
                aria-label={`Select preview ${i + 1}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke={previewIndex === i ? '#2563eb' : '#e5e7eb'} strokeWidth="1.5" fill={previewIndex === i ? '#f0f9ff' : '#fafafa'} />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.section>

      

      {/* LOGO MARQUEE (replaces Step 1/2/3) */}
      <motion.section
        className={styles.tabsSection}
        aria-hidden
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.logoMarquee}>
          <div className={styles.logoTrack}>
            {[logo1, logo2, logo3, logo4, logo5, logo1, logo2, logo3, logo4, logo5].map((src, i) => (
              <div className={styles.logoItem} key={i}>
                <img src={src} alt={`partner-${i}`} />
              </div>
            ))}
              </div>
            </div>
          </motion.section>

      {/* SHOWREEL TWO-COLUMN SECTION */}
      <motion.section
        className={styles.showreelSection}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        <div className={styles.showreelContainer}>
          <div className={styles.mediaCard}>
            <div className={styles.mediaThumb}>
                {!showVideo ? (
                  <>
                    <img src={logo1} alt="showreel-thumb" />
                    <button
                      className={styles.playButton}
                      aria-label="Play showreel"
                      onClick={() => setShowVideo(true)}
                    >
                      ▶
                    </button>
                  </>
                ) : (
                  <iframe
                    title="NexLabs Showreel"
                    src="https://www.youtube.com/embed/mmQcX6HpCGs?autoplay=1&mute=1&rel=0"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    frameBorder="0"
                    allowFullScreen
                  />
                )}
              </div>
            <div className={styles.mediaCaption}>NexLabs Showreel</div>
          </div>

          <div className={styles.showreelTextCol}>
            <motion.h2
              className={styles.showreelTitle}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Crafting Your Story Together.
            </motion.h2>

            <motion.p
              className={styles.showreelText}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              We know beginning your career is exciting but can also feel uncertain. NexLabs was created to bring intention and opportunity together. We combine thoughtful design with intelligent AI to help you showcase your work and achievements in the best possible light.
            </motion.p>

            <motion.p
              className={styles.showreelText}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Our mission is to turn doubt into readiness, so you can grow toward your goals and the career you aspire to with confidence.
            </motion.p>

            <motion.button
              className={styles.aboutButton}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              About us
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* TURN UNCERTAINTY -> TECH READINESS SECTION */}
      <motion.section
        className={styles.readinessSection}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.readinessContainer}>
          <h2 className={styles.readinessTitle}>Turn Uncertainty Into Measurable Tech Readiness</h2>

          <motion.p
            className={`${styles.showreelText} ${styles.readinessIntro}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            We know beginning your career is exciting but can also feel uncertain. NexLabs was created to bring intention and opportunity together. We combine thoughtful design with intelligent AI to help you showcase your work and achievements in the best possible light.
          </motion.p>

          <div className={styles.readinessGrid}>
            {[{
              num: '01',
                title: 'Build & Audit',
                desc: 'Create your resume with our expert AI Co-Writer to get a Readiness Score and instant analysis of your preparedness.'
            },{
                num: '02',
                title: 'Bridge the Gap',
                desc: 'Receive a clear Recommended Path with targeted skill practice and curated learning resources tailored to your goals.'
            },{
                num: '03',
                title: 'Ace the Interview',
                desc: 'Practice real interview scenarios with personalized feedback to help you present your work with confidence.'
            }].map((card, i) => (
              <article className={styles.readinessCard} key={i} aria-labelledby={`readiness-${i}-title`}>
                <div className={styles.readinessCardHeader}>
                  <div className={styles.iconWrap} aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#e5e7eb" strokeWidth="1.5" fill="#f8fafc"/>
                      <path d="M7 12h10M7 8h4" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.readinessNumber}>{card.num}</div>
                </div>

                <h3 id={`readiness-${i}-title`} className={styles.readinessCardTitle}>{card.title}</h3>
                <p className={styles.readinessCardDesc}>{card.desc}</p>

                <div className={styles.readinessImageWrap}>
                  <div className={styles.readinessImagePlaceholder} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats + CTA removed by request */}

      {/* LEADERBOARD SECTION */}
      <motion.section
        className={styles.leaderboardSection}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.leaderboardContainer}>
          <div className={styles.leaderHeader}>
            <div className={styles.leaderProfile}>
              <div className={styles.lpAvatar} aria-hidden />
              <div>
                <div className={styles.lpName}>DreamThanawat</div>
                <div className={styles.lpRole}>UX/UI Designer</div>
              </div>
            </div>

            <div className={styles.leaderActions}>
              <div className={styles.leaderNote}>Want to see your name on this leaderboard?</div>
              <button className={styles.startTrial}>Start Free Trial</button>
            </div>
          </div>

          <div className={styles.topCards}>
            {[{
              pos: 1, name: 'DreamThanawat', role: 'UX/UI Designer', score: 96
            },{
              pos: 2, name: 'SunPongsakorn', role: 'Backend Developer', score: 96
            },{
              pos: 3, name: 'DreamThanawat', role: 'UX/UI Designer', score: 94
            }].map((p, i) => (
              <div className={styles.topCard} key={i}>
                <div className={styles.topCardHeader}>
                  <div className={styles.trophy}>{p.pos}</div>
                  <div className={styles.topScore}>{p.score}</div>
                </div>
                <div className={styles.topCardBody}>
                  <div className={styles.tcAvatar} />
                  <div>
                    <div className={styles.tcName}>{p.name}</div>
                    <div className={styles.tcRole}>{p.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.leaderTableWrap}>
            <div className={styles.leaderTableHead}>
              <div>Rank</div>
              <div>User</div>
              <div>Target Position</div>
              <div>Tech Stack</div>
              <div>Score</div>
            </div>

            {[4,5,6,7,8,9,10,11,12].map((rank) => (
              <div className={styles.leaderRow} key={rank}>
                <div className={styles.rankCell}>{rank}</div>
                <div className={styles.userCell}>
                  <div className={styles.rowAvatar} />
                  <div className={styles.rowName}>Lorem Lorem</div>
                </div>
                <div className={styles.positionCell}>Backend Engineer</div>
                <div className={styles.techCell}>
                  <span className={styles.badge}>Python</span>
                  <span className={styles.badge}>Go</span>
                  <span className={styles.badge}>Next.js</span>
                </div>
                <div className={styles.scoreCell}>{88 - (rank - 4) * 2}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PRACTICE / MOCK INTERVIEW SECTION (moved below leaderboard) */}
      <motion.section
        className={styles.practiceSection}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.75 }}
      >
        <div className={styles.practiceContainer}>
          <div className={styles.practicePanel}>
            <div className={styles.practiceHeader}>
              <h2 className={styles.practiceTitle}>Practice Like It's the Real Day</h2>
              <button className={styles.practiceButton}>Start Mock Interview Now</button>
            </div>

            <p className={styles.practiceSubtitle}>
              We know beginning your career is exciting but can also feel uncertain. NexLabs was created to bring intention and opportunity together.
            </p>

            <div className={styles.practiceCards}>
              {[{
                title: 'Choose your target role',
                desc: 'AI can generate industry-specific technical questions.'
              },{
                title: 'Start the Live Simulation',
                desc: 'Enter a realistic video call environment where our AI interviewer asks questions in real-time.'
              },{
                title: 'Receive Deep Insights & Scoring',
                desc: 'Get an instant Ready Score along with a detailed summary of your performance.'
              }].map((c, i) => (
                <div className={styles.practiceCard} key={i}>
                  <h4 className={styles.practiceCardTitle}>{c.title}</h4>
                  <p className={styles.practiceCardDesc}>{c.desc}</p>
                  <div className={styles.practicePlaceholder} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section
        className={styles.faqSection}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle}>FAQ</h2>

          <div className={styles.faqList}>
            {faqs.map((f, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-${i}-answer`}
                >
                  {f.q}
                </button>

                <AnimatePresence initial={false} mode="wait">
                  {openFaq === i && (
                    <motion.div
                      id={`faq-${i}-answer`}
                      className={styles.faqAnswer}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.32, ease: 'easeOut' }}
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* COMMUNITY / COMMENTS SECTION */}
      <motion.section
        className={styles.communitySection}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
      >
        <div className={styles.communityContainer}>
          <h2 className={styles.communityTitle}>Join the NexLabs Community.</h2>

          <div className={styles.communityGrid}>
            <div className={styles.commCard}>
              <div className={styles.commHeader}>
                <div className={styles.commAvatar} />
                <div>
                  <div className={styles.commName}>Somchai Dev</div>
                  <div className={styles.commRole}>Computer Engineering Student</div>
                  <div className={styles.commScore}>Ready Score : 92% Ready</div>
                </div>
              </div>
              <blockquote className={styles.commQuote}>
                "No more writer's block!"
                <p>
                  "The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"
                </p>
              </blockquote>
            </div>

            {[{
              name: 'Kanya Design', role: 'UX/UI Design Aspirant', score: '88% Ready', quote: 'Felt like a real tech interview. The AI Mock Interview was so realistic. It asked tough questions about my design'
            },{
              name: 'Somchai Dev', role: 'Computer Engineering Student', score: '92% Ready', quote: 'No more writer\'s block! The AI Co-Writer is incredible.'
            },{
              name: 'Kanya Design', role: 'UX/UI Design Aspirant', score: '88% Ready', quote: 'Felt like a real tech interview.'
            },{
              name: 'Somchai Dev', role: 'Computer Engineering Student', score: '92% Ready', quote: 'The AI Co-Writer turned my messy notes into professional bullet points.'
            },{
              name: 'Kanya Design', role: 'UX/UI Design Aspirant', score: '88% Ready', quote: 'The mock interview highlighted areas I needed to practice and boosted my confidence.'
            }].map((u, i) => (
              <div className={styles.commCard} key={i}>
                <div className={styles.commHeader}>
                  <div className={styles.commAvatar} />
                  <div>
                    <div className={styles.commName}>{u.name}</div>
                    <div className={styles.commRole}>{u.role}</div>
                    <div className={styles.commScore}>Ready Score : {u.score}</div>
                  </div>
                </div>
                <div className={styles.commQuote}>
                  "{u.quote}"
                </div>
              </div>
            ))}
          </div>

          <div className={styles.communityPager}>
            <button className={styles.pagerBtn} aria-label="Prev">←</button>
            <button className={styles.pagerBtnPrimary} aria-label="Next">→</button>
          </div>
        </div>
      </motion.section>

      {/* PARTNERS / PARTNERSHIP SECTION */}
      <motion.section
        className={styles.partnerSection}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
      >
        <div className={styles.partnerInner}>
          <div className={styles.partnerRow}>
            <div className={styles.partnerLeft}>
              <h2 className={styles.partnerTitle}>Benefits for Equal Opportunity For Students</h2>
              <p className={styles.partnerDesc}>
                Join our mission to bridge the gap between education and employment by providing equal career opportunities for all students through advanced AI technology.
              </p>
              <button className={styles.partnerCTA}>Partner With Us</button>
            </div>

            <div className={styles.partnerRight}>
              <div className={styles.partnerGrid}>
                {[logo1, logo2, logo3, logo4, logo5, logo1].map((src, i) => (
                  <div className={styles.partnerCard} key={i}>
                    <img src={src} alt={`partner-${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.brandLogo}>NexLabs</div>
              <p className={styles.brandTag}>Empowering the next generation of tech talent with AI-driven readiness.</p>
            </div>

            <div className={styles.footerCols}>
              <div className={styles.footerCol}>
                <h5>Solution</h5>
                <ul>
                  <li><a href="#">Resume AI</a></li>
                  <li><a href="#">Interview AI</a></li>
                  <li><a href="#">Talent Insights</a></li>
                </ul>
              </div>

              <div className={styles.footerCol}>
                <h5>Partnerships & Support</h5>
                <ul>
                  <li><a href="#">Academic Partners</a></li>
                  <li><a href="#">For Employers</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>

              <div className={styles.footerCol}>
                <h5>Community</h5>
                <p className={styles.footerCommunityQuote}>
                  "Everything fits, lives together and joins the Tech community".
                </p>
                <div className={styles.socialIcons}>
                  <a className={styles.socialBtn} aria-label="facebook" href="#" title="Facebook"><FaFacebookF size={16} /></a>
                  <a className={styles.socialBtn} aria-label="instagram" href="#" title="Instagram"><FaInstagram size={16} /></a>
                  <a className={styles.socialBtn} aria-label="twitter" href="#" title="Twitter"><FaTwitter size={16} /></a>
                  <a className={styles.socialBtn} aria-label="youtube" href="#" title="YouTube"><FaYoutube size={16} /></a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footerBottomRow}>
            <div className={styles.fbLeft}>&copy; 2026 NexLabs. All rights reserved.</div>
            <div className={styles.fbCenter}>Privacy Policy | Terms of Service</div>
            <div className={styles.fbRight}>&quot;Promoting equal opportunity for every student&quot;.</div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
