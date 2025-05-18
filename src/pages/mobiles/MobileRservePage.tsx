import React, { useEffect, useState } from 'react';
import ReserveList from '@/components/mobiles/ReserveList';
import { useReserveListStore } from '@/stores/reserve/reserveList';
import { useBoothList } from '@/stores/booths/boothList';
import { useReserveModalStore } from '@/stores/reserve/reserveModalStore';
import { useUserStore } from '@/stores/logins/userStore';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useMessageStore } from '@/stores/reserve/message';
import { useNavigate } from 'react-router-dom';

const MobileReservePage: React.FC = () => {
  const navigate = useNavigate();
  const [reserveBoothList, setReserveBoothList] = useState<any[]>([]);
  const [listType, setListType] = useState<'reserve' | 'cancel' | 'complete'>('reserve');
  const [checkMark, setCheckMark] = useState(false);
  const [beforeReserveState, setBeforeReserveState] = useState(0);
  const [isActive, setIsActive] = useState({ reserveList: true, deleteList: false, completeList: false });

  const { boothList, getAllBoothList } = useBoothList();
  const { selectedBooth, setSelectedBooth, openCustomMessagePopup } = useReserveModalStore();
  const { reserveList } = useReserveListStore();
  const { isAdmin, userOwnBoothId, getUserOwnBoothId } = useUserStore();
  const { boothInfo, setBoothInfo } = useBoothDetail();
  const { getMessage } = useMessageStore();

  const toggleTab = (type: 'reserve' | 'cancel' | 'complete') => {
    setListType(type);
    setIsActive({
      reserveList: type === 'reserve',
      cancelList: type === 'cancel',
      completeList: type === 'complete',
    });
  };

  const activeUnderline = (active: boolean) => active ? 'h-1 bg-primary-800 rounded-full text-secondary-700' : '';
  const activeTab = (active: boolean) => active ? 'text-secondary-900' : '';
  const visibility = () => checkMark ? 'visible' : 'invisible';

  const handleClickOpenCustomMessage = async () => {
    if (!selectedBooth?.boothId) return;
    await getMessage(selectedBooth.boothId);
    openCustomMessagePopup();
  };

  useEffect(() => {
    const init = async () => {
      await getAllBoothList();
      const filtered = boothList.filter((booth: any) => booth?.isReservation);
      setReserveBoothList(filtered);

      if (isAdmin) {
        setSelectedBooth(filtered[0]);
      } else {
        if (userOwnBoothId) {
          const found = filtered.find((booth: any) => booth.boothId === userOwnBoothId);
          if (found) setSelectedBooth(found);
        } else {
          getUserOwnBoothId();
        }
      }
      setBeforeReserveState(reserveList.reserve.length);
      setBoothInfo(selectedBooth);
    };
    init();
  }, [userOwnBoothId]);

  useEffect(() => {
    if (listType !== 'reserve') {
      if (reserveList.reserve.length !== beforeReserveState) setCheckMark(true);
    } else {
      setCheckMark(false);
    }
    setBeforeReserveState(reserveList.reserve.length);
  }, [reserveList.reserve]);

  useEffect(() => {
    if (selectedBooth?.boothId && reserveBoothList.length > 0) {
      toggleTab('reserve');
    }
  }, [selectedBooth, reserveBoothList]);

  return (
    <div className="w-full h-full">
      <div className="flex justify-end w-full px-4 items-center gap-4">
        {isAdmin && (
          <select
            className="max-w-[160px] rounded-lg border-gray-400 text-secondary-900 text-sm focus:text-black focus:ring-white focus:border-primary-800 block w-full px-4"
            value={selectedBooth?.boothId}
            onChange={(e) => {
              const booth = reserveBoothList.find((b) => b.boothId === e.target.value);
              if (booth) setSelectedBooth(booth);
            }}
          >
            {reserveBoothList.map((booth, index) => (
              <option key={index} value={booth.boothId}>
                {booth.adminName}
              </option>
            ))}
          </select>
        )}
        <div
          onClick={handleClickOpenCustomMessage}
          className="h-[38px] bg-primary-800 rounded-xl text-white px-3 py-1 flex items-center cursor-pointer"
        >
          문자 커스텀
        </div>
      </div>

      <div className="pt-4 flex justify-center font-semibold text-xl border-b border-secondary-300 relative gap-5">
        {['reserve', 'complete', 'cancel'].map((type) => (
          <div key={type}>
            <div className="h-2" />
            <div
              onClick={() => toggleTab(type as 'reserve' | 'complete' | 'cancel')}
              className={`mb-2 w-[90px] text-center cursor-pointer ${activeTab(isActive[`${type}List` as keyof typeof isActive])}`}
            >
              {type === 'reserve' && '예약 목록'}
              {type === 'complete' && '완료 목록'}
              {type === 'cancel' && '삭제 목록'}
            </div>
            <div className={`absolute -bottom-[2px] w-[90px] ${activeUnderline(isActive[`${type}List` as keyof typeof isActive])}`} />
          </div>
        ))}
        {/* <div className="absolute right-[100px] top-0 w-2 h-2 bg-danger-800 rounded-full" style={{ visibility: visibility() }}></div> */}
      </div>

      <div className="flex items-center w-full text-secondary-900 border-b border-secondary-300 py-4">
        <div className="flex w-full items-center justify-center gap-1.5">
          <div className="w-1/12 flex flex-col items-center">
            <div>예약</div>
            <div>번호</div>
          </div>
          <div className="w-2/12 flex flex-col items-center">
            <div>예약자 /</div>
            <div>인원수</div>
          </div>
          <div className="w-4/12 flex flex-col items-center">
            <div>연락처 /</div>
            <div>예약시간</div>
          </div>
          <div className="w-3/12 flex items-center gap-1.5 justify-center">
            <div className="w-full flex flex-col items-center">
              <div>예약</div>
              <div>관리</div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div>문자</div>
              <div>커스텀</div>
            </div>
          </div>
        </div>
      </div>

      {selectedBooth?.boothId && <ReserveList listType={listType} />}
    </div>
  );
};

export default MobileReservePage;