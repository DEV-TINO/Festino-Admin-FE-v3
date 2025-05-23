import React, { useEffect, useRef, useState } from 'react';
import { useCancelOrder } from '@/stores/orders/cancelOrder';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';
import { useDate } from '@/stores/commons/date';
import OrderCancelCard from '@/components/orders/OrderCancelCard';
import { ORDER_FILTER } from '@/constants/constant';
import IconNotFound from '@/components/icons/IconNotFound';
import IconSearch from '@/components/icons/IconSearch';
import IconRefreshVector from '@/components/icons/IconRefreshVector';

const CancelOrderPage: React.FC = () => {
  const { boothId } = useTableStatusOrder();
  const { nowDate } = useDate();
  const { cancelList, getCancelOrderList, initCancelOrderList } = useCancelOrder();

  const [selectedFilterMenu, setSelectedFilterMenu] = useState(ORDER_FILTER['all']);
  const [searchMenu, setSearchMenu] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [filteredMenuList, setFilteredMenuList] = useState<typeof cancelList>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilteredMenuList = () => {
    let filtered = [...cancelList];

    if (searchMenu) {
      filtered = filtered.filter((order) => {
        const basicInfo = `${order.tableNum}${order.userName}${order.phoneNum}`;
        const menuNames = order.menuList.map((menu) => menu.menuName).join('');
        return basicInfo.includes(searchMenu) || menuNames.includes(searchMenu);
      });
    }

    switch (selectedFilterMenu) {
      case ORDER_FILTER.table:
        filtered.sort((a, b) => b.tableNum - a.tableNum);
        break;
      case ORDER_FILTER.price:
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case ORDER_FILTER.recent:
        filtered.sort((a, b) => (b.createAt || '').localeCompare(a.createAt || ''));
        break;
    }

    setFilteredMenuList(filtered);
  };

  const handleClickRefreshButton = async () => {
    await getCancelOrderList({ boothId, date: nowDate });
  };

  // 3초마다 갱신
  useEffect(() => {
    if (!boothId) return;

    initCancelOrderList();
    getCancelOrderList({ boothId, date: nowDate });

    intervalRef.current = setInterval(() => {
      getCancelOrderList({ boothId, date: nowDate });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [boothId, nowDate]);

  useEffect(() => {
    updateFilteredMenuList();
  }, [cancelList, selectedFilterMenu, searchMenu]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="min-w-[360px] flex items-center mr-5">
          <div className="flex gap-[10px] px-5">
            {Object.values(ORDER_FILTER).map((filter) => (
              <div
                key={filter}
                className={`cursor-pointer text-sm ${selectedFilterMenu === filter ? 'font-bold' : ''}`}
                onClick={() => setSelectedFilterMenu(filter)}
              >
                {filter}
              </div>
            ))}
          </div>
          <button
            className="is-button w-[85px] h-[30px] gap-1 text-xs flex justify-center items-center cursor-pointer"
            onClick={handleClickRefreshButton}
          >
            <IconRefreshVector className="w-4 h-4 p-[2px]" /> 새로고침
          </button>
        </div>
        <div
          className={`w-[410px] h-[40px] rounded-xl flex items-center px-[11px] bg-white gap-1 outline ${isFocus ? 'outline-primary-900 outline-2' : 'outline-gray-300 outline-1'}`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        >
          <IconSearch fillColor='#97C9FF' />
          <input
            value={searchMenu}
            onChange={(e) => setSearchMenu(e.target.value)}
            placeholder="주문 검색"
            className="grow focus:outline-none text-sm"
          />
          <button className="w-[75px] h-[30px] rounded-xl text-sm bg-primary-800 text-white">
            Search
          </button>
        </div>
      </div>

      <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
        {filteredMenuList.length > 0 ? (
          filteredMenuList.map((order, index) => (
            <OrderCancelCard key={index} {...order} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <IconNotFound width={200} />
            <div className="text-lg text-gray-500">주문 취소된 주문이 없어요...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelOrderPage;