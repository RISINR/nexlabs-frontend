import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored =
      localStorage.getItem("nexlabs_user") ||
      sessionStorage.getItem("nexlabs_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // If user is a student and landed on /dashboard, redirect to student dashboard
        try {
          const pathname = typeof window !== "undefined" ? window.location.pathname : "";
          if (parsed?.role === "student" && pathname === "/dashboard") {
            navigate("/dashboard/student");
            return;
          }
        } catch {
          // ignore
        }
      } catch {
        setUser(null);
      }
    } else {
      // Not logged in → redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const displayName = user
    ? user.displayName ||
      `${(user.firstName || "").trim()} ${(user.lastName || "").trim()}`.trim() ||
      user.name ||
      "User"
    : "User";

  const makeAvatarDataUrl = (nameStr: string) => {
    const initials = (nameStr || "U")
      .split(" ")
      .map((s: string) => s.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='#1f2937' rx='64'/><text x='50%' y='50%' font-family='Poppins,Arial' font-size='52' fill='#ffffff' dominant-baseline='middle' text-anchor='middle'>${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const avatarSrc =
    user && user.avatar ? user.avatar : makeAvatarDataUrl(displayName);

  const tools = [
    {
      title: "Resume AI",
      description: "สร้างและแก้ไข Resume ด้วย AI ช่วยเขียนเนื้อหา",
      path: "/resume",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      cta: "เริ่มสร้าง Resume",
    },
    {
      title: "Interview AI",
      description: "ฝึกสัมภาษณ์งานกับ AI และรับ Feedback ทันที",
      path: "/interview",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      cta: "เริ่มฝึกสัมภาษณ์",
    },
  ];

  const quickLinks = [
    { label: "ตั้งค่าบัญชี", path: "/settings", icon: "⚙️" },
    { label: "ดู Resume ของฉัน", path: "/resumes", icon: "📄" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div
        className="max-w-5xl mx-auto px-6 py-10"
        style={{ paddingTop: "calc(var(--navbar-height, 72px) + 40px)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="h-16 w-16 rounded-full overflow-hidden shadow-md flex-shrink-0">
            <img
              src={avatarSrc}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-['Poppins']">ยินดีต้อนรับกลับมา 👋</p>
            <h1 className="text-2xl font-['Poppins'] font-semibold text-gray-900">
              {displayName}
            </h1>
            {user?.email && (
              <p className="text-sm text-gray-400 font-['Poppins'] mt-0.5">
                {user.email}
              </p>
            )}
          </div>
        </motion.div>

        {/* AI Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-sm font-['Poppins'] font-medium text-gray-400 uppercase tracking-widest mb-4">
            เครื่องมือ AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  to={tool.path}
                  className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div
                    className={`h-12 w-12 rounded-xl ${tool.bgLight} ${tool.textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-base font-['Poppins'] font-semibold text-gray-900 mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-['Poppins'] mb-4 flex-1">
                    {tool.description}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-['Poppins'] font-medium ${tool.textColor}`}
                  >
                    {tool.cta}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-sm font-['Poppins'] font-medium text-gray-400 uppercase tracking-widest mb-4">
            ลิงก์ด่วน
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((ql) => (
              <Link
                key={ql.path}
                to={ql.path}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-['Poppins'] text-gray-700 hover:shadow-md hover:text-black transition-all"
              >
                <span>{ql.icon}</span>
                {ql.label}
              </Link>
            ))}
            {user?.role === "university" && (
              <Link
                to="/university/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-['Poppins'] text-gray-700 hover:shadow-md hover:text-black transition-all"
              >
                <span>🏫</span>
                University Dashboard
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
