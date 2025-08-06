import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 단일 이미지 업로드
export const imageUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/admin/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    alert('Image Upload Error, Please try again! 관리자에게 문의하세요.');
    return '';
  }
};

// 다중 이미지 업로드
export const imagesUpload = async (files: FileList | File[]): Promise<string[]> => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/admin/image/all', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    alert('Images Upload Error, Please try again! 관리자에게 문의하세요.');
    return [];
  }
};

// 에러 알림 및 이동
export const alertError = (
  error: unknown,
  navigate?: (path: string) => void
): void => {
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : String(error);

  alert(`${message}, 관리자에게 문의하세요.`);

  const redirectPath = window.location.pathname.includes('mobile')
    ? '/mobile/main'
    : '/';

  if (navigate) {
    navigate(redirectPath);
  } else {
    window.location.assign(redirectPath);
  }
};
