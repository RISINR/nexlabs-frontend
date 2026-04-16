import { motion, AnimatePresence } from "framer-motion"; 
import { useState } from "react";

import svgPaths from "./svg-248lucna9q";
import imgRectangle6 from "figma:asset/5fd5904387f8e8c8b1aaf445b1f99f578e5acd50.png";
import imgEllipse1 from "figma:asset/29717b0b2d8d893e830e50f9df4ae4a3f71b3c63.png";
import imgEllipse2 from "figma:asset/7032ea49d3b318c4570c28f6ca1396f9fff66bfc.png";
import imgEllipse3 from "figma:asset/995de9b45a9db6ad6cc2a558c600ec2e360454a1.png";
import imgSilpakornUniversityLogo021 from "figma:asset/60d20ffc76852bce8dfd8317b9a6e38056b0108e.png";
import imgPageHeaderLogoImageThTh1 from "figma:asset/cfe6565b0482ae902adde1b2b1105efc9c3c4d4b.png";
import imgGeminiGeneratedImageLxlcjmlxlcjmlxlcRemovebgPreview2 from "figma:asset/9adecb246876ba698a20b430e3c8375c6a32b3c1.png";
import imgEllipse46 from "figma:asset/ac47a7059fcc118a4576c932dd330f0b13c7a7cf.png";
import imgEllipse47 from "figma:asset/1a92b4f5eb9d5a1dbba3ed57068414e0e00e514d.png";
import imgRectangle158 from "figma:asset/39e4d2623a332d361674cd31951a631f0e36aeaa.png";
import imgRectangle163 from "figma:asset/6f4149fcd45e95b1398c83b08d150275129fd818.png";
import imgEllipse68 from "figma:asset/2db11614db9d1b6c50f1af3844ef42d3715a87a3.png";
import imgEllipse70 from "figma:asset/eb9e06ed3771bac6ca731aa766c80f058c2b10aa.png";
import imgEllipse71 from "figma:asset/c047952be97ba924e846b4405484507111b76147.png";
import imgNexLabsHomepage from "figma:asset/677484dbecdb6f1fadb2587ef9ead8d3a9e9898d.png";
import imgRectangle161 from "figma:asset/38b00ee2123f5b373c30e7ae903abbb289f416cd.png";
import { imgCircle } from "./svg-1cpca";
import logo1 from "../assets/images/logo1.png";
import logo2 from "../assets/images/logo2.png";
import logo3 from "../assets/images/logo3.png";
import logo4 from "../assets/images/logo4.png";
import logo5 from "../assets/images/logo5.png";



function Group70() {
  return (
    <div className="absolute h-[1131px] left-0 top-0 w-[1728px]">
      <div className="absolute inset-[-11.01%_-7.2%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1977 1380"
        >
          <g id="Group-71-Orbit" className="opacity-90">
            {/* วงที่ 1: สีกรมเข้ม (Deep Blue) */}
            <ellipse
              cx="900"
              cy="750"
              rx="600"
              ry="450"
              fill="#0D4C92"
              fillOpacity="0.8"
              className="bg-blur-thick animate-orbit-fast"
            />

            {/* วงที่ 2: สีฟ้าสด (Cyan) - วิ่งไล่ตามวงแรก */}
            <ellipse
              cx="1050"
              cy="750"
              rx="600"
              ry="600"
              fill="#59A5D8"
              fillOpacity="0.7"
              className="bg-blur-thick animate-orbit-fast [animation-delay:-2.5s]"
            />

            {/* วงที่ 3: สีฟ้าสว่าง (Light Blue) - วิ่งไล่ตามวงสอง */}
            <ellipse
              cx="950"
              cy="450"
              rx="500"
              ry="350"
              fill="#B6E4F0"
              fillOpacity="0.6"
              className="bg-blur-thick animate-orbit-fast [animation-delay:-5s]"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function S() {
  return (
    <div className="absolute h-[1131px] left-0 top-[514px] w-[1728px]" data-name="s1">
      <Group70 />
    </div>
  );
}

function Frame2({ activeTab }: { activeTab?: number }) {
  const src = activeTab === 2 ? imgRectangle161 : activeTab === 3 ? imgRectangle163 : imgRectangle6;

  return (
    <div className="-translate-x-1/2 absolute bg-white h-[1198px] left-1/2 overflow-clip top-0 w-[1728px]">
      <S />
      <div className="absolute h-[1265px] left-0 top-0 w-[1728px]" data-name="v904-nunny-025 1" />
      <div className="-translate-x-1/2 absolute h-[561px] left-1/2 pointer-events-none rounded-[10px] top-[748px] w-[1068px]">
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.img
                src={src}
                alt=""
                className="absolute h-[344.13%] left-[-14.04%] max-w-none top-[-27.5%] w-[126.87%]"
                draggable={false}
              />

              {/* border moved inside keyed wrapper so it animates with the image */}
              <div aria-hidden="true" className="absolute border-[1.5px] border-solid border-white inset-[-1.5px] rounded-[11.5px]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Group100() {
  return (
    <button
      className="cta-btn"
      style={{
        position: "absolute",
        left: "calc(41.67% + 25px)",
        top: "560px",
        width: "238px",
        height: "52px",
        borderRadius: "24.5px",
      }}
    >
      Start Free
    </button>
  );
}
function Group102() {
  return (
    <div className="absolute contents left-[calc(41.67%+25px)] top-[560px]">
      <Group100 />
    </div>
  );
}




function Group103({ activeTab, setActiveTab }: { activeTab: number, setActiveTab: (id: number) => void }) {
  return (
    <div className="absolute h-[98px] left-[calc(83.33%+6px)] top-[748px] w-[36.344px]">
      {/* 1. พื้นหลังแคปซูลใส */}
      <div className="absolute bg-[rgba(255,255,255,0.4)] inset-0 rounded-[25.96px] backdrop-blur-sm" />
      
      {/* 2. วงกลมสีขาว (Indicator) - ใช้ motion เพื่อให้สไลด์ไปมาตามตำแหน่งเดิมเป๊ะๆ */}
      <motion.div 
        className="absolute w-[31.8px] h-[29.85px] left-[2px]"
        animate={{ 
          top: activeTab === 1 ? "4px" : activeTab === 2 ? "34px" : "64px" 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <svg className="block size-full" viewBox="0 0 31.8013 29.8543">
          <ellipse cx="15.9007" cy="14.9272" fill="white" rx="15.9007" ry="14.9272" />
        </svg>
      </motion.div>

      {/* 3. ปุ่มที่ 1 (บน) */}
      <button
        onClick={() => setActiveTab(1)}
        aria-pressed={activeTab === 1}
        title="Step 1"
        className="absolute inset-[12.58%_28.57%_78.15%_30.36%] z-10 border-none bg-transparent p-0 cursor-pointer"
      >
        <motion.div
          className="block size-full"
          animate={activeTab === 1 ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg preserveAspectRatio="none" viewBox="0 0 14.9272 9.08609">
            <path d={svgPaths.p2193f400} fill={activeTab === 1 ? "#3B82F6" : "#8B8581"} />
          </svg>
        </motion.div>
      </button>

      {/* 4. ปุ่มที่ 2 (กลาง) */}
      <button
        onClick={() => setActiveTab(2)}
        aria-pressed={activeTab === 2}
        title="Step 2"
        className="absolute inset-[43.05%_26.79%_42.38%_30.36%] z-10 border-none bg-transparent p-0 cursor-pointer"
      >
        <motion.div
          className="block size-full"
          animate={activeTab === 2 ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg preserveAspectRatio="none" viewBox="0 0 15.5762 14.2781">
            <path d={svgPaths.p188b5800} fill={activeTab === 2 ? "#3B82F6" : "#8B8581"} />
          </svg>
        </motion.div>
      </button>

      {/* 5. ปุ่มที่ 3 (ล่าง) */}
      <button
        onClick={() => setActiveTab(3)}
        aria-pressed={activeTab === 3}
        title="Step 3"
        className="absolute inset-[72.19%_32.14%_15.89%_35.72%] z-10 border-none bg-transparent p-0 cursor-pointer"
      >
        <motion.div className="absolute inset-[-5.56%]"
          animate={activeTab === 3 ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg preserveAspectRatio="none" viewBox="0 0 12.9801 12.9801">
            <path d={svgPaths.p3f4d3380} fill={activeTab === 3 ? "#3B82F6" : "#8B8581"} />
          </svg>
        </motion.div>
      </button>
    </div>
  );
}

function Group120() {
  return (
    <div className="absolute contents left-[calc(41.67%+1px)] top-[245px]">
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[27px] leading-[84.06999969482422%] left-[calc(41.67%+82px)] not-italic text-[16px] text-black top-[250px] w-[203px] whitespace-pre-wrap">Trusted by 20,000+ Users</p>
      <div className="absolute h-[32px] left-[calc(41.67%+1px)] top-[245px] w-[33px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse1} width="33" />
      </div>
      <div className="absolute h-[32px] left-[calc(41.67%+20px)] top-[245px] w-[33px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse2} width="33" />
      </div>
      <div className="absolute h-[32px] left-[calc(41.67%+39px)] top-[245px] w-[33px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse3} width="33" />
      </div>
    </div>
  );
}

function Group119() {
  return (
    <div className="absolute contents left-[calc(41.67%+1px)] top-[245px]">
      <Group120 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[calc(41.67%+1px)] top-[245px]">
      <Group119 />
    </div>
  );
}

function Group1() {
  // สร้าง Class สำหรับโลโก้สีดำไว้ใช้ซ้ำ
  const logoStyle = "absolute inset-0 max-w-none object-cover pointer-events-none size-full grayscale brightness-0 opacity-40 hover:opacity-100 transition-all";

  return (
    <div className="absolute contents left-[-8.26%] right-[7.94%] top-[-1.23px]">
      {/* โลโก้ที่ 1 */}
      <div className="absolute aspect-[400/400] left-[-8.26%] right-[99.98%] top-[-1.23px]">
        <img alt="" className={logoStyle} src={imgSilpakornUniversityLogo021} />
      </div>

      {/* โลโก้ที่ 2 */}
      <div className="absolute aspect-[1250/417] left-[1.97%] right-[83.6%] top-[12.97px]">
        <img alt="" className={logoStyle} src={imgPageHeaderLogoImageThTh1} />
      </div>

      {/* โลโก้ที่ 3 */}
      <div className="absolute aspect-[400/400] left-[16.34%] right-[75.38%] top-[-1.23px]">
        <img alt="" className={logoStyle} src={imgSilpakornUniversityLogo021} />
      </div>

      {/* โลโก้ที่ 4 */}
      <div className="absolute aspect-[1250/417] left-[26.57%] right-[59%] top-[12.97px]">
        <img alt="" className={logoStyle} src={imgPageHeaderLogoImageThTh1} />
      </div>

      {/* โลโก้ที่ 5 */}
      <div className="absolute aspect-[400/400] left-[40.94%] right-[50.78%] top-[-1.23px]">
        <img alt="" className={logoStyle} src={imgSilpakornUniversityLogo021} />
      </div>

      {/* โลโก้ที่ 6 */}
      <div className="absolute aspect-[1250/417] left-[51.16%] right-[34.41%] top-[12.97px]">
        <img alt="" className={logoStyle} src={imgPageHeaderLogoImageThTh1} />
      </div>

      {/* โลโก้ที่ 7 */}
      <div className="absolute aspect-[400/400] left-[67.47%] right-[24.25%] top-[-1.23px]">
        <img alt="" className={logoStyle} src={imgSilpakornUniversityLogo021} />
      </div>

      {/* โลโก้ที่ 8 */}
      <div className="absolute aspect-[1250/417] left-[77.63%] right-[7.94%] top-[12.97px]">
        <img alt="" className={logoStyle} src={imgPageHeaderLogoImageThTh1} />
      </div>
    </div>
  );
}
function Group3() {
  return (
    <div className="absolute contents left-[597px] top-[-1.23px]">
      <div className="absolute left-[597px] size-[53.156px] top-[-1.23px]" data-name="Silpakorn_University_Logo_02 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute h-[30.913px] left-[662.64px] top-[12.97px] w-[92.664px]" data-name="pageHeaderLogoImage_th_TH 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPageHeaderLogoImageThTh1} />
      </div>
      <div className="absolute left-[754.9px] size-[53.156px] top-[-1.23px]" data-name="Silpakorn_University_Logo_02 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute h-[30.913px] left-[820.55px] top-[12.97px] w-[92.664px]" data-name="pageHeaderLogoImage_th_TH 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPageHeaderLogoImageThTh1} />
      </div>
      <div className="absolute left-[912.81px] size-[53.156px] top-[-1.23px]" data-name="Silpakorn_University_Logo_02 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute h-[30.913px] left-[978.45px] top-[12.97px] w-[92.664px]" data-name="pageHeaderLogoImage_th_TH 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPageHeaderLogoImageThTh1} />
      </div>
      <div className="absolute left-[1083.13px] size-[53.156px] top-[-1.23px]" data-name="Silpakorn_University_Logo_02 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute h-[30.913px] left-[1148.37px] top-[12.97px] w-[92.664px]" data-name="pageHeaderLogoImage_th_TH 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPageHeaderLogoImageThTh1} />
      </div>
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute contents left-[-53px] top-[-1.23px]">
      <Group1 />
      <Group3 />
    </div>
  );
}

function Group2() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+273.02px)] top-[-3px]">
      <Group44 />
      <div className="absolute bg-gradient-to-l from-[rgba(241,241,241,0)] inset-[-5.77%_83.42%_0_0] to-[71.635%] to-white" />
      <div className="absolute flex inset-[-5.77%_-0.32%_0_83.74%] items-center justify-center">
        <div className="flex-none h-[55px] rotate-180 w-[106.452px]">
          <div className="bg-gradient-to-l from-[rgba(241,241,241,0)] size-full to-[68.269%] to-white" />
        </div>
      </div>
    </div>
  );
}

export function Sd() {
  const logos = [
    logo1, 
    logo2,
    logo3,
    logo4,
    logo5
  ];
  
  return (
    <div 
      className="-translate-x-1/2 absolute bg-white h-[48px] left-1/2 overflow-hidden top-[1294px] w-[642px] flex items-center" 
      data-name="sd"
    >
      {/* ส่วนเงา Fade ขอบซ้าย-ขวา */}
      <div className="absolute inset-0 z-20 pointer-events-none flex justify-between">
        <div className="w-16 h-full bg-gradient-to-r from-white to-transparent" />
        <div className="w-16 h-full bg-gradient-to-l from-white to-transparent" />
      </div>

      <motion.div 
        className="flex items-center gap-10 px-6" // ลดช่องไฟลงจาก 14 เป็น 10
        animate={{
          x: [0, "-50%"], 
        }}
        transition={{
          duration: 20, 
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...logos, ...logos].map((src, index) => (
          <div key={index} className="flex-shrink-0 flex items-center justify-center w-[90px]"> {/* ลดความกว้างกรอบจาก 120px เป็น 90px */}
            <img 
              src={src}
              alt="partner"
              // ปรับขนาดเล็กลง: h-6 (24px)
              className="h-8 w-auto object-contain grayscale contrast-[200%] brightness-0 opacity-40 hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Group104() {
  return (
    <div className="absolute h-[691.876px] left-[calc(16.67%+125px)] top-[2245px] w-[854.785px]">
      <div className="absolute inset-[-17.99%_-14.57%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1103.78 940.876">
          <g id="Group 105">
            {/* วงที่ 1: เปลี่ยนจากชมพู เป็น สีกรมเข้ม (#0D4C92) */}
            <g filter="url(#filter0_f_1_4083)" id="Ellipse 8">
              <circle cx="756.459" cy="563.178" fill="#0D4C92" fillOpacity="0.5" r="194.192" />
            </g>
            
            {/* วงที่ 2: เปลี่ยนจากส้ม เป็น สีฟ้าสด (#59A5D8) */}
            <g filter="url(#filter1_f_1_4083)" id="Ellipse 6">
              <circle cx="676.892" cy="426.892" fill="#59A5D8" fillOpacity="0.4" r="302.392" />
            </g>
            
            {/* วงที่ 3: เปลี่ยนจากน้ำเงินเดิม เป็น สีฟ้าสว่าง (#B6E4F0) */}
            <g filter="url(#filter2_f_1_4083)" id="Ellipse 7">
              <circle cx="440.438" cy="500.438" fill="#B6E4F0" fillOpacity="0.4" r="315.938" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="637.384" id="filter0_f_1_4083" width="637.384" x="437.768" y="244.486">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_4083" stdDeviation="80" /> {/* เพิ่ม Blur ให้ฟุ้งขึ้น */}
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="853.785" id="filter1_f_1_4083" width="853.785" x="250" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_4083" stdDeviation="90" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="880.876" id="filter2_f_1_4083" width="880.876" x="0" y="60">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_4083" stdDeviation="90" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group71() {
  return (
    <div className="absolute h-[1131px] left-0 top-0 w-[1728px]">
      <div className="absolute inset-[-11.01%_-7.2%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1977 1380">
          <g id="Group 71">
            <g filter="url(#filter0_f_1_3978)" id="Ellipse 8">
              <ellipse cx="947.175" cy="600.055" fill="var(--fill-0, #D6EFF6)" rx="614.519" ry="475.555" />
            </g>
            <g filter="url(#filter1_f_1_3978)" id="Ellipse 6">
              <ellipse cx="1267.83" cy="773.577" fill="var(--fill-0, #1F68B2)" fillOpacity="0.5" rx="584.673" ry="452.459" />
            </g>
            <g filter="url(#filter2_f_1_3978)" id="Ellipse 7">
              <ellipse cx="717.591" cy="796.527" fill="var(--fill-0, #7CBEDF)" fillOpacity="0.6" rx="593.091" ry="458.973" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1200.11" id="filter0_f_1_3978" width="1478.04" x="208.156" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_3978" stdDeviation="62.25" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1153.92" id="filter1_f_1_3978" width="1418.35" x="558.653" y="196.618">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_3978" stdDeviation="62.25" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1166.95" id="filter2_f_1_3978" width="1435.18" x="0" y="213.054">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_3978" stdDeviation="62.25" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function S1() {
  return (
    <div className="absolute h-[773px] left-[12px] top-[171px] w-[1728px]" data-name="s1">
      <Group71 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white h-[891px] left-0 overflow-clip top-[7803px] w-[1728px]" data-name="Frame">
      <S1 />
    </div>
  );
}

function Group72() {
  return (
    <div className="absolute contents left-[968px] top-[133px]">
      <div className="absolute bg-[rgba(226,226,226,0.9)] border border-solid border-white h-[167px] left-[1154px] rounded-[10px] top-[134px] w-[169px]" />
      <div className="absolute bg-[rgba(226,226,226,0.9)] border border-solid border-white h-[167px] left-[1339px] rounded-[10px] top-[134px] w-[169px]" />
      <div className="absolute bg-[rgba(226,226,226,0.9)] border border-solid border-white h-[167px] left-[1154px] rounded-[10px] top-[323px] w-[169px]" />
      <div className="absolute bg-[rgba(226,226,226,0.9)] border border-solid border-white h-[167px] left-[969px] rounded-[10px] top-[134px] w-[169px]" />
      <div className="absolute bg-[rgba(226,226,226,0.9)] border border-solid border-white h-[167px] left-[969px] rounded-[10px] top-[323px] w-[169px]" />
      <div className="absolute bg-[rgba(226,226,226,0.9)] border border-solid border-white h-[167px] left-[1339px] rounded-[10px] top-[323px] w-[169px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[rgba(248,248,248,0.8)] border border-solid border-white h-[606px] left-[34px] overflow-clip rounded-[20px] top-[7352px] w-[1660px]">
      <div className="-translate-y-1/2 absolute h-[395px] left-[66px] top-[calc(50%-2.5px)] w-[414px]" data-name="Gemini_Generated_Image_lxlcjmlxlcjmlxlc-removebg-preview 2">
        <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[198.17%] left-[-47.67%] max-w-none top-[-28.05%] w-[188.95%]" src={imgGeminiGeneratedImageLxlcjmlxlcjmlxlcRemovebgPreview2} />
        </div>
      </div>
      <Group72 />
      <div className="absolute left-[980px] size-[146px] top-[144px]" data-name="Silpakorn_University_Logo_02 5">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute left-[1165px] size-[146px] top-[144px]" data-name="Silpakorn_University_Logo_02 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute left-[1350px] size-[146px] top-[144px]" data-name="Silpakorn_University_Logo_02 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute left-[980px] size-[146px] top-[333px]" data-name="Silpakorn_University_Logo_02 8">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute left-[1165px] size-[146px] top-[333px]" data-name="Silpakorn_University_Logo_02 9">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
      <div className="absolute left-[1350px] size-[146px] top-[333px]" data-name="Silpakorn_University_Logo_02 10">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSilpakornUniversityLogo021} />
      </div>
    </div>
  );
}

function Group149() {
  return (
    <div className="absolute contents left-[34px] top-[7352px]">
      <Frame5 />
    </div>
  );
}

function Group57() {
  return <button className="partner-btn">Partner With Us</button>;
}


function Group24() {
  return (
    <div className="absolute contents left-[calc(8.33%+66px)] top-[7770px]">
      <Group57 />
    </div>
  );
}

function Group150() {
  return (
    <div className="absolute contents left-[calc(8.33%+66px)] top-[7511px]">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[81.43499755859375%] left-[calc(8.33%+71px)] not-italic text-[48px] text-black top-[7511px] w-[649px] whitespace-pre-wrap">Benefits for Equal Opportunity For Students</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[84.06999969482422%] left-[calc(8.33%+71px)] not-italic text-[20px] text-[rgba(0,0,0,0.8)] top-[7653px] w-[592px] whitespace-pre-wrap">Join our mission to bridge the gap between education and employment by providing equal career opportunities for all students through advanced AI technology.</p>
      <Group24 />
    </div>
  );
}

function Group151() {
  return (
    <div className="absolute contents left-[34px] top-[7352px]">
      <Group149 />
      <Group150 />
    </div>
  );
}

function Group69() {
  return (
    <div className="absolute left-[1134px] size-[47px] top-[537px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 47">
        <g id="Group 70">
          <circle cx="23.5" cy="23.5" fill="var(--fill-0, black)" id="Ellipse 45" r="23.5" />
          <g id="Vector">
            <path d={svgPaths.p3abb2c80} fill="var(--fill-0, white)" />
            <path d={svgPaths.pd80d80} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group53() {
  return (
    <div className="absolute contents left-[402px] top-[218px]">
      <div className="absolute bg-[#f8f8f8] h-[274px] left-[402px] rounded-[10px] top-[218px] w-[380px]" />
    </div>
  );
}

function Group50() {
  return (
    <div className="absolute contents left-[2px] top-0">
      <div className="absolute bg-[#212121] h-[274px] left-[2px] rounded-[10px] top-0 w-[381px]" />
      <div className="absolute left-[22px] size-[76px] top-[17px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse46} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[116px] not-italic text-[0px] text-[rgba(255,255,255,0.8)] top-[17px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">{`Somchai Dev `}</p>
        <p className="mb-0 text-[16px]">Computer Engineering Student</p>
        <p className="text-[16px]">Ready Score : 92% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[29px] not-italic text-[16px] text-[rgba(255,255,255,0.8)] top-[137px] w-[344px] whitespace-pre-wrap">{`"The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"`}</p>
    </div>
  );
}

function Group49() {
  return (
    <div className="absolute contents left-0 top-[15px]">
      <div className="absolute bg-[#f8f8f8] h-[197px] left-0 rounded-[10px] top-[295px] w-[381px]" />
      <div className="absolute left-[22px] size-[76px] top-[310px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse47} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[116px] not-italic text-[0px] text-[rgba(0,0,0,0.8)] top-[310px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">Kanya Design</p>
        <p className="mb-0 text-[16px]">UX/UI Design Aspirant</p>
        <p className="text-[16px]">Ready Score : 88% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[29px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[426px] w-[334px] whitespace-pre-wrap">{` "The AI Mock Interview was so realistic. It asked tough questions about my design”`}</p>
      <div className="absolute left-[425px] size-[76px] top-[15px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse47} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[519px] not-italic text-[0px] text-[rgba(0,0,0,0.8)] top-[15px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">Kanya Design</p>
        <p className="mb-0 text-[16px]">UX/UI Design Aspirant</p>
        <p className="text-[16px]">Ready Score : 88% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[432px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[131px] w-[334px] whitespace-pre-wrap">{` "The AI Mock Interview was so realistic. It asked tough questions about my design”`}</p>
      <div className="absolute left-[825px] size-[76px] top-[313px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse47} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[919px] not-italic text-[0px] text-[rgba(0,0,0,0.8)] top-[313px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">Kanya Design</p>
        <p className="mb-0 text-[16px]">UX/UI Design Aspirant</p>
        <p className="text-[16px]">Ready Score : 88% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[832px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[429px] w-[334px] whitespace-pre-wrap">{` "The AI Mock Interview was so realistic. It asked tough questions about my design”`}</p>
    </div>
  );
}

function Group52() {
  return (
    <div className="absolute contents left-[419px] top-[237px]">
      <div className="absolute left-[419px] size-[76px] top-[237px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse46} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[513px] not-italic text-[0px] text-black top-[237px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">{`Somchai Dev `}</p>
        <p className="mb-0 text-[16px]">Computer Engineering Student</p>
        <p className="text-[16px]">Ready Score : 92% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[426px] not-italic text-[16px] text-black top-[357px] w-[344px] whitespace-pre-wrap">{`"The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"`}</p>
    </div>
  );
}

function Group51() {
  return (
    <div className="absolute contents left-[425px] top-[329px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[425px] not-italic text-[16px] text-black top-[329px]">{`"No more writer's block!"`}</p>
    </div>
  );
}

function Group55() {
  return (
    <div className="absolute contents left-[425px] top-[329px]">
      <Group51 />
    </div>
  );
}

function Group54() {
  return (
    <div className="absolute contents left-[419px] top-[237px]">
      <Group52 />
      <Group55 />
    </div>
  );
}

function Group58() {
  return (
    <div className="absolute contents left-[825px] top-[21px]">
      <div className="absolute left-[825px] size-[76px] top-[21px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse46} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[919px] not-italic text-[0px] text-black top-[21px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">{`Somchai Dev `}</p>
        <p className="mb-0 text-[16px]">Computer Engineering Student</p>
        <p className="text-[16px]">Ready Score : 92% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[832px] not-italic text-[16px] text-black top-[141px] w-[344px] whitespace-pre-wrap">{`"The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"`}</p>
    </div>
  );
}

function Group60() {
  return (
    <div className="absolute contents left-[831px] top-[113px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[831px] not-italic text-[16px] text-black top-[113px]">{`"No more writer's block!"`}</p>
    </div>
  );
}

function Group59() {
  return (
    <div className="absolute contents left-[831px] top-[113px]">
      <Group60 />
    </div>
  );
}

function Group56() {
  return (
    <div className="absolute contents left-[825px] top-[21px]">
      <Group58 />
      <Group59 />
    </div>
  );
}

function Group61() {
  return (
    <div className="absolute contents left-[28px] top-[398px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[28px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[398px]">{`"Felt like a real tech interview."`}</p>
    </div>
  );
}

function Group66() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group53 />
      <div className="absolute bg-[#f8f8f8] h-[274px] left-[811px] rounded-[10px] top-0 w-[381px]" />
      <div className="absolute bg-[#f8f8f8] h-[197px] left-[801px] rounded-[10px] top-[295px] w-[380px]" />
      <div className="absolute bg-[#f8f8f8] h-[197px] left-[402px] rounded-[10px] top-0 w-[380px]" />
      <Group50 />
      <Group49 />
      <div className="absolute bg-[#f8f8f8] h-[274px] left-[803px] rounded-[10px] top-0 w-[381px]" />
      <Group54 />
      <Group56 />
      <Group61 />
    </div>
  );
}

function Group68() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute left-[1076px] size-[47px] top-[537px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 47">
          <circle cx="23.5" cy="23.5" fill="var(--fill-0, #F8F8F8)" id="Ellipse 44" r="23.5" />
        </svg>
      </div>
      <Group69 />
      <div className="absolute flex inset-[95.03%_7.05%_2.91%_91.61%] items-center justify-center">
        <div className="-rotate-90 flex-none h-[16px] w-[12px]">
          <div className="relative size-full" data-name="Vector">
            <div className="absolute inset-[-4.69%_-6.25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 17.5">
                <path d={svgPaths.p2a9fda0} id="Vector" stroke="var(--stroke-0, #414141)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Group66 />
    </div>
  );
}

function Group62() {
  return (
    <div className="absolute contents left-[28px] top-[109px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[28px] not-italic text-[16px] text-[rgba(255,255,255,0.8)] top-[109px]">{`"No more writer's block!"`}</p>
    </div>
  );
}

function Group63() {
  return (
    <div className="absolute contents left-[431px] top-[103px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[431px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[103px]">{`"Felt like a real tech interview."`}</p>
    </div>
  );
}

function Group64() {
  return (
    <div className="absolute contents left-[831px] top-[401px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[831px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[401px]">{`"Felt like a real tech interview."`}</p>
    </div>
  );
}

function Group67() {
  return (
    <div className="absolute contents left-[28px] top-[103px]">
      <Group62 />
      <Group63 />
      <Group64 />
    </div>
  );
}

function Group73() {
  return (
    <div className="absolute contents left-[28px] top-[103px]">
      <Group67 />
    </div>
  );
}

function Group65() {
  return (
    <div className="absolute contents left-[1589px] top-[218px]">
      <div className="absolute bg-[#f8f8f8] h-[274px] left-[1589px] opacity-0 rounded-[10px] top-[218px] w-[380px]" />
    </div>
  );
}

function Group75() {
  return (
    <div className="absolute contents left-[1189px] top-0">
      <div className="absolute bg-[#255ec9] h-[274px] left-[1189px] opacity-0 rounded-[10px] top-0 w-[381px]" />
      <div className="absolute left-[1209px] opacity-0 size-[76px] top-[17px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse46} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1303px] not-italic opacity-0 text-[0px] text-[rgba(255,255,255,0.8)] top-[17px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">{`Somchai Dev `}</p>
        <p className="mb-0 text-[16px]">Computer Engineering Student</p>
        <p className="text-[16px]">Ready Score : 92% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1216px] not-italic opacity-0 text-[16px] text-[rgba(255,255,255,0.8)] top-[137px] w-[344px] whitespace-pre-wrap">{`"The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"`}</p>
    </div>
  );
}

function Group76() {
  return (
    <div className="absolute contents left-[1187px] top-[15px]">
      <div className="absolute bg-[#f8f8f8] h-[197px] left-[1187px] opacity-0 rounded-[10px] top-[295px] w-[381px]" />
      <div className="absolute left-[1209px] opacity-0 size-[76px] top-[310px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse47} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1303px] not-italic opacity-0 text-[0px] text-[rgba(0,0,0,0.8)] top-[310px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">Kanya Design</p>
        <p className="mb-0 text-[16px]">UX/UI Design Aspirant</p>
        <p className="text-[16px]">Ready Score : 88% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1216px] not-italic opacity-0 text-[16px] text-[rgba(0,0,0,0.8)] top-[426px] w-[334px] whitespace-pre-wrap">{` "The AI Mock Interview was so realistic. It asked tough questions about my design”`}</p>
      <div className="absolute left-[1612px] opacity-0 size-[76px] top-[15px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse47} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1706px] not-italic opacity-0 text-[0px] text-[rgba(0,0,0,0.8)] top-[15px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">Kanya Design</p>
        <p className="mb-0 text-[16px]">UX/UI Design Aspirant</p>
        <p className="text-[16px]">Ready Score : 88% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1619px] not-italic opacity-0 text-[16px] text-[rgba(0,0,0,0.8)] top-[131px] w-[334px] whitespace-pre-wrap">{` "The AI Mock Interview was so realistic. It asked tough questions about my design”`}</p>
      <div className="absolute left-[2012px] opacity-0 size-[76px] top-[313px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse47} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[2106px] not-italic opacity-0 text-[0px] text-[rgba(0,0,0,0.8)] top-[313px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">Kanya Design</p>
        <p className="mb-0 text-[16px]">UX/UI Design Aspirant</p>
        <p className="text-[16px]">Ready Score : 88% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[2019px] not-italic opacity-0 text-[16px] text-[rgba(0,0,0,0.8)] top-[429px] w-[334px] whitespace-pre-wrap">{` "The AI Mock Interview was so realistic. It asked tough questions about my design”`}</p>
    </div>
  );
}

function Group78() {
  return (
    <div className="absolute contents left-[1606px] top-[237px]">
      <div className="absolute left-[1606px] opacity-0 size-[76px] top-[237px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse46} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1700px] not-italic opacity-0 text-[0px] text-black top-[237px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">{`Somchai Dev `}</p>
        <p className="mb-0 text-[16px]">Computer Engineering Student</p>
        <p className="text-[16px]">Ready Score : 92% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1613px] not-italic opacity-0 text-[16px] text-black top-[357px] w-[344px] whitespace-pre-wrap">{`"The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"`}</p>
    </div>
  );
}

function Group80() {
  return (
    <div className="absolute contents left-[1612px] top-[329px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[1612px] not-italic opacity-0 text-[16px] text-black top-[329px]">{`"No more writer's block!"`}</p>
    </div>
  );
}

function Group79() {
  return (
    <div className="absolute contents left-[1612px] top-[329px]">
      <Group80 />
    </div>
  );
}

function Group77() {
  return (
    <div className="absolute contents left-[1606px] top-[237px]">
      <Group78 />
      <Group79 />
    </div>
  );
}

function Group82() {
  return (
    <div className="absolute contents left-[2012px] top-[21px]">
      <div className="absolute left-[2012px] opacity-0 size-[76px] top-[21px]">
        <img alt="" className="block max-w-none size-full" height="76" src={imgEllipse46} width="76" />
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[2106px] not-italic opacity-0 text-[0px] text-black top-[21px] whitespace-nowrap">
        <p className="font-['Poppins:Medium',sans-serif] mb-0 text-[20px]">{`Somchai Dev `}</p>
        <p className="mb-0 text-[16px]">Computer Engineering Student</p>
        <p className="text-[16px]">Ready Score : 92% Ready</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[2019px] not-italic opacity-0 text-[16px] text-black top-[141px] w-[344px] whitespace-pre-wrap">{`"The AI Co-Writer is incredible. It turned my messy project notes into professional bullet points instantly. I can see the changes in Live Preview while I type!"`}</p>
    </div>
  );
}

function Group84() {
  return (
    <div className="absolute contents left-[2018px] top-[113px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[2018px] not-italic opacity-0 text-[16px] text-black top-[113px]">{`"No more writer's block!"`}</p>
    </div>
  );
}

function Group83() {
  return (
    <div className="absolute contents left-[2018px] top-[113px]">
      <Group84 />
    </div>
  );
}

function Group81() {
  return (
    <div className="absolute contents left-[2012px] top-[21px]">
      <Group82 />
      <Group83 />
    </div>
  );
}

function Group85() {
  return (
    <div className="absolute contents left-[1215px] top-[398px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[1215px] not-italic opacity-0 text-[16px] text-[rgba(0,0,0,0.8)] top-[398px]">{`"Felt like a real tech interview."`}</p>
    </div>
  );
}

function Group74() {
  return (
    <div className="absolute contents left-[1187px] top-0">
      <Group65 />
      <div className="absolute bg-[#f8f8f8] h-[274px] left-[1998px] opacity-0 rounded-[10px] top-0 w-[381px]" />
      <div className="absolute bg-[#f8f8f8] h-[197px] left-[1988px] opacity-0 rounded-[10px] top-[295px] w-[380px]" />
      <div className="absolute bg-[#f8f8f8] h-[197px] left-[1589px] opacity-0 rounded-[10px] top-0 w-[380px]" />
      <Group75 />
      <Group76 />
      <div className="absolute bg-[#f8f8f8] h-[274px] left-[1990px] opacity-0 rounded-[10px] top-0 w-[381px]" />
      <Group77 />
      <Group81 />
      <Group85 />
    </div>
  );
}

function Comment() {
  return (
    <div className="absolute h-[584px] left-[calc(8.33%+119px)] top-[6665px] w-[1192px]" data-name="comment">
      <Group68 />
      <Group73 />
      <Group74 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Poppins:Regular',sans-serif] gap-[20px] items-start leading-[1.261] left-[741.42px] top-[108.5px] w-[145px] whitespace-pre-wrap">
      <p className="relative shrink-0 w-full">Resume AI</p>
      <p className="relative shrink-0 w-full">Interview AI</p>
      <p className="relative shrink-0 w-full">Talent Insights</p>
    </div>
  );
}

function Group86() {
  return (
    <div className="absolute contents left-[741.42px] not-italic text-[20px] text-black top-[66.5px]">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[84.06999969482422%] left-[741.42px] top-[66.5px]">Solution</p>
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Poppins:Regular',sans-serif] gap-[20px] items-start leading-[1.261] left-[963.42px] top-[108.5px] w-[239px] whitespace-pre-wrap">
      <p className="relative shrink-0 w-full">Academic Partners</p>
      <p className="relative shrink-0 w-full">For Employers</p>
      <p className="relative shrink-0 w-full">Help Center</p>
      <p className="relative shrink-0 w-full">Contact Us</p>
    </div>
  );
}

function Group87() {
  return (
    <div className="absolute contents left-[963.42px] not-italic text-[20px] text-black top-[66.5px]">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[84.06999969482422%] left-[963.42px] top-[66.5px]">{`Partnerships & Support`}</p>
      <Frame17 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex font-['Poppins:Regular',sans-serif] gap-[115px] inset-[84.25%_10.06%_9.5%_10.75%] items-center leading-[84.06999969482422%] not-italic text-[20px] text-black">
      <p className="relative shrink-0">© 2026 NexLabs. All rights reserved.</p>
      <p className="relative shrink-0">Privacy Policy | Terms of Service.</p>
      <p className="relative shrink-0">{`"Promoting equal opportunity for every student".`}</p>
    </div>
  );
}

function Component({ className }: { className?: string }) {
  return (
    <div className={className || "absolute bg-black h-[397px] left-[2px] rounded-[15px] top-[8203px] w-[1726px]"} data-name="Component 1">
      <div className="absolute bg-[#f6f6f6] border border-solid border-white inset-0 rounded-[15px]" />
      <div className="absolute inset-[75.75%_2.67%_24.25%_2.84%]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1631 1">
            <line id="Line 2" stroke="var(--stroke-0, black)" strokeOpacity="0.6" x2="1631" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] inset-[40.75%_72.05%_46.75%_6.56%] leading-[84.06999969482422%] not-italic text-[20px] text-black whitespace-pre-wrap">Empowering the next generation of tech talent with AI-driven readiness.</p>
      <Group86 />
      <Group87 />
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[84.06999969482422%] left-[1280.42px] not-italic text-[20px] text-black top-[66.5px]">Community</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[84.06999969482422%] left-[1280.42px] not-italic text-[20px] text-black top-[113.5px] w-[333px] whitespace-pre-wrap">{`"Everything fits, lives together and joins the Tech community".`}</p>
      <div className="absolute bg-[#eaeaea] left-[1280.42px] rounded-[15px] size-[51px] top-[185.5px]" />
      <div className="absolute bg-[#eaeaea] left-[1342.42px] rounded-[15px] size-[51px] top-[185.5px]" />
      <div className="absolute bg-[#eaeaea] left-[1404px] rounded-[15px] size-[51px] top-[185px]" />
      <div className="absolute bg-[#eaeaea] left-[1466.42px] rounded-[15px] size-[51px] top-[185.5px]" />
      <Frame18 />
      <div className="absolute inset-[49.12%_23.41%_42.82%_74.74%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <path d={svgPaths.p235c1b00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[49.37%_19.81%_42.57%_78.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <path d={svgPaths.p373b6b20} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[49.12%_16.28%_42.82%_81.92%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 32">
          <path d={svgPaths.p3e4fbc00} fill="var(--fill-0, #1A1A1A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[50.13%_12.63%_44.08%_85.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 23">
          <path d={svgPaths.p19cb3100} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['League_Spartan:Regular',sans-serif] font-normal h-[64px] leading-[1.261] left-[12.86%] right-[73.12%] text-[56px] text-black top-[calc(50%-129.5px)] whitespace-pre-wrap">NexLabs</p>
      <div className="absolute h-[76px] left-[110px] top-[57px] w-[79.707px]" data-name="Gemini_Generated_Image_lxlcjmlxlcjmlxlc-removebg-preview 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[198.17%] left-[-47.67%] max-w-none top-[-28.05%] w-[188.95%]" src={imgGeminiGeneratedImageLxlcjmlxlcjmlxlcRemovebgPreview2} />
        </div>
      </div>
    </div>
  );
}

function Group153() {
  return (
    <div className="absolute contents left-[50px] top-[4594px]">
      <div className="absolute bg-[#212121] h-[1108px] left-[50px] rounded-bl-[30px] rounded-br-[60px] rounded-tl-[30px] rounded-tr-[60px] top-[4594px] w-[832px]" />
      <div className="absolute flex h-[1108px] items-center justify-center left-[calc(41.67%+126px)] top-[4594px] w-[832px]">
        <div className="flex-none rotate-180">
          <div className="bg-[#212121] h-[1108px] rounded-bl-[30px] rounded-br-[60px] rounded-tl-[30px] rounded-tr-[60px] w-[832px]" />
        </div>
      </div>
    </div>
  );
}

function Group89() {
  return <button className="mock-btn">Start Mock Interview Now</button>;
}


function Group88() {
  return (
    <div className="absolute contents left-[calc(75%+18px)] top-[4725px]">
      <Group89 />
    </div>
  );
}

function Group121() {
  return (
    <div className="absolute h-[229px] left-[calc(8.33%+34px)] top-[5161px] w-[323.52px]">
      <div className="absolute inset-[-54.37%_-38.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 572.52 478">
          <g id="Group 231">
            <g id="Group 60">
              <g id="Group 59">
                <g filter="url(#filter0_f_1_2741)" id="Ellipse 7">
                  <circle cx="239" cy="239" fill="var(--fill-0, #4771D9)" fillOpacity="0.5" r="114.5" />
                </g>
                <g filter="url(#filter1_f_1_2741)" id="Ellipse 8">
                  <circle cx="285.35" cy="226.179" fill="var(--fill-0, #F3ADDF)" fillOpacity="0.5" r="81.6989" />
                </g>
                <g filter="url(#filter2_f_1_2741)" id="Ellipse 6">
                  <circle cx="343.51" cy="239" fill="var(--fill-0, #EB9F66)" fillOpacity="0.4" r="104.51" />
                </g>
              </g>
              <path d={svgPaths.p21c35700} fill="var(--fill-0, white)" fillOpacity="0.9" id="Vector" />
              <path d={svgPaths.p29d3ce00} fill="var(--fill-0, white)" fillOpacity="0.9" id="Vector_2" />
            </g>
            <circle cx="275" cy="239" fill="var(--fill-0, #0F1729)" id="Ellipse 53" r="63" stroke="var(--stroke-0, white)" strokeWidth="5" />
            <path d={svgPaths.p15271500} fill="var(--fill-0, white)" id="Vector_3" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="478" id="filter0_f_1_2741" width="478" x="0" y="1.68383e-06">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_2741" stdDeviation="62.25" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="412.398" id="filter1_f_1_2741" width="412.398" x="79.1506" y="19.9799">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_2741" stdDeviation="62.25" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="458.02" id="filter2_f_1_2741" width="458.02" x="114.5" y="9.98974">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_2741" stdDeviation="62.25" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group90() {
  return (
    <div className="absolute contents left-[calc(8.33%+34px)] top-[5161px]">
      <Group121 />
    </div>
  );
}

function LsiconPathOutline() {
  return (
    <div className="absolute left-[calc(33.33%+109.88px)] size-[32.236px] top-[2390.58px]" data-name="lsicon:path-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.2364 32.2364">
        <g id="lsicon:path-outline">
          <path d={svgPaths.p38f06d80} id="Vector" stroke="var(--stroke-0, #245DC8)" strokeWidth="1.81904" />
        </g>
      </svg>
    </div>
  );
}

function Group128() {
  return (
    <div className="absolute contents left-[calc(33.33%+100px)] top-[2381px]">
      <div className="absolute bg-[#e2e2e2] left-[calc(33.33%+100px)] rounded-[6.063px] size-[52px] top-[2381px]" />
      <LsiconPathOutline />
    </div>
  );
}

function Group129() {
  return (
    <div className="absolute left-[calc(66.67%-23px)] size-[52px] top-[2388px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="Group 246">
          <rect fill="var(--fill-0, #E2E2E2)" height="52" id="Rectangle 96" rx="6.06348" width="52" />
          <path clipRule="evenodd" d={svgPaths.p347f6d00} fill="var(--fill-0, #245DC8)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group126() {
  return (
    <div className="absolute contents left-[calc(66.67%-23px)] top-[2388px]">
      <Group129 />
    </div>
  );
}

function Group127() {
  return (
    <div className="absolute left-[calc(8.33%+73.41px)] size-[52px] top-[2388px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="Group 244">
          <rect fill="var(--fill-0, #E2E2E2)" height="52" id="Rectangle 95" rx="6.06348" width="52" />
          <path d={svgPaths.p266f7280} fill="var(--fill-0, #245DC8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export function Group122() {
  // ตั้งค่า Animation มาตรฐานไว้ใช้ซ้ำ
  const scrollSettings = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 }, // แสดงผลเมื่อชิ้นส่วนนั้นโผล่มา 20%
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    // เปลี่ยนจาก contents เป็น div ปกติเพื่อรักษาระนาบ
    <div className="absolute left-0 top-0 w-full h-full">
      
      {/* 1. พื้นหลังการ์ด */}
      <motion.div 
        className="absolute bg-[rgba(243,243,243,0.8)] border border-solid border-white h-[474px] left-[calc(8.33%+43px)] rounded-[10px] top-[2365px] w-[432.559px] backdrop-blur-sm" 
      />

      {/* 2. หัวข้อ Build & Audit */}
      <motion.p 
        {...scrollSettings}
        transition={{ ...scrollSettings.transition, delay: 0.1 }}
        className="absolute font-['Poppins:Bold',sans-serif] h-[27px] leading-[84.1%] left-[calc(8.33%+73.41px)] not-italic text-[20px] text-black top-[2460px] w-[223.038px] whitespace-pre-wrap"
      >
        Build & Audit
      </motion.p>

      {/* 3. รายละเอียดภาษาไทย */}
      <motion.p 
        {...scrollSettings}
        transition={{ ...scrollSettings.transition, delay: 0.2 }}
        className="font-thai absolute font-['Poppins:Regular','Noto_Sans_Thai:Regular',sans-serif] h-[67px] leading-[1.261] left-[calc(8.33%+73px)] text-[16px] text-[rgba(0,0,0,0.8)] top-[2496px] w-[362px] whitespace-pre-wrap"
      >
        สร้างหรืออัปโหลดเรซูเม่ด้วย AI Co-Writer เพื่อรับ Readiness Score และวิเคราะห์ความพร้อมของคุณทันที
      </motion.p>

      {/* 4. ตัวเลข 01 */}
<p className="absolute font-['Poppins:Regular',sans-serif] h-[55px] leading-[84.1%] left-[calc(25%+121px)] not-italic text-[#bfbfbf] text-[40px] top-[2381px] w-[50.691px] whitespace-pre-wrap">
  01
</p>

      {/* 5. เลเยอร์ตกแต่งสีเทาด้านหลัง */}
      <motion.div 
        {...scrollSettings}
        transition={{ ...scrollSettings.transition, delay: 0.4 }}
        className="absolute flex h-[178.196px] items-center justify-center left-[calc(8.33%+52px)] top-[2586px] w-[277.043px]"
      >
        <div className="rotate-[-7.29deg] bg-[#e2e2e2] h-[151.61px] rounded-[11.855px] w-[243.216px]" />
      </motion.div>

      {/* 6. รูปภาพหลัก (ส่วนที่คุณต้องการให้มี Hover) */}
      <motion.div 
        {...scrollSettings}
        whileHover={{ y: -8 }} // เพิ่ม Hover แบบง่ายเข้าไป
        className="absolute h-[215px] left-[calc(8.33%+85px)] rounded-[6.822px] shadow-[0px_9.55px_14.053px_0px_rgba(0,0,0,0.1)] top-[2574px] w-[348px] overflow-hidden cursor-pointer"
      >
        <motion.img 
          alt="" 
          src={imgRectangle158} 
          whileHover={{ scale: 1.05 }}
          className="absolute inset-0 object-cover size-full" 
        />
      </motion.div>

      <Group127 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[19.72%_71.93%_79.65%_24.71%]" data-name="Group">
      <div className="absolute inset-[-1.84%_-1.72%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.1007 56.2998">
          <g id="Group">
            <path d={svgPaths.p2e52c830} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p47e2a80} fill="var(--fill-0, black)" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[19.72%_71.93%_79.65%_24.71%]" data-name="Group">
      <Group5 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[19.72%_71.93%_79.65%_24.71%]" data-name="Mask group">
      <Group />
      <div className="absolute inset-[19.66%_71.59%_79.58%_24.37%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.7208 65.1598">
          <path d={svgPaths.p2080a280} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, black)" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}

function Group143() {
  return (
    <div className="absolute contents left-[107.73px] top-[1935.04px]">
      <div className="absolute h-[42.851px] left-[calc(41.67%+34.21px)] top-[1935.04px] w-[44.941px]" data-name="Gemini_Generated_Image_lxlcjmlxlcjmlxlc-removebg-preview 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[198.17%] left-[-47.67%] max-w-none top-[-28.05%] w-[188.95%]" src={imgGeminiGeneratedImageLxlcjmlxlcjmlxlcRemovebgPreview2} />
        </div>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31.821px] leading-[normal] left-[107.73px] not-italic text-[20px] text-black top-[1945.46px] w-[233.241px] whitespace-pre-wrap">NexLabs Showreel</p>
    </div>
  );
}

function Group144() {
  return (
    <div className="absolute contents left-[105px] top-[1525px]">
      <div className="absolute h-[389.808px] left-[105px] rounded-[15px] top-[1525px] w-[700.921px]">
        <iframe
          className="absolute inset-0 max-w-none object-cover rounded-[15px] size-full"
          src="https://www.youtube.com/embed/mmQcX6HpCGs?autoplay=1&mute=1&rel=0"
          title="Interview Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        <div
          aria-hidden="true"
          className="absolute border border-solid border-white inset-0 rounded-[15px]"
        />
      </div>

      <Group143 />
    </div>
  );
}

function Group145() {
  return (
    <div className="absolute contents left-[85px] top-[1506px]">
      <div className="absolute bg-[#ededed] border border-solid border-white h-[508px] left-[85px] rounded-[15px] top-[1506px] w-[738px]" />
      <Group144 />
    </div>
  );
}

function Group123() {
  return (
    <div className="absolute contents left-[85px] top-[1506px]">
      <Group145 />
    </div>
  );
}

function Group146() {
  return <button className="about-btn">About us</button>;
}



function Group101() {
  return (
    <div className="absolute contents left-[calc(50%+87px)] top-[1870px]">
      <Group146 />
    </div>
  );
}

function Group105() {
  return (
    <div className="absolute contents left-[calc(50%+87px)] top-[1870px]">
      <Group101 />
    </div>
  );
}

function Group125() {
  return (
    <div className="absolute contents left-[50px] top-[1476px]">
      {/* ───── พื้นหลังคงเดิม ───── */}
      <div className="absolute bg-[#f6f6f6] border border-solid border-white h-[556px] left-[50px] rounded-[15px] top-[1476px] w-[1628px]" />

      <Group123 />

      {/* ───── หัวข้อ ───── */}
      <motion.p
        className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[calc(50%+87px)] not-italic text-[40px] text-black top-[1524.23px]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7 }}
      >
        Crafting Your Story Together.
      </motion.p>

      {/* ───── ย่อหน้า 1 ───── */}
      <motion.p
        className="font-thai  absolute font-['IBM Plex Sans Thai:Regular','Noto_Sans_Thai:Regular',sans-serif] leading-[normal] left-[calc(50%+87px)] text-[20px] text-[rgba(0,0,0,0.8)] top-[1601.23px] w-[588px] whitespace-pre-wrap"
        style={{ fontVariationSettings: "'wdth' 100, 'wght' 400" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {`เรารู้ว่าการเริ่มต้นชีวิตการทำงานเป็นเรื่องน่าตื่นเต้นแต่ก็น่ากังวล NexLabs จึงถูกสร้างขึ้นมาเพื่อให้เป็นพื้นที่ที่ "ความตั้งใจ" มาเจอกับ "โอกาส" เราผสมผสานการออกแบบที่สวยงามเข้ากับ AI อัจฉริยะ เพื่อช่วยคุณเรียบเรียงผลงานและความสำเร็จออกมาให้ดูดีที่สุด`}
      </motion.p>

      {/* ───── ย่อหน้า 2 ───── */}
      <motion.p
        className="font-thai absolute font-['Poppins:Regular','Noto_Sans_Thai:Regular',sans-serif] leading-[normal] left-[calc(50%+87px)] text-[20px] text-[rgba(0,0,0,0.8)] top-[1747.23px] w-[588px] whitespace-pre-wrap"
        style={{ fontVariationSettings: "'wdth' 100, 'wght' 400" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        เป้าหมายของเราคือการเปลี่ยนความไม่มั่นใจให้กลายเป็นความพร้อม
        เพื่อให้คุณเดินไปสู่เป้าหมายและอาชีพในฝันได้อย่างมั่นคง
      </motion.p>

      <Group105 />
    </div>
  );
}

function Group135() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[93px]">
        <img alt="" className="block max-w-none size-full" height="93" src={imgEllipse68} width="93" />
      </div>
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] ml-[117px] mt-[15px] not-italic relative row-1 text-[24px] text-black">DreamThanawat</p>
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-[118px] mt-[55px] not-italic relative row-1 text-[20px] text-[rgba(0,0,0,0.8)]">UX/UI Designer</p>
    </div>
  );
}

function Group91() {
  return <button className="trial-btn">Start Free Trial</button>;
}

function Group124() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Group91 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[23px] items-start relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] h-[42px] leading-[normal] not-italic relative shrink-0 text-[20px] text-[rgba(0,0,0,0.8)] w-[276px] whitespace-pre-wrap">Want to see your name on this leaderboard?</p>
      <Group124 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[158px] top-[3202px] w-[1383.375px]">
      <Group135 />
      <Frame26 />
    </div>
  );
}

function Group136() {
  return (
    <div className="absolute contents left-[158px] top-[3202px]">
      <Frame27 />
    </div>
  );
}

function Group137() {
  return (
    <div className="absolute contents left-[calc(25%+90px)] top-[3408.33px]">
      <div className="absolute inset-[39.63%_66.78%_59.83%_30.21%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 46.0856">
          <path d={svgPaths.p1d59f50} fill="var(--fill-0, #FDBD23)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[calc(25%+99px)] not-italic text-[24px] text-black top-[3475px]">96</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[65.773px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.65px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[53.536px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group10 />
    </div>
  );
}

function Group8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[36.71px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.65px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[22.944px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[65.773px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[8.09px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[57.751px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex gap-[5.556px] items-center leading-[0] left-[calc(8.33%+50px)] top-[3480px]">
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group130() {
  return (
    <div className="absolute contents left-[158px] top-[3355px]">
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[195px] left-[158px] rounded-[10px] top-[3355px] w-[455px]" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(8.33%+129px)] not-italic text-[24px] text-black top-[3392px]">DreamThanawat</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(8.33%+130px)] not-italic text-[20px] text-[rgba(0,0,0,0.8)] top-[3429px]">UX/UI Designer</p>
      <div className="absolute left-[calc(8.33%+50px)] size-[64px] top-[3392px]">
        <img alt="" className="block max-w-none size-full" height="64" src={imgEllipse70} width="64" />
      </div>
      <Group137 />
      <Frame3 />
    </div>
  );
}

function Group142() {
  return (
    <div className="absolute contents left-[158px] top-[3355px]">
      <Group130 />
    </div>
  );
}

function Group138() {
  return (
    <div className="absolute contents left-[calc(50%+125px)] top-[3408.33px]">
      <div className="absolute inset-[39.63%_39.7%_59.83%_57.23%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53 46.0856">
          <path d={svgPaths.p26a02d00} fill="var(--fill-0, #D9D9D9)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[calc(58.33%-8px)] not-italic text-[24px] text-black top-[3475px]">96</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[65.773px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.65px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[53.536px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group11() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group12 />
    </div>
  );
}

function Group13() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[36.71px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.65px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[22.944px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[65.773px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[8.09px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[57.751px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex gap-[5.556px] items-center leading-[0] left-[calc(33.33%+87px)] top-[3480px]">
      <Group11 />
      <Group13 />
      <Group14 />
    </div>
  );
}

function Group131() {
  return (
    <div className="absolute contents left-[calc(33.33%+51px)] top-[3355px]">
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[195px] left-[calc(33.33%+51px)] rounded-[10px] top-[3355px] w-[455px]" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(41.67%+22px)] not-italic text-[24px] text-black top-[3392px]">SunPongsakorn</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(41.67%+23px)] not-italic text-[20px] text-[rgba(0,0,0,0.8)] top-[3429px]">Backend Developer</p>
      <div className="absolute left-[calc(33.33%+87px)] size-[64px] top-[3392px]">
        <img alt="" className="block max-w-none size-full" height="64" src={imgEllipse71} width="64" />
      </div>
      <Group138 />
      <Frame4 />
    </div>
  );
}

function Group141() {
  return (
    <div className="absolute contents left-[calc(33.33%+51px)] top-[3355px]">
      <Group131 />
    </div>
  );
}

function Group139() {
  return (
    <div className="absolute contents left-[calc(83.33%+20px)] top-[3408.33px]">
      <div className="absolute inset-[39.63%_12.5%_59.83%_84.49%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 46.0856">
          <path d={svgPaths.p1d59f50} fill="var(--fill-0, #E48F37)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[calc(83.33%+30px)] not-italic text-[24px] text-black top-[3475px]">94</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[65.773px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.65px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[53.536px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group16 />
    </div>
  );
}

function Group17() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[36.71px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.65px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[22.944px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group18() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[25px] ml-0 mt-0 rounded-[123.611px] row-1 w-[65.773px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[8.09px] mt-[1.39px] not-italic relative row-1 text-[13.889px] text-white w-[57.751px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex gap-[5.556px] items-center leading-[0] left-[calc(66.67%-19px)] top-[3480px]">
      <Group15 />
      <Group17 />
      <Group18 />
    </div>
  );
}

function Group132() {
  return (
    <div className="absolute contents left-[calc(58.33%+89px)] top-[3355px]">
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[195px] left-[calc(58.33%+89px)] rounded-[10px] top-[3355px] w-[455px]" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(66.67%+60px)] not-italic text-[24px] text-black top-[3392px]">DreamThanawat</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(66.67%+61px)] not-italic text-[20px] text-[rgba(0,0,0,0.8)] top-[3429px]">UX/UI Designer</p>
      <div className="absolute left-[calc(66.67%-19px)] size-[64px] top-[3392px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <circle cx="32" cy="32" fill="var(--fill-0, #C4C4C4)" id="Ellipse 70" r="32" />
        </svg>
      </div>
      <Group139 />
      <Frame6 />
    </div>
  );
}

function Group140() {
  return (
    <div className="absolute contents left-[calc(58.33%+89px)] top-[3355px]">
      <Group132 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[calc(8.33%+42.96px)] not-italic text-[20px] text-white top-[3600.04px] whitespace-pre-wrap">
      <p className="absolute h-[31.785px] left-[calc(8.33%+42.96px)] top-[3600.04px] w-[88.203px]">Rank</p>
      <p className="absolute h-[31.785px] left-[calc(16.67%+39.6px)] top-[3600.04px] w-[78.668px]">User</p>
      <p className="absolute h-[31.785px] left-[calc(33.33%+74.24px)] top-[3600.04px] w-[259.842px]">Target Position</p>
      <p className="absolute h-[31.785px] left-[calc(58.33%+1.39px)] top-[3600.04px] w-[188.326px]">Tech Stack</p>
      <p className="absolute h-[31.785px] left-[calc(83.33%-22.97px)] top-[3600.04px] w-[97.739px]">Score</p>
    </div>
  );
}

function Group133() {
  return (
    <div className="absolute contents left-[158px] top-[3579px]">
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[677px] left-[158px] rounded-[10px] top-[3579px] w-[1394px]" />
      <div className="absolute bg-black border border-[#f8f8f8] border-solid h-[60.543px] left-[158px] rounded-tl-[10px] rounded-tr-[10px] top-[3579px] w-[1394px]" />
      <Group6 />
    </div>
  );
}

function Group21() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group20() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group21 />
    </div>
  );
}

function Group22() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group23() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group20 />
      <Group22 />
      <Group23 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame7 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">88</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame8({ className }: { className?: string }) {
  return (
    <div className={className || "h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full"}>
      <Group19 />
      <Frame23 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">4</p>
    </div>
  );
}

function Group27() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group26() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group27 />
    </div>
  );
}

function Group28() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group29() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group26 />
      <Group28 />
      <Group29 />
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame10 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">78</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group25 />
      <Frame24 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">5</p>
    </div>
  );
}

function Group32() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group31() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group32 />
    </div>
  );
}

function Group33() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group34() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group31 />
      <Group33 />
      <Group34 />
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame12 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">76</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group30 />
      <Frame28 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">6</p>
    </div>
  );
}

function Group37() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group36() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group37 />
    </div>
  );
}

function Group38() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group39() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group36 />
      <Group38 />
      <Group39 />
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame14 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">75</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group35 />
      <Frame29 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">7</p>
    </div>
  );
}

function Group42() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group41() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group42 />
    </div>
  );
}

function Group43() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group45() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group41 />
      <Group43 />
      <Group45 />
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame19 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">73</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group40 />
      <Frame30 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">8</p>
    </div>
  );
}

function Group48() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group47() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group48 />
    </div>
  );
}

function Group92() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group93() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group47 />
      <Group92 />
      <Group93 />
    </div>
  );
}

function Group46() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame21 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">70</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group46 />
      <Frame31 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">9</p>
    </div>
  );
}

function Group96() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group95() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group96 />
    </div>
  );
}

function Group97() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group98() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group95 />
      <Group97 />
      <Group98 />
    </div>
  );
}

function Group94() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame32 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">69</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group94 />
      <Frame33 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">10</p>
    </div>
  );
}

function Group107() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group106() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group107 />
    </div>
  );
}

function Group108() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group109() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group106 />
      <Group108 />
      <Group109 />
    </div>
  );
}

function Group99() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame35 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">68</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group99 />
      <Frame36 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50.5px] not-italic text-[20px] text-black text-center top-[19px]">11</p>
    </div>
  );
}

function Group112() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="bg-[#245dc8] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[46.953px] whitespace-pre-wrap">Python</p>
    </div>
  );
}

function Group111() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Group112 />
    </div>
  );
}

function Group113() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-[#8a38f5] col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[32.196px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[6.71px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[20.123px] whitespace-pre-wrap">Go</p>
    </div>
  );
}

function Group114() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-black col-1 h-[21.926px] ml-0 mt-0 rounded-[108.411px] row-1 w-[57.685px]" />
      <p className="col-1 font-['Poppins:Regular',sans-serif] leading-[normal] ml-[7.09px] mt-[1.22px] not-italic relative row-1 text-[12.181px] text-white w-[50.65px] whitespace-pre-wrap">{` Next.js`}</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="absolute content-stretch flex gap-[4.872px] h-[21.926px] items-center leading-[0] left-[845.05px] top-[23.07px] w-[159.171px]">
      <Group111 />
      <Group113 />
      <Group114 />
    </div>
  );
}

function Group110() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white h-[64.926px] left-0 top-0 w-[1394px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[29.217px] leading-[normal] left-[495px] not-italic text-[16px] text-[rgba(0,0,0,0.8)] top-[21.07px] w-[246.122px] whitespace-pre-wrap">Backend Engineer</p>
      <Frame38 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[34.086px] leading-[normal] left-[1287.61px] not-italic text-[14px] text-black text-center top-[20.07px] w-[37.228px] whitespace-pre-wrap">66</p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute h-[35px] left-[169px] top-[16px] w-[232.036px]">
      <div className="absolute left-0 size-[35px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
          <circle cx="17.5" cy="17.5" fill="var(--fill-0, #C4C4C4)" id="Ellipse 67" r="17.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[29.217px] leading-[normal] left-[58px] not-italic text-[20px] text-black top-[3px] w-[184.036px] whitespace-pre-wrap">Lorem Lorem</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="h-[65px] relative shadow-[0px_1px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
      <Group110 />
      <Frame39 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[50px] not-italic text-[20px] text-black text-center top-[19px]">12</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-px items-start left-[158px] top-[3642px] w-[1394px]">
      <Frame8 />
      <Frame9 />
      <Frame11 />
      <Frame13 />
      <Frame15 />
      <Frame20 />
      <Frame22 />
      <Frame34 />
      <Frame37 />
    </div>
  );
}

function Group147() {
  return (
    <div className="absolute contents left-[158px] top-[3579px]">
      <Group133 />
      <Frame25 />
    </div>
  );
}

function Group148() {
  return (
    <div className="absolute contents left-[109px] top-[3150px]">
      <div className="-translate-x-1/2 absolute bg-[#f6f6f6] border border-solid border-white h-[1177px] left-[calc(50%+0.5px)] rounded-[25px] top-[3150px] w-[1511px]" />
      <Group136 />
      <div className="-translate-x-1/2 absolute h-0 left-[calc(50%+0.5px)] top-[3337px] w-[1347px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1347 1">
            <line id="Line 6" stroke="var(--stroke-0, black)" strokeOpacity="0.1" x2="1347" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Group142 />
      <Group141 />
      <Group140 />
      <Group147 />
    </div>
  );
}

function Circle2() {
  return (
    <div className="absolute h-[54.303px] left-[calc(50%+107px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[54.414px_27.896px] top-[2548.37px] w-[54.373px]" data-name="Circle" style={{ maskImage: `url('${imgCircle}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.3735 54.3031">
        <g id="Circle">
          <g id="Empty Circle">
            <mask fill="white" id="path-1-inside-1_1_1613">
              <path d={svgPaths.p3c41700} />
            </mask>
            <path d={svgPaths.p29661b00} fill="var(--stroke-0, white)" mask="url(#path-1-inside-1_1_1613)" />
          </g>
          <g id="Fill">
            <mask fill="white" id="path-3-inside-2_1_1613">
              <path d={svgPaths.p13153e00} />
            </mask>
            <path d={svgPaths.p13153e00} mask="url(#path-3-inside-2_1_1613)" stroke="var(--stroke-0, #265FCA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="11.4196" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Circle1() {
  return (
    <div className="absolute contents left-[calc(50%+107px)] top-[2548.37px]" data-name="Circle">
      <Circle2 />
    </div>
  );
}

function Circle() {
  return (
    <div className="absolute contents left-[calc(50%+107px)] top-[2548.37px]" data-name="Circle">
      <Circle1 />
      <div className="absolute left-[calc(58.33%+2.97px)] size-[6.899px] top-[2552.86px]" data-name="Indicator Dot">
        <div className="absolute inset-[0_-22.07%_-44.14%_-22.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.94437 9.94437">
            <g filter="url(#filter0_d_1_2537)" id="Indicator Dot">
              <circle cx="4.97218" cy="3.44957" fill="var(--fill-0, #265FCA)" r="3.44957" />
              <circle cx="4.97218" cy="3.44957" r="2.97375" stroke="var(--stroke-0, white)" strokeWidth="0.951633" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.94437" id="filter0_d_1_2537" width="9.94437" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1.52261" />
                <feGaussianBlur stdDeviation="0.761306" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0392157 0 0 0 0 0.172549 0 0 0 0.08 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_2537" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_2537" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group134() {
  return (
    <div className="absolute contents left-[calc(50%+107px)] top-[2548.37px]">
      <Circle />
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[calc(50%+126.6px)] not-italic text-[12.181px] text-black top-[2554.95px]">75</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[calc(50%+126.98px)] not-italic text-[3.807px] text-[rgba(0,0,0,0.8)] top-[2571.51px]">82 / 100</p>
    </div>
  );
}

function Fqa1() {
  return (
    <div className="absolute inset-[0_0_77.29%_0]" data-name="FQA 1">
      <div className="absolute bg-[#f8f8f8] border border-solid border-white inset-[0_0_-188.06%_0] rounded-[15px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[23.88%_14.79%_22.39%_6.29%] leading-[normal] not-italic text-[24px] text-black whitespace-pre-wrap">ยังไม่เคยฝึกงานหรือทำงานที่ไหนเลย AI จะช่วยสร้างเรซูเม่ได้ไหม?</p>
      <div className="absolute inset-[26.87%_96.38%_26.87%_1.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
          <path d={svgPaths.p153b3880} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex inset-[11.94%_2.22%_28.36%_96.38%] items-center justify-center">
        <div className="flex-none h-[40px] rotate-180 w-[19px]">
          <p className="font-['Quicksand:SemiBold',sans-serif] font-semibold leading-[normal] relative text-[32px] text-[rgba(0,0,0,0.8)]">^</p>
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[23px] not-italic text-[20px] text-[rgba(0,0,0,0.8)] top-[88px] w-[1028px] whitespace-pre-wrap">ได้แน่นอน! NexLabs ออกแบบมาเพื่อนักศึกษาโดยเฉพาะ AI ของเราจะช่วยดึงทักษะจากโปรเจกต์ในห้องเรียน, กิจกรรมชมรม, หรือแม้แต่งานอดิเรกของคุณ มาเขียนให้ดูเป็นมืออาชีพในรูปแบบ STAR Model ที่บริษัท Tech ยอมรับครับ</p>
    </div>
  );
}

function Fqa2() {
  return (
    <div className="absolute inset-[68.14%_0_9.15%_0]" data-name="FQA 2">
      <div className="absolute bg-[#f8f8f8] border border-solid border-white inset-0 rounded-[15px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[23.88%_14.79%_22.39%_6.29%] leading-[normal] not-italic text-[24px] text-black whitespace-pre-wrap">ถ้า Readiness Score ของเราน้อย ระบบจะมีตัวช่วยเพิ่มคะแนนอย่างไร?</p>
      <div className="absolute inset-[26.87%_96.38%_26.87%_1.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
          <path d={svgPaths.p153b3880} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex inset-[11.94%_2.22%_28.36%_96.38%] items-center justify-center">
        <div className="flex-none h-[40px] rotate-180 w-[19px]">
          <p className="font-['Quicksand:SemiBold',sans-serif] font-semibold leading-[normal] relative text-[32px] text-[rgba(0,0,0,0.8)]">^</p>
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[55.22%_24.48%_-44.78%_1.55%] leading-[normal] not-italic opacity-0 text-[20px] text-black whitespace-pre-wrap">ได้แน่นอน! NexLabs ออกแบบมาเพื่อนักศึกษาโดยเฉพาะ AI ของเราจะช่วยดึงทักษะจากโปรเจกต์ในห้องเรียน, กิจกรรมชมรม, หรือแม้แต่งานอดิเรกของคุณ มาเขียนให้ดูเป็นมืออาชีพในรูปแบบ STAR Model ที่บริษัท Tech ยอมรับครับ</p>
    </div>
  );
}

function Fqa3() {
  return (
    <div className="absolute inset-[93.9%_0_-16.61%_0]" data-name="FQA 3">
      <div className="absolute bg-[#f8f8f8] border border-solid border-white inset-0 rounded-[15px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[23.88%_14.79%_22.39%_6.29%] leading-[normal] not-italic text-[24px] text-black whitespace-pre-wrap">ใช้งาน NexLabs มีค่าใช้จ่ายไหม และข้อมูลเรซูเม่จะปลอดภัยหรือเปล่า?</p>
      <div className="absolute inset-[26.87%_96.38%_26.87%_1.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
          <path d={svgPaths.p153b3880} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex inset-[11.94%_2.22%_28.36%_96.38%] items-center justify-center">
        <div className="flex-none h-[40px] rotate-180 w-[19px]">
          <p className="font-['Quicksand:SemiBold',sans-serif] font-semibold leading-[normal] relative text-[32px] text-[rgba(0,0,0,0.8)]">^</p>
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[55.22%_24.48%_-44.78%_1.55%] leading-[normal] not-italic opacity-0 text-[20px] text-black whitespace-pre-wrap">ได้แน่นอน! NexLabs ออกแบบมาเพื่อนักศึกษาโดยเฉพาะ AI ของเราจะช่วยดึงทักษะจากโปรเจกต์ในห้องเรียน, กิจกรรมชมรม, หรือแม้แต่งานอดิเรกของคุณ มาเขียนให้ดูเป็นมืออาชีพในรูปแบบ STAR Model ที่บริษัท Tech ยอมรับครับ</p>
    </div>
  );
}

function Fqa4() {
  return (
    <div className="absolute inset-[119.66%_0_-42.37%_0]" data-name="FQA 4">
      <div className="absolute bg-[#f8f8f8] border border-solid border-white inset-0 rounded-[15px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[23.88%_14.79%_22.39%_6.29%] leading-[normal] not-italic text-[24px] text-black whitespace-pre-wrap">AI Mock Interview จะถามคำถามแบบไหน?</p>
      <div className="absolute inset-[26.87%_96.38%_26.87%_1.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
          <path d={svgPaths.p153b3880} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex inset-[11.94%_2.22%_28.36%_96.38%] items-center justify-center">
        <div className="flex-none h-[40px] rotate-180 w-[19px]">
          <p className="font-['Quicksand:SemiBold',sans-serif] font-semibold leading-[normal] relative text-[32px] text-[rgba(0,0,0,0.8)]">^</p>
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[55.22%_24.48%_-44.78%_1.55%] leading-[normal] not-italic opacity-0 text-[20px] text-black whitespace-pre-wrap">ได้แน่นอน! NexLabs ออกแบบมาเพื่อนักศึกษาโดยเฉพาะ AI ของเราจะช่วยดึงทักษะจากโปรเจกต์ในห้องเรียน, กิจกรรมชมรม, หรือแม้แต่งานอดิเรกของคุณ มาเขียนให้ดูเป็นมืออาชีพในรูปแบบ STAR Model ที่บริษัท Tech ยอมรับครับ</p>
    </div>
  );
}

function Fqa() {
  return (
    <div className="absolute h-[295px] left-[calc(8.33%+44px)] top-[5924px] w-[1352px]" data-name="FQA">
      <Fqa1 />
      <Fqa2 />
      <Fqa3 />
      <Fqa4 />
    </div>
  );
}

function Group152() {
  return (
    <div className="absolute contents left-[61px] top-[19px]">
      <p className="absolute font-['League_Spartan:Regular',sans-serif] font-normal h-[32px] leading-[1.261] left-[6.77%] right-[86.23%] text-[28px] text-black top-[calc(50%-16px)] whitespace-pre-wrap">NexLabs</p>
      <div className="absolute h-[38px] left-[61px] top-[19px] w-[40px]" data-name="Gemini_Generated_Image_lxlcjmlxlcjmlxlc-removebg-preview 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[198.17%] left-[-47.67%] max-w-none top-[-28.05%] w-[188.95%]" src={imgGeminiGeneratedImageLxlcjmlxlcjmlxlcRemovebgPreview2} />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute backdrop-blur-[10px] h-[82px] left-0 overflow-clip top-0 w-[1728px]">
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[92px] left-0 top-0 w-[1728px]" />
      <Group152 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[56px] items-center leading-[1.261] left-1/2 not-italic text-[16px] text-black top-[calc(50%+3.96px)] w-[626px]" data-name="Frame">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0">Home</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0">Resume AI</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0">Interview AI</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0">Academic Partners</p>
    </div>
  );
}

function Group118() {
  return (
    <div className="absolute contents inset-[24.14%_2.72%_29.89%_91.38%]">
      <div className="absolute bg-[#fbfbfb] border border-solid border-white inset-[24.14%_2.72%_29.89%_91.38%] rounded-[30px]" />
    </div>
  );
}

function Group117() {
  return (
    <div className="absolute contents inset-[24.14%_2.72%_29.89%_91.38%]">
      <Group118 />
    </div>
  );
}

function Group116() {
  return (
    <div className="absolute contents inset-[24.14%_2.72%_29.89%_31.89%]">
      <Frame1 />
      <Group117 />
      <p className="absolute font-['Poppins:Regular',sans-serif] inset-[34.34%_3.88%_29.95%_92.59%] leading-[1.261] not-italic text-[16px] text-black whitespace-pre-wrap">Sigh Up</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] inset-[34.34%_9.78%_29.95%_87.5%] leading-[1.261] not-italic text-[16px] text-black whitespace-pre-wrap">Log in</p>
    </div>
  );
}

function Group115() {
  return (
    <div className="-translate-x-1/2 absolute h-[87px] left-1/2 top-0 w-[1728px]">
      <Frame40 />
      <Group116 />
      <div className="absolute bg-black h-px left-[551px] top-[60px] w-[48px]" />
    </div>
  );
}

export default function NexLabsHomepage() {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <div className="relative size-full" data-name="NexLabs_Homepage">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-white inset-0" />
        <div className="absolute inset-0 mix-blend-plus-lighter overflow-hidden">
          <img alt="" className="absolute h-[95.79%] left-[-187.93%] max-w-none top-0 w-[475.87%]" src={imgNexLabsHomepage} />
        </div>
      </div>
      <Frame2 activeTab={activeTab} />
            <motion.p
        className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] h-[172px] leading-[1.261] left-[calc(50%+0.5px)] not-italic text-[64px] text-black text-center top-[292px] tracking-[-1.92px] w-[839px] whitespace-pre-wrap"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 1.05, // ช้ากว่า apple ปกติ (~0.8)
          ease: [0.25, 0.1, 0.25, 1], // classic apple cubic-bezier
        }}
      >
        Level Up Your Tech Profile Stand Out to Recruiters
      </motion.p>
      <motion.p
        className="font-thai -translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] h-[81px] leading-[84.07%] left-[calc(50%-0.5px)] not-italic text-[20px] text-[rgba(0,0,0,0.8)] text-center top-[464px] w-[743px] whitespace-pre-wrap"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.95,
          delay: 0.18,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        เตรียมพร้อมสู่มาตรฐานโลก! ให้ AI
        ช่วยปั้นเรซูเม่และติวสัมภาษณ์ด้วยลอจิกจากผู้เชี่ยวชาญ ตัวจริง
        เพื่อให้คุณเป็นตัวเลือกที่โดดเด่นที่สุดในตลาดแรงงานไทย
      </motion.p>
      <Group102 />
      <Group103 activeTab={activeTab} setActiveTab={(id: number) => setActiveTab(id)} />
      <Group4 />
      <Sd />
      <Group104 />
            <motion.p
        className="
    -translate-x-1/2 
    absolute 
    font-['Poppins:SemiBold',sans-serif]
    text-[40px]
    text-black 
    text-center
    top-[2189px]
    left-[calc(16.67%+558.5px)]

    whitespace-nowrap
    tracking-[-0.02em]
    leading-[1.25]
  "
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        Turn Uncertainty Into Measurable Tech Readiness
      </motion.p>
      <motion.p
        className="
  font-thai
    -translate-x-1/2 
    absolute 
    font-['Poppins:Regular',sans-serif]
    text-[20px]
    text-[rgba(0,0,0,0.8)]
    text-center

    top-[2256px]
    left-[calc(16.67%+563.5px)]

    w-[913px]
    leading-[1.6]
    whitespace-pre-wrap
  "
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.1,
        }}
      >
        สร้างโปรไฟล์ให้โดดเด่นเหนือใคร สะกดสายตา HR สายเทคด้วยพลัง AI <br />
        เตรียมพร้อมสู่โอกาสการทำงานที่ดีที่สุดสำหรับคุณ
      </motion.p>
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[calc(50%-322px)] not-italic text-[42px] text-black top-[6487px]">Join the NexLabs Community.</p>
      <Group151 />
      <Comment />
      <Component />
      <div className="absolute bg-[rgba(235,235,235,0.8)] border border-solid border-white h-[621px] left-[calc(33.33%+63px)] rounded-[24px] top-[4990px] w-[431px]" />
      <Group153 />
      <Group88 />
      <div className="absolute bg-[rgba(255,255,255,0.02)] h-[769px] left-[89px] rounded-[15px] top-[4842px] w-[485px]" />
      <div className="absolute bg-[rgba(255,253,253,0.04)] border border-solid border-white h-[575px] left-[115px] rounded-[24px] top-[4990px] w-[431px]" />
      <div className="absolute bg-[rgba(255,255,255,0.02)] h-[769px] left-[calc(33.33%+36px)] rounded-[15px] top-[4842px] w-[485px]" />
      <div className="absolute bg-[rgba(255,255,255,0.02)] h-[769px] left-[calc(66.67%-17px)] rounded-[15px] top-[4842px] w-[485px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[92px] not-italic text-[42px] text-white top-[4704px]">{`Practice Like It's the Real Day`}</p>
      <div className="absolute bg-[rgba(255,253,253,0.04)] border border-solid border-white h-[575px] left-[calc(33.33%+63px)] rounded-[24px] top-[4988px] w-[431px]" />
      <div className="absolute bg-[rgba(255,253,253,0.04)] border border-solid border-white h-[575px] left-[calc(66.67%+8px)] rounded-[24px] top-[4988px] w-[431px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[92px] not-italic text-[20px] text-[rgba(255,255,255,0.8)] top-[4767px] w-[1067px] whitespace-pre-wrap">Our AI Mock Interview simulates real-world tech interviews, providing instant feedback on your answers.</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[93.09500122070312%] left-[109px] not-italic text-[20px] text-[rgba(255,255,255,0.8)] top-[4874px] w-[431px] whitespace-pre-wrap">Choose your target rolehe AI can generate industry-specific technical questions.</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[93.09500122070312%] left-[calc(33.33%+53px)] not-italic text-[20px] text-[rgba(255,255,255,0.8)] top-[4913px] w-[457px] whitespace-pre-wrap">Enter a realistic video call environment where our AI interviewer asks questions in real-time</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[calc(33.33%+52px)] not-italic text-[24px] text-white top-[4869px]">Start the Live Simulation</p>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[93.09500122070312%] left-[calc(66.67%+1px)] not-italic text-[20px] text-[rgba(255,255,255,0.8)] top-[4913px] w-[445px] whitespace-pre-wrap">
        <p className="mb-0">{`Get an instant Ready Score along with `}</p>
        <p>a detailed summary of your performance</p>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[66.67%] not-italic text-[24px] text-white top-[4869px]">{`Receive Deep Insights & Scoring`}</p>
      <Group90 />
      <div className="absolute bg-[rgba(243,243,243,0.8)] border border-solid border-white h-[474px] left-[calc(33.33%+72px)] rounded-[10px] top-[2365px] w-[432px]" />
      <Group128 />
{/* --- 1. ส่วนของไอคอน Gemini (ภาพที่ขยับได้) --- */}
<motion.div 
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
  className="absolute h-[25.426px] left-[calc(33.33%+102.31px)] top-[2552px] w-[26.666px]" 
  data-name="Gemini_Generated_Image_lxlcjmlxlcjmlxlc-removebg-preview 1"
>
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.img 
      alt="" 
      className="absolute h-[198.17%] left-[-47.67%] max-w-none top-[-28.05%] w-[188.95%]" 
      src={imgGeminiGeneratedImageLxlcjmlxlcjmlxlcRemovebgPreview2} 
      // เพิ่มลูกเล่นให้ไอคอนขยับเบาๆ ตลอดเวลา
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
</motion.div>

{/* --- 2. ส่วนหัวข้อ Bridge the Gap --- */}
<motion.p 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
  className="absolute font-['Poppins:Bold',sans-serif] h-[27px] leading-[84.1%] left-[calc(33.33%+100px)] not-italic text-[20px] text-black top-[2460px] w-[250px] whitespace-pre-wrap"
>
  Bridge the Gap
</motion.p>

{/* --- 3. ส่วนรายละเอียดเนื้อหาภาษาไทย --- */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
  className="font-thai absolute font-['Poppins:Regular','Noto_Sans_Thai:Regular',sans-serif] h-[67px] leading-[1.261] left-[calc(33.33%+100px)] text-[16px] text-[rgba(0,0,0,0.8)] top-[2496px] w-[371px] whitespace-pre-wrap" 
  style={{ fontVariationSettings: "'wdth' 100, 'wght' 400" }}
>
  <p className="mb-0">เดินตาม Recommended Path ที่จัดเซต ค่าย โปรเจกต์</p>
  <p>และงานแข่งมาเพื่อปิดจุดอ่อนและสกิลของคุณโดยเฉพาะ</p>
</motion.div>
      <div className="absolute bg-[rgba(243,243,243,0.8)] border border-solid border-white h-[474px] left-[calc(58.33%+100px)] rounded-[10px] top-[2365px] w-[433px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[27px] leading-[84.06999969482422%] left-[calc(66.67%-16px)] not-italic text-[20px] text-black top-[2460px] w-[264px] whitespace-pre-wrap">Ace the Interview</p>
      <div className="font-thai absolute font-['Poppins:Regular','Noto_Sans_Thai:Regular',sans-serif] h-[67px] leading-[1.261] left-[calc(66.67%-16px)] text-[16px] text-[rgba(0,0,0,0.8)] top-[2496px] w-[425px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100, 'wght' 400" }}>
        <p className="mb-0">กดเริ่มการสัมภาษณ์เพื่อฝึกฝนคำถามเชิงลึก</p>
        <p className="mb-0">ที่ตรงสายงานที่สุด พร้อมรับคำแนะนำเพื่อขัดเกลาตัวตน</p>
        <p>ให้โดดเด่น</p>
      </div>
      <Group126 />
<p className="absolute font-['Poppins:Regular',sans-serif] h-[55px] leading-[84.1%] left-[calc(58.33%+2.68px)] not-italic text-[#bfbfbf] text-[40px] top-[2381px] w-[61px] whitespace-pre-wrap">
  02
</p>      

      <Group122 />


import { motion } from "framer-motion";

// --- ส่วนที่ 2: Bridge the Gap (Card และรูปภาพ) ---

<motion.div 
  // 1. ตัวกรอบนอก (Container) สำหรับรูปที่สอง
  initial={{ opacity: 0, y: 30 }} // ใส่ initial แบบเลื่อนขึ้นตอน Scroll ด้วย
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  whileHover={{ 
    y: -8, 
    boxShadow: "0px 15px 30px rgba(0,0,0,0.15)" 
  }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  className="absolute h-[218.24px] left-[calc(33.33%+100px)] pointer-events-auto rounded-[7.04px] top-[2587.2px] w-[352px] overflow-hidden cursor-pointer z-20"
>
  <div className="absolute inset-0 overflow-hidden rounded-[7.04px]">
    <motion.img 
      alt="" 
      src={imgRectangle161}
      // 2. ตัวรูปข้างใน (Image Zoom)
      whileHover={{ 
        scale: 1.05, 
        rotate: 0.5  
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute h-[109.23%] left-0 max-w-none top-[-7.78%] w-full object-cover" 
    />
  </div>

  {/* 3. ส่วนของ Border (ดีไซน์เดิม) */}
  <div aria-hidden="true" className="absolute border-[#e7e7e7] border-[4.224px] border-solid inset-0 rounded-[7.04px]" />

  {/* 4. Overlay แสงตอน Hover */}
  <motion.div 
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 1 }}
    className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 pointer-events-none z-10"
  />
</motion.div>

{/* --- รายละเอียดข้อความ Bridge the Gap (ใส่ Animation ให้ล้อกัน) --- */}

<motion.p 
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="absolute font-['Poppins:Bold',sans-serif] h-[27px] leading-[84.1%] left-[calc(33.33%+100px)] not-italic text-[20px] text-black top-[2460px] w-[250px] whitespace-pre-wrap"
>
 
</motion.p>

<motion.div 
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.3 }}
  className="font-thai absolute font-['Poppins:Regular','Noto_Sans_Thai:Regular',sans-serif] h-[67px] leading-[1.261] left-[calc(33.33%+100px)] text-[16px] text-[rgba(0,0,0,0.8)] top-[2496px] w-[371px] whitespace-pre-wrap"
>

</motion.div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[28.16px] leading-[normal] left-[calc(41.67%-2.45px)] not-italic text-[14.08px] text-black top-[2554.82px] w-[267.52px] whitespace-pre-wrap">Personalized Recommendations</p>
      <Group125 />
      <Group148 />
      <Group134 />
      <Fqa />
      {/* <Group115 /> */} {/* Navbar moved to separate sticky component */}
    </div>
  );
}