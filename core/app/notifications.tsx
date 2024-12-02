import { Toaster } from 'react-hot-toast';

export const Notifications = () => {
  return (
    <Toaster
      containerClassName="px-4 md:px-10 "
      position="top-right"
      toastOptions={{
        className:
          '!text-black !rounded !border !border-gray-200 !bg-white !shadow-lg !py-4 !px-6 !text-base',
      }}
    />
  );
};
