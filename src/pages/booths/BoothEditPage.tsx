import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconBoothEdit from '@/components/icons/IconBoothEdit';
import IconBoothListToggle from '@/components/icons/IconBoothListToggle';
import IconFileUpload from '@/components/icons/IconFileUpload';
import IconAdd from '@/components/icons/IconAdd';
import IconRadio from '@/components/icons/IconRadio';
import { prettyPrice } from '@/utils/utils';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/constants/constant';
import { alertError, api, imagesUpload } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { useMenuModal } from '@/stores/booths/menuModal';
import { useUserStore } from '@/stores/logins/userStore';

const BoothEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { boothId } = useParams<{ boothId: string }>();

  const { tableNum, tableNumList, openTableDetailModal, submitTableDetail } = useTableDetail();
  const { setBoothInfo, boothInfo, menuList, createMenuList, deleteMenuList, patchMenuList, addDeleteMenu, addPatchMenu, updateMenuList, init, deleteMenu, createMenu, patchMenu  } = useBoothDetail();
  const { openMenuModal } = useMenuModal();
  const { isAdmin, userOwnBoothId } = useUserStore();

  const isBoothOwner = isAdmin || boothId === userOwnBoothId;

  const [serviceHours, setServiceHours] = useState('');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isKakaoPay, setIsKakaoPay] = useState(false);
  const [isTossPay, setIsTossPay] = useState(false);
  const [useReservation, setUseReservation] = useState(false);
  const [useOrder, setUseOrder] = useState(false);
  const [isCall, setIsCall] = useState(false);

  const handleClickTableCustom = () => {
    openTableDetailModal();
  };

  const handleDragStartMenu = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isSubmit) return;
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDropMenu = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (isSubmit) return;

    const dragIndex = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const item = menuList.splice(dragIndex, 1)[0];
    menuList.splice(dropIndex, 0, item);

    const start = Math.min(dragIndex, dropIndex);
    const end = Math.max(dragIndex, dropIndex);

    menuList.slice(start, end + 1).forEach((menuItem, index) => {
      menuItem.menuIndex = start + index;
      addPatchMenu({
        ...menuItem,
      });
    });
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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isSubmit) return;
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (isSubmit) return;
    const dragIndex = Number(event.dataTransfer.getData('text/plain'));
    const updated = [...fileUrls];
    const item = updated.splice(dragIndex, 1)[0];
    updated.splice(dropIndex, 0, item);
    setFileUrls(updated);
  };

  const handleInputAdminCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, adminCategory: event.target.value });
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

  const handleInputAdminName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmit) return;
    const current = useBoothDetail.getState().boothInfo;
    setBoothInfo({ ...current, adminName: event.target.value });
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

  const handleClickMenuToggle = (index: number, isSoldOut: boolean) => {
    if (isSubmit) return;

    const updatedMenu = {
      ...menuList[index],
      isSoldOut: !isSoldOut,
    };

    menuList[index] = updatedMenu;

    addPatchMenu(updatedMenu);
    updateMenuList(menuList);
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
                boothId: boothId,
                isOrder: useOrder,
                isReservation: useReservation,
                isCall: isCall,
                isTossPay: isTossPay,
                isKakaoPay: isKakaoPay,
                accountInfo: boothInfo.accountInfo,
              }
            : {
                ...baseBoothInfo,
                boothId: boothId,
              };
  
        if (boothId) {
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
  
    if (ADMIN_CATEGORY[boothInfo.adminCategory] === 'night') {
      const tableDetailResult = await submitTableDetail(boothInfo.boothId);
      if (!tableDetailResult) return;
    }
  
    setIsSubmit(false);
    navigate(`/booth/${newBoothId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
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
    if (boothInfo.openTime && boothInfo.closeTime) {
      setServiceHours(`${boothInfo.openTime} ~ ${boothInfo.closeTime}`);
    }
    setUseOrder(boothInfo.isOrder);
    setIsCall(boothInfo.isCall);
    setUseReservation(boothInfo.isReservation);
    setIsOpen(boothInfo.isOpen);
    setIsKakaoPay(boothInfo.isKakaoPay);
    setIsTossPay(boothInfo.isTossPay);
    setFileUrls(boothInfo.boothImage);
    if (!isBoothOwner && userOwnBoothId) {
      alert("타 학과 정보는 수정할 수 없습니다");
      navigate(`/booth/${boothId}`);
    }
  }, [boothId, navigate, userOwnBoothId]);

  return (
    <div className="flex flex-col px-4 min-w-[630px] pb-20">
      {isBoothOwner && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClickSubmit();
          }}
        >
          <div className="flex justify-between pt-[100px] min-w-[350px] pb-[40px]">
            <div className="flex items-center gap-4">
              <IconBoothEdit />
              <div className="text-primary-800 text-xl md:text-2xl font-semibold">부스 정보 관리</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl w-full h-auto px-4 py-4 pb-12 gap-10 lg:py-[60px] lg:px-[60px] lg:gap-[60px] flex flex-col border-1 border-primary-800-light-16">
            <div className="flex flex-col gap-[20px] w-full">
              <div
                className="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold"
              >
                부스 정보
              </div>

              <div
                className="bg-primary-800-light-3 rounded-xl w-full py-4 px-4 lg:py-[40px] lg:px-[40px] flex flex-col gap-[30px] xl:gap-[20px] border-1 border-primary-800-light-16"
              >
                <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">학과명</div>
                  <div className="relative w-full">
                    <input
                      className="w-full xl:w-[390px] h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800 text-sm"
                      type="text"
                      maxLength={100}
                      placeholder="학과명을 입력하세요."
                      onChange={handleInputAdminName}
                      value={boothInfo?.adminName ?? ''}
                      disabled={isSubmit}
                    />
                    { !boothInfo?.adminName && isSubmit && (
                      <div className="absolute left-0 xl:left-4 top-[62px] text-xs text-red-600">
                        * 학과명을 입력해주세요.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap xl:flex-nowrap gap-2">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">부스 타입</div>
                  <div className="relative w-full xl:w-[390px]">
                    <select
                      disabled={isSubmit}
                      className="appearance-none w-full xl:w-[390px] h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800 text-sm"
                      value={boothInfo.adminCategory}
                      onChange={handleInputAdminCategory}
                    >
                      <option value="주간부스">주간부스</option>
                      <option value="야간부스">야간부스</option>
                      <option value="푸드트럭">푸드트럭</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">부스 이름</div>
                  <div className="relative w-full">
                    <input
                      className="w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800 text-sm"
                      type="text"
                      maxLength={100}
                      placeholder="학과명을 입력하세요."
                      onChange={handleInputBoothName}
                      value={boothInfo?.boothName ?? ''}
                      disabled={isSubmit}
                    />
                    { !boothInfo?.boothName && isSubmit && (
                      <div className="absolute left-0 xl:left-4 top-[62px] text-xs text-red-600">
                        * 부스 부스 이름을 작성해주세요
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap xl:flex-nowrap items-center">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">운영 시간</div>
                  <div className="w-full flex items-center gap-2">
                    <div className="relative w-fit">
                      <input
                        className="2xl:w-[520px] h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800 text-sm"
                        type="text"
                        maxLength={100}
                        placeholder="예시) 17:00 ~ 24:00"
                        onChange={handleInputServiceHours}
                        value={serviceHours}
                        disabled={isSubmit}
                      />
                      { !serviceHours && isSubmit && (
                        <div className="absolute left-0 xl:left-4 top-[62px] text-xs text-red-600">
                          * 운영시간을 작성해주세요.
                        </div>
                      )}
                    </div>
                    <IconBoothListToggle isActive={isOpen} onClick={() => setIsOpen(!isOpen)} />
                  </div>
                </div>

                <div className="flex w-full gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">부스 소개</div>
                  <div className="relative w-full">
                    <textarea
                      className="w-full h-[500px] border-[1px] border-gray-500 rounded-2xl px-[20px] py-[20px] focus:border-primary-800 resize-none text-sm"
                      maxLength={2000}
                      placeholder="부스 소개를 작성해주세요."
                      onChange={handleInputBoothIntro}
                      value={boothInfo?.boothIntro ?? ''}
                      disabled={isSubmit}
                    />
                    { !boothInfo?.boothIntro && isSubmit && (
                      <div className="absolute left-0 xl:left-4 top-[152px] xl:top-[302px] text-xs text-red-600">
                        * 학과 소개를 작성해주세요.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex w-full gap-2 flex-wrap xl:flex-nowrap">
                  <div className="flex-shrink-0 xl:w-[92px] flex items-center justify-start w-full text-sm">부스 이미지</div>
                  
                  {(fileUrls.length === 0 || fileUrls[0] === '') ? (
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-[150px] xl:h-[200px] border-dashed border-primary-400 bg-secondary-900-light-3 rounded-2xl border-[1px] cursor-pointer hover:bg-slate-200"
                    >
                      <IconFileUpload />
                      <p className="mb-2 text-secondary-500-light-70 text-sm">부스 사진을 등록해주세요.</p>
                      <p className="text-secondary-500-light-70 text-sm">최대 10장까지 첨부 가능</p>
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
                  ) : (
                    <div className="flex grow flex-col items-center justify-center overflow-x-auto">
                      <div className="text-red-500 w-full flex justify-end cursor-pointer mb-2">
                        <div
                          onClick={() => setFileUrls([])}
                          className="w-12 h-6 rounded border-danger-800 bg-white text-danger-800 text-sm flex items-center justify-center border"
                        >
                          reset
                        </div>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <div className="w-full flex gap-4">
                          {fileUrls.map((url, urlIndex) => (
                            <div
                              key={urlIndex}
                              style={{ backgroundImage: `url(${url})` }}
                              className="flex-shrink-0 w-[150px] h-[150px] xl:w-[200px] xl:h-[200px] rounded-2xl bg-cover bg-no-repeat bg-center border-2 border-gray-300 bg-white hover:border-primary-800"
                              draggable={!isSubmit}
                              onDragStart={(e) => handleDragStart(e, urlIndex)}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnter={(e) => e.preventDefault()}
                              onDrop={(e) => handleDrop(e, urlIndex)}
                            />
                          ))}
                          {fileUrls.length < 10 && (
                            <label
                              htmlFor="dropzone-file"
                              className="flex-shrink-0 flex flex-col items-center justify-center w-[150px] xl:w-[200px] h-[150px] xl:h-[200px] border-dashed border-gray-500 bg-secondary-900-light-3 rounded-2xl border-[1px] cursor-pointer hover:bg-slate-200"
                            >
                              <IconFileUpload />
                              <p className="text-secondary-500-light-70 text-sm">부스 사진을 등록해주세요.</p>
                              <p className="text-secondary-500-light-70 text-sm">최대 10장까지 첨부 가능</p>
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
                    </div>
                  )}
                </div>

              {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
                <div>
                  <div className="flex items-center justify-between py-10 gap-10">
                    <div className="w-[200px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold px-5 gap-3 shrink-0">
                      현재 테이블 개수
                      <span className="text-secondary-700">{tableNum}개</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClickTableCustom()}
                      className="is-button font-semibold w-[100px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-800 cursor-pointer select-none"
                    >
                      테이블 커스텀
                    </button>
                  </div>
                  <div className="grid 3xl:grid-cols-4 2xl:grid-cols-3 grid-cols-2 gap-5 place-items-center">
                    {tableNumList.map((table, tableIndex) => (
                      <div
                        key={tableIndex}
                        className="h-14 flex text-center rounded-3lg shadow-secondary w-full"
                      >
                        <div className="w-[100px] bg-primary-800-light-8 rounded-l-3lg border-1 border-primary-800-light-24 text-secondary-700 font-medium text-sm grid place-items-center select-none">
                          테이블 {tableIndex + 1}
                        </div>
                        <div className="grow min-w-[120px] bg-white rounded-r-3lg border-1 border-primary-800-light-16 border-l-0 grid place-items-center text-secondary-800 text-sm font-semibold select-none">
                          {table.customTableNum}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
            <div className="flex flex-col gap-[20px] w-full">
              <div className="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold">
                계좌 정보
              </div>

              <div className="bg-primary-800-light-3 rounded-2xl w-full py-4 px-4 lg:py-[40px] lg:px-[60px] flex flex-col gap-[30px] xl:gap-[20px] border-1 border-primary-800-light-16">
                <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">예금주</div>
                  <div className="relative w-full">
                    <input
                      className="text-sm md:w-[520px] w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800"
                      type="text"
                      maxLength={100}
                      placeholder="예금주를 입력하세요."
                      onChange={handleInputAccountHolder}
                      value={boothInfo?.accountInfo?.accountHolder ?? ''}
                      disabled={isSubmit}
                    />
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">은행명</div>
                  <div className="relative w-full">
                    <input
                      className="text-sm md:w-[520px] w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800"
                      type="text"
                      maxLength={100}
                      placeholder="은행명을 입력하세요."
                      onChange={handleInputBankName}
                      value={boothInfo?.accountInfo?.bankName ?? ''}
                      disabled={isSubmit}
                    />
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-[92px] flex items-center justify-start text-sm shrink-0">계좌번호</div>
                  <div className="relative w-full">
                    <input
                      className="text-sm md:w-[520px] w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-800"
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

          <div className="flex flex-col gap-[20px] w-full">
            <div className="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-800-light-8 text-primary-800-light-86 text-md font-semibold">
              메뉴 정보
            </div>

            <div className="bg-primary-800-light-3 rounded-2xl w-full lg:py-[30px] lg:px-[30px] px-4 py-4 flex flex-col border-1 border-primary-800-light-16">
              <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2">
                {menuList.map((menu, menuIndex) => (
                  <div
                    key={menuIndex}
                    className="h-[170px] rounded-2xl flex text-sm items-center font-bold p-5 gap-[28px] bg-white hover:border-primary-900 border-1 border-primary-800-light-16"
                    draggable={!isSubmit}
                    onDragStart={(e) => handleDragStartMenu(e, menuIndex)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropMenu(e, menuIndex)}
                  >
                    <div
                      className="hidden md:block w-[120px] h-[120px] bg-contain bg-no-repeat bg-center bg-white rounded-xl flex-shrink-0 border-gray-200 border"
                      style={setBackgroundImage(menu.menuImage)}
                    />
                    <div className="flex flex-col w-full justify-between">

                      <div className="flex justify-between items-center h-[29px] w-full min-w-fit gap-2">
                        <div className="w-3/5 text-base font-semibold text-secondary-800 text-nowrap truncate 2xl:max-w-[110px]">
                          {menu.menuName}
                        </div>
                        <div className="w-2/5 gap-[5px] items-center text-sm flex flex-shrink-0 justify-end grow font-medium 2xl:max-w-[130px]">
                          {ADMIN_CATEGORY[boothInfo.adminCategory] !== "day" && (
                            <div className="w-[55px] h-[25px] text-[10px] rounded-full bg-secondary-900-light-3 items-center flex justify-center text-secondary-800">
                              {MENU_TYPE[menu.menuType]}
                            </div>
                          )}
                          <button
                            className="w-[45px] h-[25px] rounded-full flex items-center justify-center text-[10px] text-primary-800 bg-primary-800-light-8 cursor-pointer"
                            type="button"
                            onClick={() => openMenuModal(menu)}
                          >
                            수정
                          </button>
                          <button
                            className="w-[45px] h-[25px] lg:max-xl:flex rounded-full 2xl:flex items-center justify-center bg-danger-800-light-12 text-danger-800 text-[10px]"
                            type="button"
                            onClick={() =>
                              handleClickDeleteMenu({ menuIndex, menuId: menu.menuId })
                            }
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <p className="pt-[12px] pb-[12px] h-[78px] text-secondary-700 font-normal text-xs break-all text-wrap line-clamp-3">
                        {menu.menuDescription}
                      </p>

                      <div className="flex justify-between items-center w-full">
                        <div className="text-secondary-800 font-bold text-base">
                          {prettyPrice(menu.menuPrice)}
                        </div>
                        <IconBoothListToggle
                          isActive={!menu.isSoldOut}
                          onClick={() => handleClickMenuToggle(menuIndex, menu.isSoldOut)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => openMenuModal({})}
                  className="h-[170px] bg-secondary-900-light-3 rounded-2xl border-2 border-dashed border-primay-400 flex flex-col items-center justify-center text-secondary-500-light-70 cursor-pointer"
                >
                  <IconAdd />
                  <div className="text-sm">메뉴 추가하기</div>
                </div>
              </div>
            </div>
          </div>

          {ADMIN_CATEGORY[boothInfo.adminCategory] === 'night' && (
            <div className="flex gap-6 md:gap-[40px] items-center flex-wrap">
              <div className="w-[170px]">
                <div className="h-[45px] rounded-xl text-primary-800-light-86 flex items-center justify-center font-semibold text-md bg-primary-800-light-8">
                  예약기능 사용 여부
                </div>
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
            <div className="flex gap-6 md:gap-[40px] items-center flex-wrap">
              <div className="w-[170px] h-[45px] rounded-xl text-primary-800-light-86 flex items-center justify-center font-semibold text-md bg-primary-800-light-8">
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
            <div className="flex gap-6 md:gap-[40px] items-center flex-wrap">
              <div className="w-[170px] h-[45px] rounded-xl text-primary-800-light-86 flex items-center justify-center font-semibold text-md bg-primary-800-light-8">
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
            <div className="flex gap-8 flex-col">
              <div className="flex gap-2 md:gap-4 items-center flex-wrap">
                <div className="text-primary-800-light-86 flex items-center justify-center font-semibold text-md">
                  카카오페이
                </div>
                <IconBoothListToggle isActive={isKakaoPay} onClick={() => setIsKakaoPay(!isKakaoPay)} />
                {isKakaoPay && (
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
                <div className="text-primary-800-light-86 flex items-center justify-center font-semibold text-md">
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
          
          <div className="flex justify-end items-center gap-4 pt-[40px] mr-8">
            <button
              type="submit"
              className="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-800 cursor-pointer select-none"
            >
              등록
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default BoothEditPage;