import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/logins/userStore';

const MobileLogin = () => {
  const navigate = useNavigate();

  const {
    userId,
    password,
    setUserId,
    setPassword,
    setIsError,
    login,
  } = useUserStore();

  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
    setUserId(sanitizedInput);
  };

  const handleInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/\s/g, '').slice(0, 20);
    setPassword(sanitizedInput);
  };

  const handleClickSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSubmit) return;

    if (!userId || !password) {
      setIsError(true);
      setErrorMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmit(true);
    const isSuccess = await login();
    setIsSubmit(false);

    if (isSuccess) {
      navigate('/mobile');
    } else {
      setErrorMessage('아이디와 비밀번호를 다시 확인해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center pt-[70px]">
      <form className="w-full flex justify-center" onSubmit={handleClickSubmit}>
        <div className="flex flex-col w-3/4 items-center">
          <div className="font-bold text-5xl text-primary-800 mb-[100px]">Festino</div>
          <p className="font-semibold text-xl text-primary-800 mb-5">로그인</p>
          <div className="flex flex-col gap-[10px] w-full">
            <input
              className="w-full h-[59px] focus:outline-none rounded-3xl border-2 px-5 focus:border-primary-800"
              placeholder="아이디"
              type="text"
              onInput={handleInputId}
              autoComplete="username"
              value={userId}
            />
            <input
              className="w-full h-[59px] focus:outline-none rounded-3xl border-2 px-5 focus:border-primary-800"
              placeholder="비밀번호"
              type="password"
              onInput={handleInputPassword}
              autoComplete="new-password"
              value={password}
            />
          </div>
          <div className="flex flex-col justify-start items-center relative w-full">
            <p className="h-6 flex items-center text-xs text-secondary-500 underline underline-offset-2 mt-1">
              비밀번호를 잊으셨나요?
            </p>
            <p className="text-danger-800 absolute top-14 text-xs w-full text-center">{errorMessage}</p>
          </div>
          <button
            type="submit"
            className="w-full h-[56px] bg-primary-800 text-white font-semibold text-xl rounded-3xl my-14"
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileLogin;