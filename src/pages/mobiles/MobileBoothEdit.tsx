import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconBoothListToggle from '@/components/icons/IconBoothListToggle';
import IconFileUpload from '@/components/icons/IconFileUpload';
import IconAdd from '@/components/icons/IconAdd';
import IconRadio from '@/components/icons/IconRadio';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/constants/constant';
import { alertError, api, imagesUpload } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { useMenuModal } from '@/stores/booths/menuModal';
import IconDelete from '@/components/icons/IconDelete';
import { useUserStore } from '@/stores/logins/userStore';
import { useBoothList } from '@/stores/booths/boothList';

const BoothEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { boothId } = useParams<{ boothId: string }>();

  const { tableNum, tableNumList, openMobileTableDetailModal, submitTableDetail } = useTableDetail();
  const { setBoothInfo, boothInfo, menuList, createMenuList, deleteMenuList, patchMenuList, originalMenuList, addDeleteMenu, addPatchMenu, updateMenuList, init, deleteMenu, createMenu, patchMenu  } = useBoothDetail();
  const { openMobileModal } = useMenuModal();
  const { getAllBoothList, boothList } = useBoothList();
  const { isAdmin } = useUserStore();
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [serviceHours, setServiceHours] = useState('');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isKakaoPay, setIsKakaoPay] = useState<boolean>(false);
  const [isTossPay, setIsTossPay] = useState<boolean>(false);
  const [useReservation, setUseReservation] = useState<boolean>(false);
  const [useOrder, setUseOrder] = useState<boolean>(false);
  const [isCall, setIsCall] = useState<boolean>(false);
  const [selectedBoothId, setSelectedBoothId] = useState<string>('');

  const isSelectedImage = (index: number) => {
    if (selectedImageIndex !== -1) {
      if (index === selectedImageIndex) return 'border-primary-800';
      else return '';
    } else return '';
  };
  const handleClickTableCustom = () => {
    openMobileTableDetailModal();
  };

  const setBackgroundImage = (url: string): React.CSSProperties => {
    return {
      backgroundImage: `url(${url})`,
    };
  };

  const handleClickDeleteMenu = ({
    menuIndex,
    menuId,
  }: {
    menuIndex: number;
    menuId: string | undefined;
  }) => {
    if (isSubmit) return;

    if (menuId) {
      addDeleteMenu(menuId);
      menuList.splice(menuIndex, 1);
      updateMenuList(menuList);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const files = e.target.files;
    if (files) {
      const urls = await imagesUpload(files);
      setFileUrls(prev => {
        if (prev.length > 0 && prev[0] === '') {
          return [...urls, ...prev.slice(1)];
        }
        return [...prev, ...urls];
      });
    }
  };

  const handleInputBoothName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, boothName: event.target.value });
  };

  const handleInputBoothIntro = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, boothIntro: event.target.value });
  };

  const handleInputAccountHolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({
      ...current,
      accountInfo: {
        ...current.accountInfo,
        accountHolder: event.target.value,
      },
    });
  };

  const handleInputBankName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({
      ...current,
      accountInfo: {
        ...current.accountInfo,
        bankName: event.target.value,
      },
    });
  };

  const handleInputAccount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
  
    let inputValue = event.target.value;
    inputValue = inputValue.trim();
    inputValue = inputValue.replace(/\D/g, '-');
    event.target.value = inputValue;

    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({
      ...current,
      accountInfo: {
        ...current.accountInfo,
        account: inputValue,
      },
    });
  };

  const handleInputServiceHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
  
    const inputValue = event.target.value;
    setServiceHours(inputValue)

    const [start, end] = inputValue.split('~').map(t => t.trim());
  
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, openTime: start, closeTime: end });
  };

  const handleInputKakaoPay = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, kakaoPay: event.target.value });
  };

  const handleInputTossPay = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, tossPay: event.target.value });
  };

  const handleClickSubmit = async () => {
    if (isSubmit) return;
    setIsSubmit(true);

    if (
      !boothInfo.adminName.length ||
      !boothInfo.boothName.length ||
      !serviceHours.length ||
      !boothInfo.boothIntro.length ||
      (isTossPay && !boothInfo.tossPay?.length) ||
      (isKakaoPay && !boothInfo.kakaoPay?.length)
    ) {
      setIsSubmit(false);
      return;
    }
  
    const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]\s*~\s*([01]?[0-9]|2[0-4]):([0-5][0-9]|60)$/;
  
    if (!pattern.test(serviceHours.trim())) {
      alert('올바른 운영시간을 입력해주세요. 예: 00:00 ~ 24:00');
      return;
    }
  
    const [startTime, endTime] = serviceHours.split('~').map((time) => time.trim());
  
    const updatedBoothInfo = {
      ...boothInfo,
      openTime: startTime,
      closeTime: endTime,
      boothImage: fileUrls,
      isOpen: isOpen,
      isTossPay: isTossPay,
      isKakaoPay: isKakaoPay,
      isCall: isCall,
    };
  
    const saveBoothUrl = `/admin/booth/${ADMIN_CATEGORY[boothInfo.adminCategory]}`;
    const baseBoothInfo = {
      boothName: updatedBoothInfo.boothName,
      adminName: updatedBoothInfo.adminName,
      adminCategory: updatedBoothInfo.adminCategory,
      openTime: updatedBoothInfo.openTime,
      closeTime: updatedBoothInfo.closeTime,
      boothIntro: updatedBoothInfo.boothIntro,
      boothImage: updatedBoothInfo.boothImage,
      location: '',
      tossPay: updatedBoothInfo.tossPay,
      kakaoPay: updatedBoothInfo.kakaoPay,
      isOpen: updatedBoothInfo.isOpen,
      isTossPay: updatedBoothInfo.isTossPay,
      isKakaoPay: updatedBoothInfo.isKakaoPay,
      isCall: isCall,
    };
  
    let newBoothId = '';
  
    const boothCategory = ADMIN_CATEGORY[boothInfo.adminCategory];
  
    const saveBooth = async () => {
      try {
        let response;
  
        const payload =
          boothCategory === 'night'
            ? {
                ...baseBoothInfo,
                boothId: selectedBoothId,
                isOrder: useOrder,
                isReservation: useReservation,
                isCall: isCall,
                isTossPay: isTossPay,
                isKakaoPay: isKakaoPay,
                accountInfo: boothInfo.accountInfo,
              }
            : {
                ...baseBoothInfo,
                boothId: selectedBoothId,
              };
  
        if (selectedBoothId) {
          response = await api.put(saveBoothUrl, payload);
        } else {
          if (boothCategory === 'night') {
            response = await api.post(saveBoothUrl, {
              ...baseBoothInfo,
              isOrder: useOrder,
              isReservation: useReservation,
              isCall: isCall,
              isTossPay: isTossPay,
              isKakaoPay: isKakaoPay,
              accountInfo: boothInfo.accountInfo,
            });
          } else {
            response = await api.post(saveBoothUrl, baseBoothInfo);
          }
        }
  
        const data = response.data;
        if (data.success) {
          newBoothId = data.data;
        } else {
          alert('부스 정보를 저장하는데 실패했습니다.');
          return false;
        }
        return true;
      } catch (error) {
        console.error(error);
        alertError(error);
        return false;
      }
    };
  
    if (!boothCategory) {
      alert('부스 카테고리를 선택해주세요.');
      return;
    }
  
    const success = await saveBooth();
    if (!success) return;
  
    const newBoothInfo = { ...updatedBoothInfo, boothId: newBoothId };
    setBoothInfo(newBoothInfo);
  
    await Promise.allSettled([
      ...deleteMenuList.map((menuId) => deleteMenu(menuId)),
      ...patchMenuList.map((menu) => patchMenu(menu)),
      ...createMenuList.map((menu) => createMenu(menu)),
    ]);
  
    await Promise.allSettled(
      originalMenuList
        .map((originalMenu) => {
          const matched = menuList.find((menu) => menu.menuId === originalMenu.menuId);
          if (matched && matched.isSoldOut !== originalMenu.isSoldOut) {
            return api.put('/admin/menu/sold-out', {
              menuId: matched.menuId,
              isSoldOut: originalMenu.isSoldOut,
              boothId: newBoothId,
            });
          }
          return null;
        })
        .filter(Boolean) as Promise<any>[]
    );
  
    if (ADMIN_CATEGORY[boothInfo.adminCategory] === 'night') {
      const tableDetailResult = await submitTableDetail(boothInfo.boothId);
      if (!tableDetailResult) return;
    }
  
    setIsSubmit(false);
    navigate(`/mobile`);
  };

  const handleSelectImage = (index: number) => {
    if (selectedImageIndex === index) {
      setSelectedImageIndex(-1);
      return;
    }

    if (selectedImageIndex === -1) {
      setSelectedImageIndex(index);
    } else {
      const updatedUrls = [...fileUrls];
      const temp = updatedUrls[index];
      updatedUrls[index] = updatedUrls[selectedImageIndex];
      updatedUrls[selectedImageIndex] = temp;
      setFileUrls(updatedUrls);
      setSelectedImageIndex(-1);
    }
  };

  const handleDeleteImage = (id: number) => {
    const updatedUrls = fileUrls.filter((_, index) => index !== id);
    setFileUrls(updatedUrls);
    if (selectedImageIndex === id) {
      setSelectedImageIndex(-1);
    }
  };
  
  const handleSelectMenu = (index: number) => {
    if (selectedMenuIndex === index) {
      setSelectedMenuIndex(-1);
      return;
    }

    if (selectedMenuIndex === -1) {
      setSelectedMenuIndex(index);
    } else {
      const newList = [...menuList];
      [newList[index], newList[selectedMenuIndex]] = [newList[selectedMenuIndex], newList[index]];
      addPatchMenu(newList[index]);
      addPatchMenu(newList[selectedMenuIndex]);
      updateMenuList(newList);
      setSelectedMenuIndex(-1);
    }
  };

  const isSelectedMenu = (index: number): string => {
    if (selectedMenuIndex !== -1) {
      return index === selectedMenuIndex ? 'border-primary-800' : '';
    }
    return '';
  };

  useEffect(() => {
    const fetch = async () => {
      if (isAdmin) {
        await getAllBoothList();
        if (boothList.length > 0) {
          setSelectedBoothId(boothList[0].boothId);
          return;
        }
      } else {
        setSelectedBoothId(boothId ?? '');
      }
    };
  
    fetch();
  }, []);
  
  useEffect(() => {
    if (!selectedBoothId) return;
  
    const fetch = async () => {
      await init(selectedBoothId);
  
      const info = useBoothDetail.getState().boothInfo;
      setServiceHours(`${info.openTime} ~ ${info.closeTime}`);
      setIsCall(info.isCall);
      setIsOpen(info.isOpen);
      setUseOrder(info.isOrder);
      setUseReservation(info.isReservation);
      setIsTossPay(info.isTossPay);
      setIsKakaoPay(info.isKakaoPay);
      setFileUrls(info.boothImage ?? []);
    };
  
    fetch();
  }, [selectedBoothId]);

  return (
      <form className="w-full h-full mt-7"
        onSubmit={(e) => {
          e.preventDefault();
          handleClickSubmit();
        }}
      >
          <div className="px-mobile flex flex-col gap-[20px] text-secondary-700">
            {!isAdmin ? (
            <div className="flex gap-[10px] items-center">
              <div className="w-[90px] font-bold text-base shrink-0">학과</div>
              <div className="w-full h-11 px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm text-secondary-500-light-70">
              {boothInfo?.adminName}
              </div>
            </div>
            ) : (
              <div className="flex gap-[10px] items-center">
                <div className="w-[90px] font-bold text-base shrink-0">학과</div>
                <select
                  className="w-full h-11 px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm border-none"
                  value={selectedBoothId}
                  onChange={(e) => setSelectedBoothId(e.target.value)}
                >
                  {boothList.map((booth, index) => (
                    <option key={index} value={booth.boothId}>
                      {booth.adminName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-[10px] items-center">
              <div className="w-[90px] font-bold text-base shrink-0">부스이름</div>
              <input
                type="text"
                placeholder="부스 이름을 작성해주세요."
                className="w-full px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm border-none placeholder:text-secondary-500-light-70"
                maxLength={100}
                onChange={handleInputBoothName}
                value={boothInfo?.boothName ?? ''}
                disabled={isSubmit}
              />
            </div>
            <div className="flex gap-[10px] items-center">
              <div className="w-[90px] font-bold text-base shrink-0">운영 시간</div>
              <div className="w-full flex items-center gap-2">
                <div className="relative w-fit">
                  <input
                    className="w-full px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm border-none placeholder:text-secondary-500-light-70"
                    type="text"
                    maxLength={100}
                    placeholder="예시) 17:00 ~ 24:00"
                    onChange={handleInputServiceHours}
                    value={serviceHours}
                    disabled={isSubmit}
                  />
                </div>
                <IconBoothListToggle width={48} isActive={isOpen} onClick={() => setIsOpen(!isOpen)} />
              </div>
            </div>
            <div className="flex flex-col gap-[10px] items-start">
              <div className="font-bold text-base">부스 소개</div>
              <textarea
                className="resize-none w-full h-[200px] bg-secondary-900-light-3 rounded-3xl text-sm border-none p-5 placeholder:text-secondary-500-light-70"
                maxLength={2000}
                placeholder="부스 소개를 작성해주세요."
                onChange={handleInputBoothIntro}
                value={boothInfo?.boothIntro ?? ''}
                disabled={isSubmit}
              />
            </div>

            <div className="flex flex-col gap-[10px] items-start">
              <div className="font-bold text-base">부스 사진</div>
              <div
                className="w-full h-[150px] flex flex-row bg-secondary-900-light-3 rounded-3xl p-3.5 border-2 border-dashed overflow-y-hidden overflow-x-scroll cursor-pointer"
                id="imagezone"
              >
                {fileUrls.length === 0 && (
                  <label
                    htmlFor="dropzone-file"
                    className="w-full h-full flex flex-col items-center justify-center py-[18px]"
                  >
                    <div className="flex flex-col items-center justify-center text-secondary-500-light-70 text-sm">
                      <IconFileUpload />
                      <p className="dark:text-third-10">부스사진을 등록해주세요.</p>
                      <p className="dark:text-third-10">최대 10장까지 첨부 가능</p>
                    </div>
                    <input
                      type="file"
                      id="dropzone-file"
                      className="hidden"
                      onChange={handleFileInput}
                      multiple
                      accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
                      disabled={isSubmit}
                    />
                  </label>
                )}

                {fileUrls.map((url, index) =>
                  url.length === 0 ? null : (
                    <div
                      key={index}
                      className={`relative w-[120px] h-[120px] flex-shrink-0 mr-2 rounded-3xl border ${isSelectedImage(index)}`}
                      onClick={() => handleSelectImage(index)}
                    >
                      <div
                        style={setBackgroundImage(url)}
                        className="w-full h-full object-cover rounded-3xl border bg-cover"
                      />
                      <IconDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(index);
                        }}
                        className="absolute top-2 right-2"
                      />
                    </div>
                  )
                )}

                {fileUrls.length > 0 && fileUrls.length < 10 && (
                  <label
                    htmlFor="dropzone-file"
                    className="w-[120px] h-[120px] flex flex-col items-center justify-center py-[18px] shrink-0 border-2 rounded-3xl"
                  >
                    <div className="flex flex-col items-center justify-center text-secondary-500-light-70 text-sm">
                      <IconFileUpload />
                      <p className="dark:text-third-10">사진 추가</p>
                    </div>
                    <input
                      type="file"
                      id="dropzone-file"
                      className="hidden"
                      onChange={handleFileInput}
                      multiple
                      accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
                      disabled={isSubmit}
                    />
                  </label>
                )}
              </div>
            </div>

            {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
              <div>
                <div className="flex flex-col w-full">
                  <div className="font-bold text-base pb-2.5">
                    현재 테이블 개수 : {tableNum}개
                  </div>
                  <div className="flex w-full flex-wrap justify-between">
                    {tableNumList.map((table, tableIndex) => (
                      <div key={table.tableNumIndex} className="py-2.5 w-[48%]">
                        <div className="rounded-xl border border-primary-800-light-16 text-sm flex">
                          <div className="rounded-l-xl bg-primary-500-light-5 py-2.5 px-4">
                            테이블 {tableIndex + 1}
                          </div>
                          <div className="px-4 py-2.5">{table.customTableNum}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2.5">
                    <button
                      type="button"
                      className="bg-primary-800 text-white px-6 py-2 rounded-xl font-semibold"
                      onClick={() => handleClickTableCustom()}
                    >
                      테이블 커스텀
                    </button>
                  </div>
                </div>
              </div>
            )}

        {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
          <div className="flex flex-col gap-[20px] w-full mt-5">
            <div className="font-bold text-base">
              계좌 정보
            </div>

            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <div className="text-secondary-700 text-sm min-w-[100px]">예금주</div>
                <div className="relative w-full">
                  <input
                    className="w-full px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm border-none placeholder:text-secondary-500-light-70"
                    type="text"
                    maxLength={100}
                    placeholder="예금주를 입력하세요."
                    onChange={handleInputAccountHolder}
                    value={boothInfo?.accountInfo?.accountHolder ?? ''}
                    disabled={isSubmit}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-secondary-700 text-sm min-w-[100px]">은행명</div>
                <div className="relative w-full">
                  <input
                    className="w-full px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm border-none placeholder:text-secondary-500-light-70"
                    type="text"
                    maxLength={100}
                    placeholder="은행명을 입력하세요."
                    onChange={handleInputBankName}
                    value={boothInfo?.accountInfo?.bankName ?? ''}
                    disabled={isSubmit}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-secondary-700 text-sm min-w-[100px]">계좌번호</div>
                <div className="relative w-full">
                  <input
                    className="w-full px-5 py-3 bg-secondary-900-light-3 rounded-2lg text-sm border-none placeholder:text-secondary-500-light-70"
                    type="text"
                    maxLength={100}
                    placeholder="계좌번호를 입력하세요."
                    onChange={handleInputAccount}
                    value={boothInfo?.accountInfo?.account ?? ''}
                    disabled={isSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        )} 

        <div className="flex flex-col gap-[10px] items-start">
          <div className="font-bold text-base">메뉴 정보</div>
          <div className="w-full flex flex-col gap-[10px]">
            {menuList.map((menu, index) => (
              <div
                key={menu.menuId}
                onClick={() => handleSelectMenu(index)}
                className={`w-full h-fit p-[14px] bg-white rounded-3xl border flex flex-col justify-between ${isSelectedMenu(index)}`}
              >
                <div className="flex mb-[12px]">
                  <div
                    className="w-[94px] h-[94px] bg-contain bg-no-repeat bg-center bg-white rounded-xl flex-shrink-0 border-gray-200 border mr-3"
                    style={setBackgroundImage(menu.menuImage)}
                  ></div>
                  <div className="w-full flex flex-col justify-between">
                    <div>
                      <div className="pb-3 pt-[9px] flex justify-between">
                        <div className="text-sm font-semibold">{menu.menuName}</div>
                        <div className="flex">
                          {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
                            <div className="flex items-center justify-center w-[45px] h-[17px] bg-secondary-900-light-3 text-[8px] rounded-full">
                              {MENU_TYPE[menu.menuType]}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-fit text-[10px]">{menu.menuDescription}</div>
                    </div>
                    <div className="flex justify-between pb-[9px]">
                      <div className="flex items-center">
                        <div className="text-sm font-semibold">{menu.menuPrice}</div>
                        <div className="text-sm">원</div>
                      </div>
                      <IconBoothListToggle
                        isActive={!menu.isSoldOut}
                        width={40}
                        onClick={(e) => {
                          e.stopPropagation();
                          menu.isSoldOut = !menu.isSoldOut;
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-[10px]">
                  <div
                    className="w-1/2 h-[33px] flex justify-center items-center bg-primary-200 text-primary-800 py-[6px] px-4 rounded-full cursor-pointer"
                    onClick={() => openMobileModal(menu)}
                  >
                    수정
                  </div>
                  <div
                    className="w-1/2 h-[33px] flex justify-center items-center bg-danger-800-light-12 text-danger-800 py-[6px] px-4 rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickDeleteMenu({ menuIndex: index, menuId: menu.menuId });
                    }}
                  >
                    삭제
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={() => openMobileModal({})}
              className="w-full h-[150px] flex flex-col items-center justify-center border-dashed border-2 rounded-3xl bg-primary-300-light"
            >
              <div className="flex flex-col items-center justify-center p-5">
                <IconAdd />
                <div className="pt-[10px] text-sm text-secondary-500-light-70">메뉴 추가하기</div>
              </div>
            </div>
          </div>
        </div>

        {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (

          <div className="flex gap-2 flex-col items-start">
            <div className="font-bold text-base shrink-0">
              예약기능 사용 여부
            </div>
            <div className="flex gap-[28px]">
              <div
                className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                onClick={() => setUseReservation(true)}
              >
                <IconRadio isActive={useReservation} />
                <div className="text-secondary-500 text-sm font-semibold">사용 동의</div>
              </div>
              <div
                className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                onClick={() => setUseReservation(false)}
              >
                <IconRadio isActive={!useReservation} />
                <div className="text-secondary-500 text-sm font-semibold">사용 비동의</div>
              </div>
            </div>
          </div>
        )}

        {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
          <div className="flex gap-2 flex-col items-start">
            <div className="font-bold text-base shrink-0">
              주문 기능 사용 여부
            </div>
            <div className="flex gap-[28px]">
              <div
                className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                onClick={() => setUseOrder(true)}
              >
                <IconRadio isActive={useOrder} />
                <div className="text-secondary-500 text-sm font-semibold">사용 동의</div>
              </div>
              <div
                className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                onClick={() => setUseOrder(false)}
              >
                <IconRadio isActive={!useOrder} />
                <div className="text-secondary-500 text-sm font-semibold">사용 비동의</div>
              </div>
            </div>
          </div>
        )}

        {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
          <div className="flex gap-2 flex-col tems-start">
            <div className="font-bold text-base shrink-0">
              직원 호출 기능 사용 여부
            </div>
            <div className="flex gap-[28px]">
              <div
                className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                onClick={() => setIsCall(true)}
              >
                <IconRadio isActive={isCall} />
                <div className="text-secondary-500 text-sm font-semibold">사용 동의</div>
              </div>
              <div
                className="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                onClick={() => setIsCall(false)}
              >
                <IconRadio isActive={!isCall} />
                <div className="text-secondary-500 text-sm font-semibold">사용 비동의</div>
              </div>
            </div>
          </div>
        )}

        {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
          <div className="pt-4 flex gap-8 flex-col">
            <div className="flex gap-2 md:gap-4 items-center flex-wrap">
              <div className="font-bold">
                카카오페이
              </div>
              <IconBoothListToggle isActive={isKakaoPay} onClick={() => setIsKakaoPay(!isKakaoPay)} />
            { isKakaoPay && (
              <div className="relative w-full">
                <input
                  className="w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800 text-sm"
                  type="text"
                  maxLength={100}
                  placeholder="카카오페이 딥 링크"
                  onChange={handleInputKakaoPay}
                  value={boothInfo?.kakaoPay ?? ''}
                  disabled={isSubmit}
                />
                { !boothInfo?.kakaoPay && isSubmit && (
                  <div className="absolute left-0 xl:left-4 top-[52px] text-xs text-red-600">
                    * 링크를 작성해주세요
                  </div>
                )}
              </div>
            )}
            </div>
            <div className="flex gap-2 md:gap-4 items-center flex-wrap">
              <div className="font-bold">
                토스페이
              </div>
              <IconBoothListToggle isActive={isTossPay} onClick={() => setIsTossPay(!isTossPay)} />
            { isTossPay && (
              <div className="relative w-full">
                <input
                  className="w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800 text-sm"
                  type="text"
                  maxLength={100}
                  placeholder="토스페이 딥 링크"
                  onChange={handleInputTossPay}
                  value={boothInfo?.tossPay ?? ''}
                  disabled={isSubmit}
                />
                { !boothInfo?.tossPay && isSubmit && (
                  <div className="absolute left-0 xl:left-4 top-[52px] text-xs text-red-600">
                    * 링크를 작성해주세요
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}
        </div>
        
        <div className="pb-8 flex justify-end items-center gap-4 pt-[40px] mr-8">
          <button
            type="submit"
            className="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-800 cursor-pointer select-none"
          >
            수정
          </button>
        </div>

      </form>
  );
};

export default BoothEditPage;