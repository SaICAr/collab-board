import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Image src="/loading.gif" alt="loading" width={100} height={100} className="object-contain" />
      <p className="text-sm font-bold text-primary-grey-300">加载中...</p>
    </div>
  );
};
