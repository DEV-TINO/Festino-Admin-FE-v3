import React, { useEffect, useRef } from 'react';
import IconBoothInfo from '@/components/icons/IconBoothInfo';
import IconBoothListToggle from '@/components/icons/IconBoothListToggle';
import IconIndicator from '@/components/icons/IconIndicator';
import IconRadio from '@/components/icons/IconRadio';
import { prettyPrice } from '@/utils/utils';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { alertError, api } from '@/utils/api';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/constants/constant';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const BoothDetailPage: React.FC = () => {
  const { reset, init, boothInfo, menuList, updateBoothInfo, updateMenuList } = useBoothDetail();
  const { tableNum, tableNumList } = useTableDetail();
  const { boothId } = useParams<{ boothId: string }>();

  const scrollContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const IMAGE_WIDTH = 210;

  const scrollImage = (direction: 'left' | 'right') => {
    const scrollAmount = direction === 'left' ? -IMAGE_WIDTH : IMAGE_WIDTH;
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleClickLeftIndicator = () => {
    scrollImage('left');
  };

  const handleClickRightIndicator = () => {
    scrollImage('right');
  };

  const handleClickSoldOut = async (menu: any) => {
    try {
      const response = await api.put('/admin/menu/sold-out', {
        menuId: menu.menuId,
        isSoldOut: menu.isSoldOut,
        boothId: boothInfo.boothId,
      });
      if (response.data.success) {
        menu.isSoldOut = response.data.data.isSoldOut;
        updateMenuList(response.data.data.isSoldOut);
      } else {
        alertError(response.data.message);
      }
    } catch (error) {
      alertError('Error updating menu status');
    }
  };

  const handleClickBoothOpen = async () => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[boothInfo.adminCategory]}/open`, {
        boothId: boothInfo.boothId,
        isOpen: boothInfo.isOpen,
      });
      if (response.data.success) {
        updateBoothInfo({ isOpen: response.data.data.isOpen });
      } else {
        alertError(response.data.message);
      }
    } catch (error) {
      alertError('Error opening booth');
    }
  };


  const handleClickBoothEdit = () => {
    navigate(`/booth/${boothId}/edit`);
  };

  const handleClickTableNum = (index: number) => {
    navigator.clipboard.writeText(tableNumList[index].orderUrl);
    alert('QR 코드 주소가 복사되었습니다.');
  };

  useEffect(() => {
    const fetchData = async () => {
      reset();
      if (boothId) {
        const condition = await init(boothId);
        if (!condition) {
          alert('부스 정보를 불러오는데 실패했습니다.');
          navigate('/');
        }
      } else {
        alert('부스 정보를 불러오는데 실패했습니다.');
        navigate('/');
      }
    };
    fetchData();
  }, [boothId, navigate]);

  return (
    <div className="flex flex-col px-4 gap-[20px] min-w-[630px] pb-20">
      <form>
        <div className="flex justify-between pt-[100px] min-w-[350px] pb-[40px]">
          <div className="flex items-center gap-4">
            <IconBoothInfo />
            <div className="text-primary-800 text-xl md:text-2xl font-semibold">{boothInfo?.adminName} 부스 정보</div>
          </div>
          <button
            className="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-800 cursor-pointer select-none hover:bg-primary-900"
            type="button"
            onClick={() => handleClickBoothEdit()}
          >
            수정
          </button>
        </div>
        <div className="bg-white rounded-2xl w-full h-auto px-4 py-4 pb-12 gap-10 lg:py-[60px] lg:px-[60px] lg:gap-[60px] flex flex-col text-secondary-700 shadow-xs">
          <div className="flex flex-col gap-[20px] w-full">
            <div className="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold">
              부스 정보
            </div>
            <div className="w-full bg-primary-800-light-3 h-auto rounded-2xl px-[40px] py-[40px] border-1 border-primary-800-light-16">
              <div className="w-full bg-primary-800-light-8 h-full rounded-2xl border border-primary-800-light-16 grid grid-cols-[110px_1fr] grid-rows-[80px_80px_minmax(200px,_1fr)_280px] 2xl:grid-cols-[140px_1fr_140px_1fr] 2xl:grid-rows-[65px_minmax(150px,_1fr)_280px] place-items-stretch">
                <div className="flex items-center justify-center border-b border-r border-primary-800-light-16 px-4 text-sm font-medium">
                  부스 이름
                </div>
                <div className="bg-white flex items-center border-b text-sm border-primary-800-light-16 text-wrap px-6 lg:px-10 2xl:rounded-none rounded-tr-[20px]">
                  {boothInfo?.boothName}
                </div>
                <div className="flex items-center justify-center 2xl:border-x border-r border-b border-primary-800-light-16 px-3 font-medium text-sm">
                  운영시간
                </div>
                <div className="bg-white 2xl:rounded-tr-2xl flex items-center justify-between border-b border-primary-800-light-16 px-6 lg:px-10">
                  <div className="flex items-center text-sm justify-center gap-4 flex-wrap">
                    <div className="text-wrap">{boothInfo?.openTime}~{boothInfo?.closeTime}</div>
                    <div
                      className={`hidden text-[10px] sm:flex w-[45px] h-[25px] rounded-full items-center justify-center ${
                        boothInfo?.isOpen ? 'bg-primary-800-light-12 text-primary-800' : 'bg-danger-800-light-12 text-danger-800'
                      }`}
                    >
                      {boothInfo?.isOpen ? '운영중' : '준비중'}
                    </div>
                  </div>
                  <IconBoothListToggle isActive={boothInfo?.isOpen} onClick={handleClickBoothOpen} />
                </div>
                <div className="flex items-center justify-center border-b border-r border-primary-800-light-16 px-4 font-medium text-sm">
                  부스 소개
                </div>
                <div className="2xl:col-span-3 bg-white flex items-start border-b border-primary-800-light-16 px-6 lg:px-10 text-sm py-5 max-h-[400px] overflow-y-auto whitespace-pre-line">
                  {boothInfo?.boothIntro || '부스 소개가 없습니다.'}
                </div>
                <div className="flex items-center justify-center border-r border-primary-800-light-16 px-4 font-medium text-sm">
                  부스 이미지
                </div>
                <div className="min-w-full overflow-x-auto overflow-y-hidden 2xl:col-span-3 flex justify-between items-center bg-white rounded-br-[20px] border-primary-700 h-[280px] py-[40px] px-[40px] gap-[23px]">
                  <div
                    onClick={handleClickLeftIndicator}
                  >
                    <IconIndicator left />
                  </div>
                  <div className="grow flex gap-[10px] overflow-auto" ref={scrollContainer}>
                  {boothInfo.boothImage.map((boothImage, boothImageIndex) => (
                    <div
                      key={boothImageIndex}
                      className="w-[160px] h-[160px] rounded-2xl bg-gray-50 shrink-0 border border-gray-200 bg-contain bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(${boothImage})` }}
                    ></div>
                  ))}
                  </div>
                  <div
                    onClick={handleClickRightIndicator}
                  >
                    <IconIndicator right />
                  </div>
                </div>
              </div>
              <div className="flex items-start flex-col gap-[26px] py-10 lg:items-center lg:flex-row">
                <div className="w-[200px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold px-5 gap-3 shrink-0">
                  현재 테이블 개수 <span className="text-secondary-700">{tableNum}개</span>
                </div>
                <div className="text-secondary-700 text-sm">
                  * 테이블 번호 클릭 시 테이블의 QR 코드 주소가 복사됩니다.
                </div>
              </div>

              <div className="grid 3xl:grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 gap-5 place-items-center">
                {tableNumList.map((table, tableIndex) => (
                  <div
                    key={tableIndex}
                    className="h-14 flex text-center rounded-3lg shadow-secondary w-full"
                  >
                    <div
                      onClick={() => handleClickTableNum(tableIndex)}
                      className="w-[100px] bg-primary-800-light-8 rounded-l-3lg border-1 border-primary-800-light-24 text-secondary-700 font-medium text-sm grid place-items-center cursor-pointer"
                    >
                      테이블 {tableIndex + 1}
                    </div>
                    <div className="grow min-w-[120px] bg-white rounded-r-3lg border-1 border-primary-800-light-16 border-l-0 grid place-items-center text-secondary-800 text-sm font-semibold">
                      {table.customTableNum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            {ADMIN_CATEGORY[boothInfo.adminCategory] == 'night' && (
              <div className="flex flex-col gap-[20px] w-full">
                <div
                  className="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold"
                >
                  계좌 정보
                </div>
                <div className="w-full bg-primary-800-light-3 h-auto rounded-2xl px-[40px] py-[40px] border-1 border-primary-800-light-16">
                  <div
                    className="w-full bg-primary-800-light-8 h-full rounded-2xl border border-primary-800-light-16 grid grid-cols-[120px_1fr] grid-rows-[60px_60px_60px] 2xl:grid-cols-[120px_1fr_200px_1fr] 2xl:grid-rows-[60px_60px] place-items-stretch"
                  >
                    <div
                      className="flex items-center justify-center border-b border-r border-primary-800-light-16 px-4 text-sm font-medium"
                    >
                      예금주
                    </div>
                    <div
                      className="bg-white flex items-center border-b border-primary-800-light-16 text-wrap px-6 lg:px-10 2xl:rounded-none rounded-tr-[20px] text-sm"
                    >
                      { boothInfo.accountInfo?.accountHolder }
                    </div>
                    <div
                      className="flex items-center justify-center 2xl:border-x border-r border-b border-primary-800-light-16 px-4 font-medium text-sm"
                    >
                      은행명
                    </div>
                    <div
                      className="bg-white 2xl:rounded-tr-2xl flex items-center justify-between border-b border-primary-800-light-16 px-6 lg:px-10 text-sm"
                    >
                      { boothInfo.accountInfo?.bankName }
                    </div>
                    <div className="flex items-center justify-center border-r border-primary-800-light-16 px-4 text-sm font-medium">
                      계좌번호
                    </div>
                    <div
                      className="px-6 lg:px-10 2xl:col-span-3 bg-white flex items-center border-primary-800-light-16 rounded-br-2xl text-sm"
                    >
                      { boothInfo.accountInfo?.account }
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-[20px] w-full">
              <div
                className="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold"
              >
                메뉴 정보
              </div>
              <div
                className="bg-primary-800-light-3 rounded-2xl w-full lg:py-[40px] lg:px-[40px] px-4 py-4 flex flex-col border-1 border-primary-800-light-16"
              >
                <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2">
                  {menuList.length === 0 ? (
                    <div className="col-span-2 h-[220px] border-danger rounded-2xl border flex flex-col items-center justify-center bg-white">
                      <div className="text-xl text-danger-800">메뉴를 등록해주세요.</div>
                    </div>
                  ) : (
                    menuList.map((menu, menuIndex) => (
                      <div
                        key={menuIndex}
                        className="h-[170px] rounded-2xl flex text-sm items-center font-bold p-5 gap-[28px] bg-white hover:border-primary-800 border border-primary-800-light-16"
                      >
                        <div
                          className="hidden md:block w-[120px] h-[120px] bg-contain bg-no-repeat bg-center bg-white rounded-xl flex-shrink-0 border-gray-200 border"
                          style={{ backgroundImage: `url(${menu.menuImage})` }}
                        />
                        <div className="flex flex-col w-full justify-between">
                          <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center h-[29px] w-full min-w-fit gap-2">
                              <div className="w-3/5 text-base font-semibold text-secondary-800 truncate 2xl:max-w-[110px]">
                                {menu.menuName}
                              </div>
                              <div className="w-2/5 gap-[5px] items-center text-sm flex flex-shrink-0 justify-end grow font-medium 2xl:max-w-[130px]">
                                {ADMIN_CATEGORY[boothInfo.adminCategory] !== 'day' && (
                                  <div className="w-[55px] h-[25px] text-[10px] rounded-full bg-secondary-100 items-center flex justify-center text-secondary-800">
                                    {MENU_TYPE[menu.menuType]}
                                  </div>
                                )}
                                <button
                                  className={`w-[45px] h-[25px] rounded-full flex items-center justify-center cursor-text text-[10px] ${
                                    menu.isSoldOut
                                      ? 'bg-danger-800-light-12 text-danger-800'
                                      : 'bg-primary-800-light-12 text-primary-800'
                                  }`}
                                  type="button"
                                >
                                  {menu.isSoldOut ? '준비중' : '판매중'}
                                </button>
                              </div>
                            </div>
                            <p className="pt-[12px] pb-[12px] h-[78px] text-secondary-800 font-normal text-xs break-all text-wrap line-clamp-3">
                              {menu.menuDescription}
                            </p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <div className="text-secondary-800 font-bold text-base">
                              {prettyPrice(menu.menuPrice)}
                            </div>
                            <IconBoothListToggle
                              isActive={!menu.isSoldOut}
                              onClick={() => handleClickSoldOut(menu)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
              <div className="flex gap-6 md:gap-[40px] items-center flex-wrap">
                <div className="h-[45px] rounded-xl text-primary-800-light-86 flex items-center justify-center font-semibold text-md bg-primary-800-light-8 px-[24px]">
                  예약 기능 사용 여부
                </div>
                <div className="flex gap-[28px]">
                  <div
                    className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer">
                    <IconRadio isActive={boothInfo.isReservation} readOnly={true} />
                    <div
                      className={`text-sm font-semibold ${boothInfo.isReservation ? 'text-success-800' : 'text-danger-800'}`}
                    >
                      {boothInfo.isReservation ? '사용 중' : '사용 안함'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
              <div className="flex gap-6 md:gap-[40px] items-center flex-wrap">
                <div className="h-[45px] rounded-xl text-primary-800-light-86 flex items-center justify-center font-semibold text-md bg-primary-800-light-8 px-[24px]">
                  주문 기능 사용 여부
                </div>
                <div className="flex gap-[28px]">
                  <div
                    className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                  >
                    <IconRadio isActive={boothInfo.isOrder} readOnly={true} />
                    <div
                      className={`text-sm font-semibold ${
                        boothInfo.isOrder ? 'text-success-800' : 'text-danger-800'
                      }`}
                    >
                      {boothInfo.isOrder ? '사용 중' : '사용 안함'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
              <div className="flex gap-6 md:gap-[40px] items-center flex-wrap">
                <div className="h-[45px] rounded-xl text-primary-800-light-86 flex items-center justify-center font-semibold text-md bg-primary-800-light-8 px-[24px]">
                  직원 호출 기능 사용 여부
                </div>
                <div className="flex gap-[28px]">
                  <div
                    className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                  >
                    <IconRadio isActive={boothInfo.isCall} readOnly={true} />
                    <div
                      className={`text-sm font-semibold ${
                        boothInfo.isCall ? 'text-success-800' : 'text-danger-800'
                      }`}
                    >
                      {boothInfo.isCall ? '사용 중' : '사용 안함'}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
            <div className="flex gap-6 flex-col">
              {boothInfo.isKakaoPay && (
                <div className="flex gap-2 md:gap-4 items-center flex-wrap">
                  <div className="text-primary-800-light-86 flex items-center justify-center font-semibold text-md">
                    카카오페이
                  </div>
                  <div className="relative w-full">
                    <div className="w-full py-3 border border-primary-800-light-16 rounded-xl px-[20px] text-sm break-all">{boothInfo?.kakaoPay ?? ''}</div>
                  </div>
                </div>
              )}
              {boothInfo.isTossPay && (
                <div className="flex gap-2 md:gap-4 items-center flex-wrap">
                  <div className="text-primary-800-light-86 flex items-center justify-center font-semibold text-md">
                    토스페이
                  </div>
                  <div className="relative w-full">
                    <div className="w-full py-3 border border-primary-800-light-16 rounded-xl px-[20px] text-sm break-all">{boothInfo?.tossPay ?? ''}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          </div>
      </form>
    </div>
  );
};

export default BoothDetailPage;