import React from 'react';

interface SelectOptionProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const SelectOption: React.FC<SelectOptionProps> = ({ value, onChange }) => {
  const handleClickOption = (option: boolean) => {
    onChange(option);
  };

  return (
    <div className="flex">
      <div
        onClick={() => handleClickOption(true)}
        className="w-fit h-fit flex items-center cursor-pointer"
      >
        <svg
          className="mr-1"
          width="20"
          height="20"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12.5"
            r="12"
            fill={value ? '#0073F0' : '#CCCCCC'}
          />
          <path
            d="M7.19922 12.4984L10.7992 16.0984L17.9992 8.89844"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div
          className={`pl-1 text-base font-semibold ${
            value ? 'text-primary-900' : 'text-secondary-900'
          }`}
        >
          사용 동의
        </div>
      </div>

      {/* 사용 비동의 */}
      <div
        onClick={() => handleClickOption(false)}
        className="w-fit h-fit flex items-center pl-10 cursor-pointer"
      >
        <svg
          className="mr-1"
          width="20"
          height="20"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12.5"
            r="12"
            fill={!value ? '#0073F0' : '#CCCCCC'}
          />
          <path
            d="M7.19922 12.4984L10.7992 16.0984L17.9992 8.89844"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div
          className={`pl-1 text-base font-semibold ${
            !value ? 'text-primary-900' : 'text-secondary-900'
          }`}
        >
          사용 비동의
        </div>
      </div>
    </div>
  );
};

export default SelectOption;