import ToggleSwitch from "@/components/booths/ToggleSwitch";
import IconNotFound from "@/components/icons/IconNotFound";
import IconReservation from "@/components/icons/IconReservation";
import { useBoothDetail } from "@/stores/booths/boothDetail";
import { useBoothList } from "@/stores/booths/boothList";
import { useUserStore } from "@/stores/logins/userStore";
import { useMessageStore } from "@/stores/reserve/message";
import { MessageInfo, useMessageModalStore } from "@/stores/reserve/messageModal";
import { useReserveListStore } from "@/stores/reserve/reserveList";
import { useReservePopupStore } from "@/stores/reserve/reservePopup";
import { Booth } from "@/types/booths/booth.types";
import { prettyDate, prettyPhoneNumber } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReserveItem {
  reservationId: string; 
  userName: string;
  reservationNum: string | number;
  personCount: number;
  phoneNum: string;
  updateAt?: string;
}

type ReserveType = 'reserve' | 'cancel' | 'complete';

const TablingPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectBooth, setSelectBooth] = useState<Booth | undefined>(undefined);
  const [selectBoothId, setSelectBoothId] = useState<string>();
  const [selectOrderType, setSelectOrderType] = useState<ReserveType>('reserve');
  const [reserveBoothList, setReserveBoothList] = useState<Booth[]>([]);
  const reserveNum = useRef(0);
  const isUpdate = useRef(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const { boothList, setBoothList, getAllBoothList } = useBoothList();
  const { openBoothReservePopup, openPopup } = useReservePopupStore();
  const { searchKeyword, setSearchKeyword, reserveList, getReserveList, deleteReserve, confirmReserve, restoreReserve, getFilteredReserveList} = useReserveListStore();
  const { openMessageModal, openMessageCustomModal } = useMessageModalStore();
  const { getNightBoothInfo } = useBoothDetail();
  const { getMessage } = useMessageStore();

  const { isAdmin, userOwnBoothId } = useUserStore();

  const setIsUpdate = (reserveLength: number) => {
    if(isUserChecked) {
      isUpdate.current = false;
    } else if (reserveLength !== reserveNum.current) {
      isUpdate.current = true;
    } else if (reserveLength === reserveNum.current && isUserChecked) {
      isUpdate.current = false;
    }
    reserveLength = reserveLength;
  };

  const handleDelete = async (reserveId: string) => {
    if (!selectBoothId) {
      console.warn('선택된 부스 ID가 없습니다.');
      return;
    }
  
    const status = await deleteReserve({
      boothId: selectBoothId,
      reserveId: reserveId,
    });
  
    if (status) {
      const [result1] = await Promise.allSettled([
        getReserveList({ boothId: selectBoothId, type: selectOrderType }),
        getReserveList({ boothId: selectBoothId, type: 'reserve' }),
      ]);
  
      if (result1.status === 'fulfilled' && Array.isArray(result1.value)) {
        setIsUpdate(result1.value.length);
      }
    }
  };

  const handleConfirm = async (reserveId: string) => {
    if (!selectBoothId) return;
  
    const status = await confirmReserve({
      boothId: selectBoothId,
      reserveId,
    });
  
    if (status) {
      await Promise.allSettled([
        getReserveList({ boothId: selectBoothId, type: selectOrderType }),
        getReserveList({ boothId: selectBoothId, type: 'reserve' }),
      ]);
    }
  
    setIsUpdate(reserveList.reserve.length);
  };
  
  const handleClickMessage = (reserve: MessageInfo) => {
    openMessageModal(reserve);
  };
  
  const handleClickMessageCustom = async () => {
    if (!selectBoothId) return;
    await getMessage(selectBoothId);
    openMessageCustomModal();
  };
  
  const handleRestore = async (reserveId: string) => {
    if (!selectBoothId) return;
  
    const status = await restoreReserve({
      boothId: selectBoothId,
      reserveId,
      reserveType: selectOrderType,
    });
  
    if (status) {
      await Promise.allSettled([
        getReserveList({ boothId: selectBoothId, type: selectOrderType }),
        getReserveList({ boothId: selectBoothId, type: 'reserve' }),
      ]);
    }
  
    setIsUpdate(reserveList.reserve.length);
  };
  
  const handleClickOrderType = (type: ReserveType) => {
    if (!selectBooth?.isReservation) return;
  
    setIsUserChecked(type === 'reserve');
    setSelectOrderType(type);
  };
  
  const handleClickDelete = (reserve: ReserveItem) => {
    openPopup({
      reserveInfo: reserve,
      type: 'cancel',
      callback: () => handleDelete(reserve.reservationId),
    });
  };
  
  const handleClickConfirm = (reserve: ReserveItem) => {
    openPopup({
      reserveInfo: reserve,
      type: 'confirm',
      callback: () => handleConfirm(reserve.reservationId),
    });
  };
  
  const handleClickRestore = (reserve: ReserveItem) => {
    openPopup({
      reserveInfo: reserve,
      type: 'restore',
      callback: () => handleRestore(reserve.reservationId),
    });
  };

  const refreshReserveList = () => {
    clearRefresh(); // 중복 실행 방지
  
    interval.current = setInterval(async () => {
      if (!selectBoothId || !selectOrderType) return;
  
      if (selectOrderType === 'reserve') {
        await getReserveList({ boothId: selectBoothId, type: selectOrderType });
      } else {
        await Promise.allSettled([
          getReserveList({ boothId: selectBoothId, type: selectOrderType }),
          getReserveList({ boothId: selectBoothId, type: 'reserve' }),
        ]);
      }
  
      const updatedList = getFilteredReserveList('reserve');
      setIsUpdate(updatedList.length);
    }, 3000);
  };
  
  const clearRefresh = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  };
  
  // 초기 데이터 불러오기
  useEffect(() => {
    const fetchInitial = async () => {
      if (!selectBoothId || !selectOrderType) return;
  
      setIsLoading(true);
      await getNightBoothInfo(selectBoothId);
      await getReserveList({ boothId: selectBoothId, type: selectOrderType });
  
      const updatedList = getFilteredReserveList('reserve');
      setIsUpdate(updatedList.length);
  
      clearRefresh();
      refreshReserveList();
      setIsLoading(false);
    };
  
    fetchInitial();
  }, [selectBoothId, selectOrderType]);  

  useEffect(() => {
    if (!selectBoothId || reserveBoothList.length === 0) return;
  
    const booth = reserveBoothList.find((b) => b.boothId === selectBoothId);
    setSelectBooth(booth);
  }, [selectBoothId, reserveBoothList]);  
  
  useEffect(() => {
    setIsUserChecked(selectOrderType === 'reserve');
  }, [selectOrderType]);

  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      return document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1];
    };
  
    const init = async () => {
      const allBooths = await getAllBoothList();
  
      if (!allBooths || allBooths.length === 0) {
        alert('부스 정보가 없습니다.');
        return;
      }
  
      setBoothList(allBooths);
      setReserveBoothList(allBooths);
  
      const boothIdFromCookie = getCookie('boothId');
  
      let booth: Booth | undefined;
  
      if (boothIdFromCookie) {
        booth = allBooths.find((b) => b.boothId === boothIdFromCookie);
      }
  
      if (!booth && !isAdmin && userOwnBoothId) {
        booth = allBooths.find((b) => b.boothId === userOwnBoothId);
      }
  
      if (!booth && isAdmin) {
        booth = allBooths[0];
      }
  
      if (!booth) {
        alert('부스를 찾을 수 없습니다.');
        navigate('/');
        return;
      }
  
      setSelectBooth(booth);
      setSelectBoothId(booth.boothId);
      refreshReserveList();
    };
  
    void init();
  }, []);  

  useEffect(() => {
    return () => {
      clearRefresh();
    };
  }, []);  

  return (
    <div className="flex flex-col px-4 gap-[40px] min-w-[850px] pb-20">
      {/* 예약 Header */}
      <div className="flex flex-col justify-between pt-[100px] gap-4 lg:flex-row pb-8">
        <div className="flex items-center gap-4">
          <IconReservation />
          <div className="text-primary-800 text-xl md:text-2xl font-semibold">
            {selectBooth?.adminName} 예약 현황
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <button
            className="is-button font-semibold w-[100px] h-[40px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-800 cursor-pointer select-none"
            onClick={handleClickMessageCustom}
          >
            문자 커스텀
          </button>
          <div className="w-[255px] h-[40px] rounded-xl bg-primary-200 text-primary-800 flex justify-center items-center lg:text-lg text-md gap-[10px] font-semibold pl-3">
            예약 기능 ON/OFF
            <ToggleSwitch
              isActive={selectBooth?.isReservation}
              onClick={() => {
                if (!selectBooth) {
                  alert("부스 정보가 존재하지 않습니다.");
                  return;
                }

                openBoothReservePopup({
                  booth: selectBooth,
                  callback: (updated) => {
                    setSelectBooth(updated);

                    const updatedList = boothList.map((b) =>
                      b.boothId === updated.boothId ? updated : b
                    );

                    setBoothList(updatedList);
                  },
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* 예약 카테고리 */}
      <div className="flex justify-between min-w-[350px] gap-4">
        <div className="flex items-center gap-4">
          <button
            className={`is-button w-[100px] h-[40px] relative text-sm rounded-[16px] ${
              selectOrderType !== 'reserve' && 'is-outlined'
            }`}
            onClick={() => handleClickOrderType('reserve')}
          >
            예약 목록
            {isUpdate.current && isUserChecked && (
              <div className="rounded-full w-2 h-2 bg-danger-800 absolute right-2 top-[16px]"></div>
            )}
          </button>
          <button
            className={`is-button w-[100px] h-[40px] text-sm rounded-[16px] ${
              selectOrderType !== 'complete' && 'is-outlined'
            }`}
            onClick={() => handleClickOrderType('complete')}
          >
            입장 목록
          </button>
          <button
            className={`is-button w-[100px] h-[40px] is-danger text-sm rounded-[16px] ${
              selectOrderType !== 'cancel' && 'is-outlined'
            }`}
            onClick={() => handleClickOrderType('cancel')}
          >
            취소 목록
          </button>
        </div>

        {/* 검색바 */}
        <div className="w-[450px] h-[40px] rounded-2xl bg-primary-200 text-primary-800 flex justify-center items-center text-sm gap-[10px]">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="peer block w-full p-3 ps-10 text-xs text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예약 검색(예약자, 전화번호...)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="button"
              className="absolute end-2.5 bottom-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-[5px] is-button"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Admin */}
      {/* <div className="flex justify-between min-w-[350px] items-center gap-4" v-if="isAdmin">
        <div className="flex-shrink-0 text-md font-semibold">학과 선택:</div>

        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          v-model="selectBoothId"
        >
          <option v-for="(booth, boothIndex) in reserveBoothList" :key="boothIndex" :value="booth.boothId">
            {{ booth.adminName }} - {{ booth.boothName }}
          </option>
        </select>
      </div> */}

      {/* 목록 */}
      <div className="relative overflow-x-auto outline outline-1 outline-primary-400 rounded-2xl shadow-secondary">
        <table className="w-full text-xs lg:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs lg:text-sm uppercase bg-primary-50 border-b-1 border-secondary-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-secondary-700-light font-medium capitalize truncate">No.</th>
              <th scope="col" className="px-6 py-3 text-center text-secondary-700-light font-medium capitalize truncate">예약 번호</th>
              <th scope="col" className="px-6 py-3 text-center text-secondary-700-light font-medium truncate">예약자</th>
              <th scope="col" className="px-6 py-3 text-center text-secondary-700-light font-medium truncate">인원수</th>
              <th scope="col" className="px-6 py-3 text-center text-secondary-700-light font-medium truncate">연락처</th>
              <th scope="col" className="px-6 py-3 text-center text-secondary-700-light font-medium truncate">예약 시간</th>
              <th
                scope="col"
                colSpan={3}
                className="px-6 py-3 text-center text-secondary-700-light font-medium min-w-[140px]"
              >
                예약 관리
              </th>
            </tr>
          </thead>
          <tbody className="text-xs lg:text-sm">
            {!isLoading && selectBooth?.isReservation && (
              getFilteredReserveList(selectOrderType).map((reserve, index) => (
                <tr
                  key={index}
                  className="bg-white border-b-1 border-secondary-100 text-secondary-700 last:border-0"
                >
                  <th scope="row" className="px-4 py-4 whitespace-nowrap text-center font-normal">
                    {index + 1}
                  </th>
                  <th scope="row" className="px-4 py-4 whitespace-nowrap text-center font-normal">
                    {reserve.reservationNum}
                  </th>
                  <td className="px-4 py-4 text-center min-w-[85px] lg:min-w-[100px]">
                    {reserve.userName}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {reserve.personCount}명
                  </td>
                  <td className="px-4 py-4 text-center truncate">
                    {prettyPhoneNumber(reserve.phoneNum)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {prettyDate(reserve.updateAt)} 20:30
                  </td>
                  {selectOrderType !== "complete" && (
                    <td className="px-[2px] py-4 lg:px-1 w-10 lg:w-12">
                      <div className="w-full flex justify-center">
                        <button
                          type="button"
                          className="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs"
                          onClick={() => handleClickConfirm(reserve)}
                        >
                          입장
                        </button>
                      </div>
                    </td>
                  )}
                  {selectOrderType !== "cancel" && (
                    <td className="py-4 px-[2px] w-10 lg:w-12">
                      <div className="w-full flex justify-center">
                        <button
                          type="button"
                          className="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs is-danger is-outlined"
                          onClick={() => handleClickDelete(reserve)}
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  )}
                  {selectOrderType !== "reserve" && (
                    <td className="py-4 lg:px-2 w-10 lg:w-12">
                      <div className="w-full flex justify-center">
                        <button
                          type="button"
                          className="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs is-outlined"
                          onClick={() => handleClickRestore(reserve)}
                        >
                          예약
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="py-4 pl-1 pr-4 w-10 lg:w-12">
                    <div className="w-full flex justify-center">
                      <button
                        type="button"
                        className="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs is-outlined"
                        onClick={() => handleClickMessage(reserve)}
                      >
                        문자
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!isLoading &&
              getFilteredReserveList(selectOrderType).length === 0 &&
              selectBooth?.isReservation && (
                <tr>
                  <td scope="col" colSpan={9}>
                    <div className="w-full justify-center items-center flex flex-col py-10 bg-white rounded-b-[20px]">
                      <IconNotFound width={200} />
                      <p className="text-lg py-4">검색 내역이 없습니다...</p>
                    </div>
                  </td>
                </tr>
              )}
            {!selectBooth?.isReservation && (
              <tr>
                <td scope="col" colSpan={9}>
                  <div className="w-full justify-center items-center flex flex-col py-10 bg-white rounded-b-[20px]">
                    <IconNotFound width={200} />
                    <p className="text-lg py-4">예약 기능이 꺼져있습니다...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablingPage;