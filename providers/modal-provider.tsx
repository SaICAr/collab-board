"use client";

import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modal/rename-modal";

// 确保代码驱动的组件，能在客户端被正确渲染，防止在服务端渲染发生水合错误
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RenameModal />
    </>
  );
};
