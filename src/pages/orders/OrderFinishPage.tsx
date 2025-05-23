import { useEffect, useRef, useState } from 'react';
import { useFinishOrder } from '@/stores/orders/finishOrder';
import { useDate } from '@/stores/commons/date';
import { ORDER_FILTER } from '@/constants/constant';
import IconRefreshVector from '@/components/icons/IconRefreshVector';
import IconSearch from '@/components/icons/IconSearch';
import IconNotFound from '@/components/icons/IconNotFound';
import OrderFinishCard from '@/components/orders/OrderFinishCard';
import { FinishOrder } from '@/types/orders/order.types';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';

const OrderFinishPage: React.FC = () => {
  const { boothId } = useTableStatusOrder();
  const { nowDate } = useDate();
  const {
    finishList,
    getFinishOrderList,
    initFinishOrderList,
  } = useFinishOrder();

  const [selectedFilterMenu, setSelectedFilterMenu] = useState(ORDER_FILTER['all']);
  const [searchMenu, setSearchMenu] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [filteredMenuList, setFilteredMenuList] = useState<FinishOrder[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilteredMenuList = () => {
    let filtered = [...finishList];

    if (searchMenu) {
      filtered = filtered.filter((order) => {
        const basicInfo = `${order.tableNum}${order.userName}${order.phoneNum}`;
        const menuNames = order.menuList.map((menu) => menu.menuName).join('');
        return basicInfo.includes(searchMenu) || menuNames.includes(searchMenu);
      });
    }

    if (selectedFilterMenu === ORDER_FILTER.table) {
      filtered.sort((a, b) => b.tableNum - a.tableNum);
    } else if (selectedFilterMenu === ORDER_FILTER.price) {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (selectedFilterMenu === ORDER_FILTER.recent) {
      filtered.sort((a, b) => (b.finishAt ?? '').localeCompare(a.finishAt ?? ''));
    }

    setFilteredMenuList(filtered);
  };

  const handleClickRefreshButton = async () => {
    await getFinishOrderList({ boothId, date: nowDate });
  };

  // 3초마다 갱신
  useEffect(() => {
    if (!boothId) return;

    initFinishOrderList();
    getFinishOrderList({ boothId, date: nowDate });

    intervalRef.current = setInterval(() => {
      getFinishOrderList({ boothId, date: nowDate });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [boothId, nowDate]);

  useEffect(() => {
    updateFilteredMenuList();
  }, [finishList, selectedFilterMenu, searchMenu]);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between mb-6">
        <div className="min-w-[360px] flex items-center mr-5">
          <div className="flex gap-[10px] px-5">
            {Object.values(ORDER_FILTER).map((orderMenu, idx) => (
              <div
                key={idx}
                className={`cursor-pointer text-sm ${selectedFilterMenu === orderMenu ? 'font-bold' : ''}`}
                onClick={() => setSelectedFilterMenu(orderMenu)}
              >
                {orderMenu}
              </div>
            ))}
          </div>
          <button
            className="is-button w-[85px] h-[30px] gap-1 text-xs flex justify-center items-center"
            onClick={handleClickRefreshButton}
          >
            <IconRefreshVector className="w-4 h-4 p-[2px]" />
            새로고침
          </button>
        </div>
        <div
          className={`w-[410px] h-[40px] rounded-xl flex items-center px-[11px] bg-white gap-1 outline ${
            isFocus ? 'outline-primary-900 outline-2' : 'outline-gray-300 outline-1'
          }`}
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
          <button className="w-[75px] h-[30px] rounded-xl text-sm bg-primary-800 text-white">Search</button>
        </div>
      </div>
      <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
        {filteredMenuList.length > 0 ? (
          filteredMenuList.map((order, idx) => (
            <OrderFinishCard key={idx} {...order} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <IconNotFound width={200} />
            <div className="text-lg text-gray-500">조리 완료된 주문이 없어요...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFinishPage;