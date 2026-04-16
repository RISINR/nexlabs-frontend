import imgRectangle116 from "figma:asset/b1463e8a8ad52fc4d75003837a890b17e192c97a.png";

function Group2() {
  return (
    <div className="absolute contents left-[50px] top-[37px]">
      <div className="absolute h-[1043px] left-[50px] rounded-[15px] top-[37px] w-[926px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[15px] size-full" src={imgRectangle116} />
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[1.5] left-[119px] not-italic text-[48px] text-white top-[829px] w-[484px] whitespace-pre-wrap">Ready to pick up where your innovation left off?</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[calc(58.33%+111px)] top-[651px]">
      <div className="absolute bg-[#265fca] border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[651px] w-[481px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-center leading-[0] left-[calc(75%+63.5px)] text-[20px] text-center text-white top-[679px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[24px]">Continue</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[calc(58.33%+111px)] top-[717px]">
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[717px] w-[481px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-center leading-[0] left-[calc(75%+63.5px)] text-[#265fca] text-[20px] text-center top-[745px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[24px]">Log in with SSO</p>
      </div>
    </div>
  );
}

export default function LogInBySso() {
  return (
    <div className="bg-white relative size-full" data-name="Log in By SSO">
      <Group2 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[84.06999969482422%] left-[calc(58.33%+106px)] not-italic text-[36px] text-black top-[411px]">Continue with email</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[84.06999969482422%] left-[calc(58.33%+108px)] not-italic text-[20px] text-black top-[462px] w-[457px] whitespace-pre-wrap">We’ll check if you have an account, and help create one if you don’t.</p>
      <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[55px] left-[calc(58.33%+111px)] rounded-[10px] top-[573px] w-[481px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(58.33%+111px)] text-[20px] text-black top-[550px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[24px]">Email (personal or work)</p>
      </div>
      <a className="-translate-y-1/2 absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(66.67%-18px)] text-[16px] text-[rgba(0,0,0,0.6)] top-[601px] tracking-[-0.24px] whitespace-nowrap" href="mailto:Dreamthanawat@gmail.com">
        <p className="cursor-pointer leading-[24px]">rattanakun_t@su.ac.th</p>
      </a>
      <Group />
      <Group1 />
    </div>
  );
}