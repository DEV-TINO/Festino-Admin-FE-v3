import IconDropDown from '@/components/icons/IconDropDown';
import IconScroll from '@/components/icons/IconScroll';
import StatisticsGraph from '@/components/orders/StatisticsGraph';
import { ACTIVE_DATE_MAP, DATES, STATISTICS_TYPE } from '@/constants/constant';
import { useBoothList } from '@/stores/booths/boothList';
import { useDate } from '@/stores/commons/date';
import { useUserStore } from '@/stores/logins/userStore';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';
import { Booth } from '@/types/booths/booth.types';
import { OrderStatisticState, Statistic } from '@/types/orders/statistics.types';
import { formatMonth, prettyPrice } from '@/utils/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const OrderStatisticsPage: React.FC = () => {
  const [month] = useState<number>(5);
  const [day, setDay] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDate, setActiveDate] = useState<number>(1);

  const currentMonth = new Date().getMonth() + 1;
  const today = new Date().getDate();

  const { boothList, getAllBoothList } = useBoothList();
  const { boothId } = useTableStatusOrder();
  const { nowDate } = useDate();
  const { userOwnBoothId } = useUserStore();
  const { type, setType, allOrderStatistics, getStatistics } = useOrderStatistics();
  const [sortedMenu, setSortedMenu] = useState<OrderStatisticState>(allOrderStatistics);

  const myBooth = useRef<Booth>(undefined);

  const determineActiveDate = (): number => {
    if (currentMonth < 25) return 1;
    if (currentMonth > 28) return 3;
    if (ACTIVE_DATE_MAP[today]) return ACTIVE_DATE_MAP[today];
    return today < 11 ? 1 : 3;
  };

  const formattedDateList = useMemo(() => {
    return (Object.keys(DATES) as Array<keyof typeof DATES>).map((key) => ({
      day: key.padStart(2, '0'),
      dateName: DATES[key],
    }));
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const handleButtonClick = async (key: number) => {
    if (key !== activeDate) {
      setActiveDate(key);
      setDay(ACTIVE_DATE_MAP[key]);
    }
    await fetchStatistics();
  };  

  const sortStrategies: Record<string, (a: Statistic, b: Statistic) => number> = {
    nameAsc: (a, b) => a.menuName.localeCompare(b.menuName),
    nameDesc: (a, b) => b.menuName.localeCompare(a.menuName),
    priceAsc: (a, b) => a.menuPrice - b.menuPrice,
    priceDesc: (a, b) => b.menuPrice - a.menuPrice,
    countAsc: (a, b) => a.menuCount - b.menuCount,
    countDesc: (a, b) => b.menuCount - a.menuCount,
    saleAsc: (a, b) => a.menuSale - b.menuSale,
    saleDesc: (a, b) => b.menuSale - a.menuSale,
  };

  const handleStatisticsSort = (sortKey: keyof typeof sortStrategies) => {
    const sortFn = sortStrategies[sortKey];
    if (sortFn) {
      const sorted = [...allOrderStatistics.menuSaleList].sort(sortFn);
      setSortedMenu({
        ...allOrderStatistics,
        menuSaleList: sorted
      });
    }
  };

  useEffect(() => {
    setType("all");
    setActiveDate(determineActiveDate());
    fetchStatistics();
  }, []);

  useEffect(() => {
    const init = async () => {
      const all = await getAllBoothList();
      if (all && userOwnBoothId) {
        const booth = all.find((b) => b.boothId === userOwnBoothId);
        if (booth) {
          myBooth.current = booth;
        }
      }
    };
    init();
  }, [userOwnBoothId]);
  
  useEffect(() => {
    if (!userOwnBoothId || boothList.length === 0) return;
  
    const booth = boothList.find((booth) => booth.boothId === userOwnBoothId);
    if (booth) {
      myBooth.current = booth;
    }
  }, [boothList, userOwnBoothId]);  

  // 통계 API로 갱신되면 정렬 데이터도 초기화
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!boothId || !nowDate) return;

    const poll = async () => {
      await getStatistics({ boothId, date: day, type });
      const { allOrderStatistics } = useOrderStatistics.getState();
      setSortedMenu({
        ...allOrderStatistics,
        menuSaleList: [...allOrderStatistics.menuSaleList],
      });
    };

    // 최초 1회 실행
    poll();

    // 3초마다 실행
    intervalRef.current = setInterval(() => {
      poll();
    }, 3000);

    // 컴포넌트 언마운트 시 clear
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [boothId, nowDate, type, day]);

  return (
    <div className="flex flex-col">
      {/* 통계 낼 메뉴 목록 선택 (전체/일반/서비스) */}
      <div className="flex justify-end gap-4 mb-4 mr-4">
        {Object.entries(STATISTICS_TYPE).map(([key, toggle]) => (
          <div 
            key={key} 
            className="flex items-center"
            onClick={() => setType(toggle.type)}
          >
            <input
              id={`toggle-${key}`}
              type="radio"
              value={key}
              name="toggle"
              checked={type === toggle.type}
              onChange={() => setType(toggle.type)}
              className="w-4 h-4 text-primary-800 bg-gray-100 border-gray-300 focus:ring-primary-800 checked:ring-primary-800 checked:bg-primary-800"
            />
            <label
              htmlFor={`toggle-${key}`}
              className="ms-2 text-sm font-medium text-gray-900 select-none"
            >
              {toggle.value}
            </label>
          </div>
        ))}
      </div>

      {/* 통계 영역 */}
      <div className="w-full h-[530px] flex overflow-x-scroll scrollbar-hide">
        {/* 왼쪽: 그래프 자리 */}
        <div className="w-1/2 min-w-[300px] pt-20 pl-10 h-full border border-primary-800 rounded-l-[20px]">
          {isLoading ? (
            <div className="text-primary-800 font-semibold h-[500px] flex justify-center items-center">데이터를 불러오고 있습니다..</div>
          ) : (
            <>
              <StatisticsGraph />
              <div className="flex justify-end items-center pr-4">
                <IconScroll className="w-5 h-5 mr-1" />
                <p className="text-xs text-gray-500 font-semibold">스크롤</p>
              </div>
            </>
          )}
        </div>
        
        {/* 오른쪽: 통계 표 영역 */}
        <div className="w-1/2 min-w-[540px] h-full overflow-hidden p-[40px] border-r border-y border-primary-800 rounded-r-[20px] flex flex-col justify-between items-center">
          <div>
            <div className="min-w-[432px] font-semibold text-primary-800 text-xl flex justify-center select-none pb-5">
              {`${myBooth.current?.adminName ?? '내'}`} 야간부스 매출 통계
            </div>
            {/* 날짜 선택 */}
            <div className="w-full flex justify-center gap-3">
              {formattedDateList.map((dateInfo, key) => (
                <button
                  key={key}
                  type="button"
                  className={`min-w-[110px] h-[35px] is-button relative rounded-[16px] text-sm ${
                    ACTIVE_DATE_MAP[Number(dateInfo.day)] !== day ? 'is-outlined' : ''
                  }`}
                  onClick={() => handleButtonClick(Number(dateInfo.day))}
                >
                  {formatMonth(month)}/{dateInfo.day} ({dateInfo.dateName})
                </button>
              ))}
            </div>
          </div>

          {/* 표 */}
          <div className="max-w-[712px] w-full h-[330px] rounded-3xl flex flex-col text-secondary-700 outline outline-1 bg-white outline-[rgba(0,115,240,0.16)] relative">
            {/* Table Header */}
            <div className="h-[50px] flex justify-between bg-primary-200 rounded-t-3xl font-semibold px-7 border-b-1 border-primary-300 items-center text-[13px]">
              <div className="basis-2/3 flex items-center">
                메뉴
                <div className="ml-2">
                  <IconDropDown
                    className="-scale-y-100 w-2 h-2 cursor-pointer"
                    onClick={() => handleStatisticsSort("nameAsc")}
                  />
                  <IconDropDown
                    onClick={() => handleStatisticsSort("nameDesc")}
                  />
                </div>
              </div>
              <div className="basis-1/4 min-w-[89px] flex items-center justify-center">
                가격
                <div className="ml-2">
                  <IconDropDown
                    className="-scale-y-100 w-2 h-2 cursor-pointer"
                    onClick={() => handleStatisticsSort("priceAsc")}
                  />
                  <IconDropDown
                    onClick={() => handleStatisticsSort("priceDesc")}
                  />
                </div>
              </div>
              <div className="basis-1/6 flex items-center justify-center truncate">
                수량
                <div className="ml-2">
                  <IconDropDown
                    className="-scale-y-100 w-2 h-2 cursor-pointer"
                    onClick={() => handleStatisticsSort("countAsc")}
                  />
                  <IconDropDown
                    onClick={() => handleStatisticsSort("countDesc")}
                  />
                </div>
              </div>
              <div className="basis-1/4 min-w-[130px] flex items-center justify-end">
                판매량
                <div className="ml-2">
                  <IconDropDown
                    className="-scale-y-100 w-2 h-2 cursor-pointer"
                    onClick={() => handleStatisticsSort("saleAsc")}
                  />
                  <IconDropDown
                    onClick={() => handleStatisticsSort("saleDesc")}
                  />
                </div>
              </div>
            </div>

            {/* Table Row */}
            <div className="h-full overflow-y-scroll scrollbar-hide">
              {sortedMenu.menuSaleList.map((menu, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between font-normal px-8 min-h-8 items-center border-b-1 border-secondary-300 shrink-0 hover:bg-gray-200 text-[13px]"
                >
                  <p className="basis-2/3 text-secondary-700">{menu.menuName}</p>
                  <p className="basis-1/4 text-secondary-700 min-w-fit text-center">{prettyPrice(menu.menuPrice || 0)}</p>
                  <p className="basis-1/6 text-secondary-700 text-center">{menu.menuCount}개</p>
                  <p className="basis-1/4 text-secondary-700 min-w-[130px] text-right">{prettyPrice(menu.menuSale || 0)}</p>
                </div>
              ))}
            </div>

            {/* 총 금액 */}
            <div className="grid place-items-center text-primary-800 font-medium text-lg h-14 rounded-b-3xl bottom-0 shrink-0 bg-white border-secondary-600 shadow-[0px_-5px_6px_0px_rgba(0,0,0,0.1)]">
              총액 : {prettyPrice(allOrderStatistics.totalSale || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatisticsPage;