import React from 'react';
import IconLoading from '@/components/icons/IconLoading'

const LoadingModal: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <IconLoading width={200} />
      <div className="text-white">귀여운 티노가 요청을 처리중이에요...</div>
    </div>
  );
};

export default LoadingModal;