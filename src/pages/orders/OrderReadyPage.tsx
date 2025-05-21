import { useEffect, useState } from 'react';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import IconNotFound from '@/components/icons/IconNotFound';
import OrderReadyCard from '@/components/orders/OrderReadyCard';
import IconRefreshVector from '@/components/icons/IconRefreshVector';
import IconSearch from '@/components/icons/IconSearch';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';
import { useDate } from '@/stores/commons/date';
import { ORDER_FILTER } from '@/constants/constant';
import { WaitDepositOrder } from '@/types/orders/order.types';

const OrderReadyPage: React.FC = () => {
  const { boothId } = useTableStatusOrder();
  const { nowDate } = useDate();
  const {
    waitDepositList,
    getWaitDepositOrderList,
    initWaitDepositOrderList,
  } = useDepositOrder();

  const [searchMenu, setSearchMenu] = useState('');
  const [selectedFilterMenu, setSelectedFilterMenu] = useState(ORDER_FILTER['all']);
  const [isFocus, setIsFocus] = useState(false);
  const [filteredMenuList, setFilteredMenuList] = useState<WaitDepositOrder[]>([]);

  const updateFilteredMenuList = () => {
    let filtered = [...waitDepositList];

    if (searchMenu) {
      filtered = filtered.filter((order) => {
        const basicInfo = `${order.tableNum}${order.userName}${order.phoneNum}`;
        const menuNames = order.menuList.map((m) => m.menuName).join('');
        return basicInfo.includes(searchMenu) || menuNames.includes(searchMenu);
      });
    }

    if (selectedFilterMenu === ORDER_FILTER.table) {
      filtered.sort((a, b) => b.tableNum - a.tableNum);
    } else if (selectedFilterMenu === ORDER_FILTER.price) {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (selectedFilterMenu === ORDER_FILTER.recent) {
      filtered.sort((a, b) => (b.createAt ?? '').localeCompare(a.createAt ?? ''));
    }

    setFilteredMenuList(filtered);
  };

  const handleClickRefreshButton = async () => {
    await getWaitDepositOrderList({ boothId, date: nowDate });
  };

  useEffect(() => {
    updateFilteredMenuList();
  }, [waitDepositList, selectedFilterMenu, searchMenu]);

  useEffect(() => {
    if (boothId) getWaitDepositOrderList({ boothId, date: nowDate });
  }, [boothId]);

  useEffect(() => {
    initWaitDepositOrderList();
    getWaitDepositOrderList({ boothId, date: nowDate });
  }, []);

  return (
      <div className='w-full'>
          <div className='w-full flex justify-between mb-6'>
              <div className='min-w-[360px] flex items-center mr-5'>
                  <div className='flex gap-[10px] px-5'>
                      {Object.values(ORDER_FILTER).map((orderMenu, idx) => (
                          <div
                              key={idx}
                              className={`cursor-pointer text-sm ${
                                  selectedFilterMenu === orderMenu
                                      ? 'font-bold'
                                      : ''
                              }`}
                              onClick={() => setSelectedFilterMenu(orderMenu)}>
                              {orderMenu}
                          </div>
                      ))}
                  </div>
                  <button
                      className='is-button w-[85px] h-[30px] gap-1 text-xs flex justify-center items-center'
                      onClick={() => handleClickRefreshButton()}>
                      <IconRefreshVector />
                      새로고침
                  </button>
              </div>
              <div
                  className={`w-[350px] h-[40px] rounded-xl flex items-center px-[11px] bg-white gap-1 outline ${
                      isFocus
                          ? 'outline-primary-800-light-70 outline-2'
                          : 'outline-gray-300 outline-1'
                  }`}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}>
                  <IconSearch fillColor='#97C9FF' />
                  <input
                      value={searchMenu}
                      onChange={(e) => setSearchMenu(e.target.value)}
                      placeholder='주문 검색'
                      className='grow focus:outline-none text-sm'
                  />
                  <button className='w-[75px] h-[30px] rounded-xl text-sm bg-primary-800 text-white'>
                      Search
                  </button>
              </div>
          </div>
          <div className='grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10'>
              {filteredMenuList.length > 0 ? (
                  filteredMenuList.map((order, idx) => (
                      <OrderReadyCard key={idx} {...order} />
                  ))
              ) : (
                  <div className='flex flex-col justify-center items-center'>
                      <IconNotFound width={200} />
                      <div className='text-lg text-gray-500 pt-3 select-none'>
                          입금 대기중인 주문이 없어요...
                      </div>
                  </div>
              )}
          </div>
      </div>
  )
};

export default OrderReadyPage;