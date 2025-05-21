import { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { BoothRowProps } from "@/types/booths/booth.types";
import { useBoothPopup } from "@/stores/booths/boothPopup";
import { useBoothList } from "@/stores/booths/boothList";
import { useUserStore } from "@/stores/logins/userStore";

const BoothRow: React.FC<BoothRowProps> = ({
  booth,
  index,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const toggleWidth = windowWidth < 1024 ? 40 : 70;

  const { openPopup } = useBoothPopup();
  const { handleClickBoothDetail } = useBoothList();
  const { userOwnBoothId, isAdmin } = useUserStore();

  const isBoothOwner = isAdmin || booth.boothId === userOwnBoothId;

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  const handleClickBooth = (type: 'open' | 'order' | 'reservation') => {
    if (!isBoothOwner) {
      alert("본인 부스가 아닙니다.");
      return;
    }
    openPopup({ type, boothInfo: booth });
  };

  const { boothName, adminCategory, openTime, closeTime, isOpen, isOrder, isReservation } = booth;

  return (
      <div
          className={`text-second-700-light text-2xs md:text-xs lg:text-[14px] h-[55px] w-full flex justify-between gap-2 flex-nowrap overflow-x-auto items-center px-4 lg:px-[50px] last:rounded-b-[20px] last:border-0 border-b-1 border-secondary-300 ${
              isBoothOwner && !isAdmin
                  ? 'hover:bg-slate-200 bg-slate-100 font-bold'
                  : 'hover:bg-slate-50 bg-white'
          }`}>
          <div className='text-wrap min-w-[21px] w-[21px] lg:min-w-[35px] lg:w-[35px] text-center'>
              {index + 1}
          </div>
          <div className='text-wrap min-w-[70px] lg:min-w-[120px] text-center'>
              {adminCategory}
          </div>
          <div className='text-wrap min-w-[100px] max-w-[100px] lg:min-w-[130px] lg:max-w-[130px] text-center'>
              {boothName}
          </div>
          <div className='text-wrap min-w-[70px] lg:min-w-[140px] text-center'>
              {openTime} ~ {closeTime}
          </div>

          <div
              className='w-fit lg:min-w-[70px] text-center flex items-center justify-center'
              onClick={() => isBoothOwner && handleClickBooth('reservation')}
              style={{ pointerEvents: isBoothOwner ? 'auto' : 'none' }}>
              <ToggleSwitch isActive={isReservation} width={toggleWidth} />
          </div>

          <div
              className='w-fit lg:min-w-[70px] text-center flex items-center justify-center'
              onClick={() => isBoothOwner && handleClickBooth('reservation')}
              style={{ pointerEvents: isBoothOwner ? 'auto' : 'none' }}>
              <ToggleSwitch isActive={isOpen} width={toggleWidth} />
          </div>

          <div
              className='w-fit lg:min-w-[70px] text-center flex items-center justify-center'
              onClick={() => isBoothOwner && handleClickBooth('reservation')}
              style={{ pointerEvents: isBoothOwner ? 'auto' : 'none' }}>
              <ToggleSwitch isActive={isOrder} width={toggleWidth} />
          </div>

          <div
              className='min-w-[50px] text-[10px] lg:text-[14px] max-w-[60px] h-[25px] rounded-2xl flex items-center justify-center lg:min-w-[75px] lg:h-[30px] bg-primary-800-light-12 text-primary-800 cursor-pointer select-none font-semibold'
              onClick={() => handleClickBoothDetail(booth.boothId)}>
              부스정보
          </div>
      </div>
  )
};

export default BoothRow;