import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconBoothTino from '@/components/icons/mobiles/IconBoothTino';
import IconReserveTino from '@/components/icons/mobiles/IconRserveTino';
import IconBannerArrow from '@/components/icons/mobiles/IconBannerArrow';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useUserStore } from '@/stores/logins/userStore';
import { useBaseModal } from '@/stores/commons/baseModal';

const MobileMain: React.FC = () => {
  const navigate = useNavigate();

  const { closeMobileModal } = useBaseModal();
  const { userOwnBoothId, isAdmin, getUserOwnBoothId } = useUserStore();
  const { boothInfo, boothType, getBoothInfo } = useBoothDetail();

  useEffect(() => {
    const fetchData = async () => {
      await getUserOwnBoothId();
      await getBoothInfo(userOwnBoothId);
      closeMobileModal();
    };
    fetchData();
  }, [userOwnBoothId]);

  const handleClickAdminMenu = (type: 'booth' | 'reserve') => {
    if (type === 'booth') {
      navigate(`/mobile/booth/${userOwnBoothId}`);
    }
    if (type === 'reserve') {
      navigate('/mobile/reserve');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-10 px-mobile mt-7">
      {(boothInfo.adminName || isAdmin) && (
        <div className="flex flex-col gap-[30px] text-secondary-800 w-full">
          <p className="font-semibold text-xl">부스 등록 및 수정</p>
          <div
            className="bg-primary-800 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
            onClick={() => handleClickAdminMenu('booth')}
          >
            <IconBoothTino />
            <div className="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center border-[0.5px] border-primary-800-light-16">
              <div className="flex flex-col gap-[6px] font-semibold">
                {isAdmin ? '개발팀' : boothInfo.adminName}
                <p className="text-xs">부스 운영을 응원합니다!</p>
              </div>
              <IconBannerArrow />
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="flex flex-col gap-[30px] text-secondary-800 w-full">
          <p className="font-semibold text-xl">예약관리</p>
          <div
            className="bg-primary-800 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
            onClick={() => handleClickAdminMenu('reserve')}
          >
            <IconReserveTino />
            <div className="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center border-[0.5px] border-primary-800-light-16 shrink-0">
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold">
                  '예약 서비스'
                </p>
              </div>
              <IconBannerArrow />
            </div>
          </div>
        </div>
      )}

      {(boothInfo.adminName && boothType === 'night' && boothInfo.isReservation ) && (
        <div className="flex flex-col gap-[30px] text-secondary-800 w-full">
          <p className="font-semibold text-xl">예약관리</p>
          <div
            className="bg-primary-800 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
            onClick={() => handleClickAdminMenu('reserve')}
          >
            <IconReserveTino />
            <div className="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center border-[0.5px] border-primary-800-light-16 shrink-0">
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold">
                  {`${boothInfo.totalReservationNum}팀 대기 중`}
                </p>
                <p className="text-xs">예약 서비스 운영 시간 10:00 ~ 22:00</p>
              </div>
              <IconBannerArrow />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMain;