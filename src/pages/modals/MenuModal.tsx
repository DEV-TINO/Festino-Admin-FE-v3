import React, { useEffect, useRef, useState } from 'react';
import { useMenuModal } from '@/stores/booths/menuModal';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import IconRadio from '@/components/icons/IconRadio';
import IconFileUpload from '@/components/icons/IconFileUpload';
import { imageUpload } from '@/utils/api';
import { ADMIN_CATEGORY } from '@/constants/constant';

const MenuModal: React.FC = () => {
  const { submitModal, closeModal, menuInfo, setMenuInfo } = useMenuModal();
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
      isSoldOut: false
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
      <div className="w-[600px] h-[680px] bg-white rounded-2xl p-10 flex flex-col justify-between">
        <div className="w-full text-center pb-6">
          <div className="text-lg text-primary-800 font-semibold">메뉴 수정</div>
        </div>
        <div className="flex flex-col w-full gap-[28px]">

          <div className="flex items-center w-full">
            <div className="w-[80px] flex-shrink-0 text-md">메뉴</div>
            <div className="grow relative">
              <input
                className="w-full h-[45px] border border-gray-400 bg-white px-[20px] rounded-xl active:border-primary-800 text-sm"
                type="text"
                placeholder="메뉴 이름을 작성해주세요"
                value={menuInfo.menuName}
                onChange={(e) => handleInputChange('menuName', e.target.value)}
              />
              {menuInfo.menuName === '' && isSubmit && (
                <div className="absolute left-4 top-[51px] text-danger-800 text-xs">
                  * 메뉴 이름을 작성해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="w-[80px] flex-shrink-0 text-md">가격</div>
            <div className="grow relative">
              <input
                className="w-full h-[45px] border border-gray-400 bg-white px-[20px] rounded-xl active:border-primary-800 text-sm"
                type="text"
                placeholder="가격을 작성해주세요"
                value={menuInfo.menuPrice}
                onChange={handleInputMenuPrice}
                maxLength={6}
              />
              {menuInfo.menuPrice === '' && isSubmit && (
                <div className="absolute left-4 top-[51px] text-danger-800 text-xs">
                  * 가격을 작성해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="w-[80px] flex-shrink-0 text-md">설명</div>
            <div className="grow relative">
              <textarea
                className="w-full h-[120px] border border-gray-400 bg-white px-[20px] py-[20px] rounded-2xl active:border-primary-800 resize-none text-sm"
                maxLength={60}
                placeholder="메뉴 설명을 작성해주세요"
                value={menuInfo.menuDescription}
                onChange={(e) => handleInputChange('menuDescription', e.target.value)}
              />
              {menuInfo.menuDescription === '' && isSubmit && (
                <div className="absolute left-4 top-[124px] text-danger-800 text-xs">
                  * 메뉴 설명을 작성해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="w-[80px] flex-shrink-0 text-md">이미지</div>
            <div className="grow relative">
              {!menuInfo.menuImage ? (
                <label
                  htmlFor="menu-image"
                  className="flex flex-col items-center justify-center w-full h-[130px] border border-dashed border-gray-500 bg-secondary-100 hover:bg-slate-200 px-[20px] rounded-2xl active:border-primary-800"
                >
                  <IconFileUpload />
                  <p className="mb-2 text-sm text-gray-500">메뉴 사진을 등록해주세요.</p>
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
                  className="flex w-full h-[150px] bg-contain bg-center bg-no-repeat border border-gray-400 rounded-2xl"
                  style={setBackgroundImage(menuInfo.menuImage)}
                >
                  <input
                    type="file"
                    id="menu-image"
                    className="hidden"
                    onChange={handleInputMenuImage}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          {isNightCategory && (
            <div className="flex items-center w-full pb-4">
              <div className="w-[80px] shrink-0 text-md">분류</div>
              <div className="flex items-center gap-[28px]">
                <div className="w-[110px] flex gap-2 cursor-pointer text-sm" onClick={() => setMenuType('MAIN')}>
                  <IconRadio isActive={menuType === 'MAIN'} />
                  <div>메인 메뉴</div>
                </div>
                <div className="w-[110px] flex gap-2 cursor-pointer text-sm" onClick={() => setMenuType('SUB')}>
                  <IconRadio isActive={menuType === 'SUB'} />
                  <div>서브 메뉴</div>
                </div>
                <div className="w-[120px] flex gap-2 cursor-pointer text-sm" onClick={() => setMenuType('CALLSERVICE')}>
                  <IconRadio isActive={menuType === 'CALLSERVICE'} />
                  <div>직원 호출</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex justify-end items-center gap-[10px]">
          <button
            type="button"
            className="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-800"
            onClick={closeModal}
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

export default MenuModal;