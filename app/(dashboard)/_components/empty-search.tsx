import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-search.svg" alt="Empty Search" width={200} height={200} />

      <h2 className="text-2xl font-semibold mt-6">没有找到相关内容</h2>
      <p className="text-muted-foreground text-sm mt-2">再试试搜索其它关键词吧~</p>
    </div>
  );
};
