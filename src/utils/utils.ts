import type { CSSProperties } from 'react';

export const formatMonth = (month: number) => {
  return String(month).padStart(2, '0');
}

// UUID 형식 확인
export const isUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  return uuidRegex.test(uuid);
};

// 배경 이미지 스타일 반환
export const setBackgroundImage = (url: string): CSSProperties => {
  return {
    backgroundImage: `url(${url})`,
  };
};

// 메뉴 수량 포맷
export const prettyMenuNum = (menuNum: string | number): string => {
  if (menuNum === '') return '';
  const num = typeof menuNum === 'string' ? parseInt(menuNum, 10) : menuNum;
  return `${num}개`;
};

// 전화번호 하이픈 추가
export const prettyPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

// 가격 포맷
export const prettyPrice = (price: string | number): string => {
  if (price === '') return '';
  const numericPrice = typeof price === 'string' ? parseInt(price, 10) : price;
  return numericPrice.toLocaleString('ko-KR') + '원';
};

// 날짜 전체 포맷
export const prettyDate = (date: string | Date): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('ko-KR', options).format(dateObject);
};

// 배열 청크
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, (index + 1) * size)
  );
};

// 시/분 포맷
export const getHourandMinute = (date: string | Date | undefined): string => {
  if (!date) return '-';

  const dateObject = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('ko-KR', options).format(dateObject);
};