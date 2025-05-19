import { ModalWrapperProps } from '@/types/icons/icon.types';
import { useEffect } from 'react';

const MobileModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {

  const preventScroll = () => {
    document.documentElement.style.overflow = "hidden";
  };

  const allowScroll = () => {
    document.documentElement.style.overflow = "auto";
  };

  useEffect(() => {
    preventScroll();
    return () => {
      allowScroll();
    };
  }, []);

  return (
    <div 
      className="fixed z-50 mx-auto inset-0 max-w-[500px] w-full h-full bg-black/50 flex justify-center items-center px-6"
    >
      <div>
        {children}
      </div>
    </div>
  );
};

export default MobileModalWrapper;