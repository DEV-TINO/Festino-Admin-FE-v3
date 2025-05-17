import { IconOrderMinusProps } from '@/types/icons/icon.types';
import React from 'react';

const IconOrderMinus: React.FC<IconOrderMinusProps> = ({ onClick, className = '' }) => {
  return (
    <div 
      className={`${className}`}
      onClick={onClick}
    >
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.25 8.7168C14.25 8.91571 14.171 9.10647 14.0303 9.24713C13.8897 9.38778 13.6989 9.4668 13.5 9.4668H2.5C2.30109 9.4668 2.11032 9.38778 1.96967 9.24713C1.82902 9.10647 1.75 8.91571 1.75 8.7168C1.75 8.51788 1.82902 8.32712 1.96967 8.18647C2.11032 8.04581 2.30109 7.9668 2.5 7.9668H13.5C13.6989 7.9668 13.8897 8.04581 14.0303 8.18647C14.171 8.32712 14.25 8.51788 14.25 8.7168Z"
          fill="#7E8A97"
        />
      </svg>
    </div>
  );
};

export default IconOrderMinus;