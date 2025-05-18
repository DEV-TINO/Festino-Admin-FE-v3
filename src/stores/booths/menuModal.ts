import { create } from 'zustand';
import { useBaseModal } from '@/stores/commons/baseModal';
import { useBoothDetail } from './boothDetail';
import { MenuModalState, MenuInfo } from '@/types/booths/booth.types';

export const useMenuModal = create<MenuModalState>((set, get) => {
  const baseModalStore = useBaseModal.getState();
  const boothDetailStore = useBoothDetail.getState();

  const getDefaultMenuInfo = (): MenuInfo => ({
    menuName: '',
    menuPrice: '',
    menuDescription: '',
    menuImage: '',
    menuType: 'MAIN',
    isSoldOut: false,
    menuIndex: boothDetailStore.menuList.length,
  });

  return {
    menuInfo: getDefaultMenuInfo(),
    isNewMenu: true,

    reset: () => {
      set({ menuInfo: getDefaultMenuInfo(), isNewMenu: true });
    },

    openMenuModal: (menu) => {
      const isEditing = menu?.menuName ? true : false;
      set({
        menuInfo: menu ? { ...menu, menuIndex: menu.menuIndex ?? boothDetailStore.menuList.length } as MenuInfo : getDefaultMenuInfo(),
        isNewMenu: !isEditing,
      });
      baseModalStore.setModalType('menuModal');
      baseModalStore.openModal();
    },

    openMobileModal: (menu) => {
      set({
        menuInfo: menu ? { ...menu, menuIndex: menu.menuIndex ?? boothDetailStore.menuList.length } as MenuInfo : getDefaultMenuInfo(),
      });
      baseModalStore.setModalType('menuModal');
      baseModalStore.openMobileModal();
    },

    setMenuInfo: (info) => {
      set((state) => ({
        menuInfo: { ...state.menuInfo, ...info },
      }));
    },

    submitModal: () => {
      const { menuInfo, isNewMenu } = get();

      if (menuInfo.menuId || !isNewMenu) {
        boothDetailStore.addPatchMenu(menuInfo);
        boothDetailStore.patchCurrentMenu(menuInfo);
      } else {
        boothDetailStore.addCreateMenu(menuInfo);
        boothDetailStore.addMenuList(menuInfo);
      }

      baseModalStore.closeModal();
      baseModalStore.closeMobileModal();
    },

    closeModal: () => {
      baseModalStore.closeModal();
    },

    closeMobileModal: () => {
      baseModalStore.closeMobileModal();
    },
  };
});

export default useMenuModal;