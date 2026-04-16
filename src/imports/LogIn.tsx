import svgPaths from "./svg-jx2r9mjl9b";
import { useNavigate } from "react-router";
import imgRectangle116 from "figma:asset/b1463e8a8ad52fc4d75003837a890b17e192c97a.png";

function SsoIcon() {
  return (
    <div className="absolute left-[calc(75%-24.5px)] size-[24px] top-[357px]" data-name="SSO Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SSO Icon">
          <path clipRule="evenodd" d={svgPaths.p2c309900} fill="var(--fill-0, #4285F4)" fillRule="evenodd" id="Shape" />
          <path clipRule="evenodd" d={svgPaths.p5439c80} fill="var(--fill-0, #34A853)" fillRule="evenodd" id="Shape_2" />
          <path clipRule="evenodd" d={svgPaths.p3b443800} fill="var(--fill-0, #FBBC05)" fillRule="evenodd" id="Shape_3" />
          <path clipRule="evenodd" d={svgPaths.p39a0e280} fill="var(--fill-0, #EA4335)" fillRule="evenodd" id="Shape_4" />
          <g id="Shape_5" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[calc(58.33%+111px)] top-[341px]">
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[341px] w-[481px]" />
      <SsoIcon />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(75%+15.5px)] text-[#1e293b] text-[16px] top-[369px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[24px]">เข้าสู่ระบบด้วย Google</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[calc(58.33%+111px)] top-[406px]">
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[406px] w-[481px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(75%+15.5px)] text-[#1e293b] text-[16px] top-[434px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[24px]">เข้าสู่ระบบด้วย SSO</p>
      </div>
      <div className="absolute inset-[38.14%_25.12%_60.43%_73.5%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16">
          <path d={svgPaths.p264792f0} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Square() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="square">
          <path d={svgPaths.p3673e2a0} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Keep() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[calc(58.33%+111px)] top-[734px]" data-name="keep">
      <Square />
      <p className="font-['Poppins:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#232323] text-[16px]">Keep me logged in</p>
    </div>
  );
}

function Group2() {
  const navigate = useNavigate();

  return (
    <div className="absolute contents left-[calc(58.33%+111px)] top-[786px]">
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate('/')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
        className="absolute bg-[#265fca] border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[786px] w-[481px] cursor-pointer"
      />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-center leading-[0] left-[calc(75%+63px)] text-[20px] text-center text-white top-[814px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[24px]">เข้าสู่ระบบ</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[calc(58.33%+106px)] top-[218px]">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[84.06999969482422%] left-[calc(58.33%+106px)] not-italic text-[36px] text-black top-[218px]">ยินดีต้อนรับกลับ!</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[84.06999969482422%] left-[calc(58.33%+108px)] not-italic text-[20px] text-black top-[269px]">พร้อมก้าวต่อไปในเส้นทางอาชีพของคุณหรือยัง?</p>
      <Group />
      <Group1 />
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[552px] w-[481px]" />
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[552px] w-[481px]" />
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[658px] w-[481px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(58.33%+111px)] text-[20px] text-black top-[531px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[24px]">อีเมล</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(58.33%+111px)] text-[#1e293b] text-[20px] top-[641px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[24px]">รหัสผ่าน</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(66.67%-18px)] text-[16px] text-[rgba(0,0,0,0.6)] top-[689px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[24px]">รหัสผ่านของคุณ</p>
      </div>
      <div className="absolute h-0 left-[calc(66.67%+36px)] top-[489px] w-[346px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 346 1">
            <line id="Line 3" stroke="var(--stroke-0, #D9D9D9)" x2="346" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(66.67%-18px)] text-[16px] text-[rgba(0,0,0,0.6)] top-[580px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[24px]">เช่น you@example.com</p>
      </div>
      <Keep />
      <Group2 />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[calc(58.33%+353px)] not-italic text-[#6c6c6c] text-[18px] text-center top-[856px] w-[478px] whitespace-pre-wrap">
        <span className="font-['Poppins:Regular',sans-serif] leading-[1.5]">{`New to the experiment? `}</span>
        <span className="[text-decoration-skip-ink:none] decoration-solid font-['Poppins:SemiBold',sans-serif] leading-[1.5] text-[#265fca] underline">Join NexLabs</span>
      </p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[50px] top-[37px]">
      <div className="absolute left-[50px] top-[37px] w-[926px] h-[1043px] rounded-[20px] bg-white p-[20px]">
        <div className="relative w-full h-full rounded-[12px] overflow-hidden">
          <img alt="" className="block w-full h-full object-cover pointer-events-none" src={imgRectangle116} />
        </div>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[1.5] left-[119px] not-italic text-[48px] text-white top-[829px] w-[484px] whitespace-pre-wrap">Ready to pick up where your innovation left off?</p>
    </div>
  );
}

export default function LogIn() {
  return (
    <div className="bg-white relative size-full" data-name="Log in">
      <Group3 />
      <Group4 />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(83.33%+96px)] text-[16px] text-black text-center top-[746px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[24px]">Forgot Password</p>
      </div>
    </div>
  );
}