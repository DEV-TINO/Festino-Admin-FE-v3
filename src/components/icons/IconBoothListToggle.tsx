import React, { useEffect, useState } from 'react';

interface ToggleProps {
  isActive: boolean;
  width?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>; // ✅ 수정
}


const IconBoothListToggle: React.FC<ToggleProps> = ({ isActive, width = 60, onClick }) => {
  const [height, setHeight] = useState<number>((width * 30) / 90);

  useEffect(() => {
    setHeight((width * 30) / 90);
  }, [width]);

  return (
    <div style={{ cursor: 'pointer' }} onClick={onClick}>
      {!isActive ? (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_3000_8035)">
            <rect width="60" height="30" rx="15" fill="#CCCCCC" />
            <g filter="url(#filter0_d_3000_8035)">
              <circle cx="15" cy="15" r="12" fill="white" />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_3000_8035"
              x="-9"
              y="-9"
              width="48"
              height="48"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3000_8035" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3000_8035" result="shape" />
            </filter>
            <clipPath id="clip0_3000_8035">
              <rect width="60" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_3000_8034)">
            <rect width="60" height="30" rx="15" fill="url(#paint0_linear_3000_8034)" />
            <g filter="url(#filter0_d_3000_8034)">
              <circle cx="45" cy="15" r="12" fill="white" />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_3000_8034"
              x="21"
              y="-9"
              width="48"
              height="48"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3000_8034" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3000_8034" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_3000_8034" x1="0" y1="15" x2="61" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#73B6FF" />
              <stop offset="1" stopColor="#0073F0" />
            </linearGradient>
            <clipPath id="clip0_3000_8034">
              <rect width="60" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default IconBoothListToggle;