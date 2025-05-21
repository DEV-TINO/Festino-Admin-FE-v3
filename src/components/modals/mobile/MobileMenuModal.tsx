import React, { useEffect, useRef, useState } from 'react';
import { useMenuModal } from '@/stores/booths/menuModal';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import IconRadio from '@/components/icons/IconRadio';
import IconFileUpload from '@/components/icons/IconFileUpload';
import { imageUpload } from '@/utils/api';
import { ADMIN_CATEGORY } from '@/constants/constant';

const MobileMenuModal: React.FC = () => {
  const { submitModal, closeMobileModal, menuInfo, setMenuInfo } = useMenuModal();
  const { boothInfo } = useBoothDetail();

  const [menuType, setMenuType] = useState<'MAIN' | 'SUB' | 'CALLSERVICE'>('MAIN');
  const [isSubmit, setIsSubmit] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuType(menuInfo.menuType as 'MAIN' | 'SUB' | 'CALLSERVICE');
    submitRef.current?.focus();
  }, [menuInfo.menuType]);

  const handleInputChange = (field: string, value: string) => {
    setMenuInfo({ ...menuInfo, [field]: value });
  };

  const handleInputMenuPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setMenuInfo({ ...menuInfo, menuPrice: price });
  };

  const handleInputMenuImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await imageUpload(file);
    setMenuInfo({ ...menuInfo, menuImage: url });
  };

  const handleSubmit = () => {
    setIsSubmit(true);
    const { menuName, menuPrice, menuDescription } = menuInfo;
    if (!menuName || !menuPrice || !menuDescription) return;

    setMenuInfo({
      ...menuInfo,
      menuType,
    });
    submitModal();
    setIsSubmit(false);
  };

  const allowKeyEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const setBackgroundImage = (url: string) => ({
    backgroundImage: `url(${url})`,
  });

  const isNightCategory = ADMIN_CATEGORY[boothInfo.adminCategory] === 'night';

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div className="bg-white rounded-2xl p-10 flex flex-col justify-between gap-4">
        <div className="w-full text-center pb-6">
          <div className="text-lg text-primary-800 font-semibold">메뉴 수정</div>
        </div>
        <div className="flex flex-col w-full gap-[12px]">

          <div className="flex w-full items-center gap-3">
            <div className="w-[42px] flex-shrink-0">메뉴</div>
            <div className="grow relative">
              <input
                className="p-3 w-full h-10 bg-secondary-900-light-3 rounded-[10px] active:border-primary-800 border-none text-sm"
                type="text"
                placeholder="메뉴 이름을 작성해주세요"
                value={menuInfo.menuName}
                onChange={(e) => handleInputChange('menuName', e.target.value)}
              />
              {menuInfo.menuName === '' && isSubmit && (
                <div className="absolute top-10 text-danger-800 text-xs">
                  * 메뉴 이름을 작성해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-3">
            <div className="w-[42px] flex-shrink-0">가격</div>
            <div className="grow relative">
              <input
                className="p-3 w-full h-10 bg-secondary-900-light-3 rounded-[10px] active:border-primary-800 border-none text-sm"
                type="text"
                placeholder="가격을 작성해주세요"
                value={menuInfo.menuPrice}
                onChange={handleInputMenuPrice}
                maxLength={6}
              />
              {menuInfo.menuPrice === '' && isSubmit && (
                <div className="absolute top-10 text-danger-800 text-xs">
                  * 가격을 작성해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-3">
            <div className="w-[42px] flex-shrink-0">설명</div>
            <div className="grow relative">
              <textarea
                className="w-full h-[140px] rounded-[10px] active:border-primary-800 resize-none border-none bg-secondary-900-light-3 p-3 text-sm"
                maxLength={60}
                placeholder="메뉴 설명을 작성해주세요"
                value={menuInfo.menuDescription}
                onChange={(e) => handleInputChange('menuDescription', e.target.value)}
              />
              {menuInfo.menuDescription === '' && isSubmit && (
                <div className="absolute top-10 text-danger-800 text-xs">
                  * 메뉴 설명을 작성해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-3">
            <div className="w-[42px] flex-shrink-0">이미지</div>
            <div className="grow relative">
              {!menuInfo.menuImage ? (
                <label
                  htmlFor="menu-image"
                  className="flex flex-col items-center justify-center w-full h-[87px] hover:bg-slate-200 border border-dashed border-secondary-500 rounded-[10px] bg-secondary-900-light-3 active:border-primary-800"
                >
                  <IconFileUpload />
                  <p className="mb-2 text-sm text-secondary-500-light-70">메뉴 사진을 등록해주세요.</p>
                  <input
                    type="file"
                    id="menu-image"
                    className="hidden"
                    onChange={handleInputMenuImage}
                    accept="image/*"
                  />
                </label>
              ) : (
                <label
                  htmlFor="menu-image"
                  className="flex w-full h-[150px] bg-contain bg-center bg-no-repeat border border-dashed border-secondary-500 rounded-[10px] bg-secondary-900-light-3"
                  style={setBackgroundImage(menuInfo.menuImage)}
                >
                  <input
                    type="file"
                    id="menu-image"
                    className="hidden"
                    onChange={handleInputMenuImage}
                    accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
                  />
                </label>
              )}
            </div>
          </div>

          {isNightCategory && (
            <div className="flex items-center w-full">
              <div className="w-[80px] shrink-0"></div>
              <div className="flex items-center gap-[28px]">
                <div className="w-[110px] flex gap-2 cursor-pointer text-sm" onClick={() => setMenuType('MAIN')}>
                  <IconRadio isActive={menuType === 'MAIN'} />
                  <div>메인 메뉴</div>
                </div>
                <div className="w-[110px] flex gap-2 cursor-pointer text-sm" onClick={() => setMenuType('SUB')}>
                  <IconRadio isActive={menuType === 'SUB'} />
                  <div>서브 메뉴</div>
                </div>
                <div className="w-[110px] flex gap-2 cursor-pointer text-sm" onClick={() => setMenuType('CALLSERVICE')}>
                  <IconRadio isActive={menuType === 'CALLSERVICE'} />
                  <div>서브 메뉴</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex justify-end items-center gap-[10px]">
          <button
            type="button"
            className="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-800"
            onClick={closeMobileModal}
          >
            취소
          </button>
          <button
            type="submit"
            ref={submitRef}
            className="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white bg-primary-800"
            onKeyDown={allowKeyEnter}
          >
            확인
          </button>
        </div>
      </div>
    </form>
  );
};

export default MobileMenuModal;