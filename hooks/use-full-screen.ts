"use client";

import { useEffect, useState } from "react";

interface IHTMLElement extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface IDocument extends Document {
  mozCancelFullScreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

export const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const element = document.documentElement as IHTMLElement;

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);

  const openFullScreen = () => {
    if (isFullScreen) return;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }
  };

  const closeFullScreen = () => {
    if (!isFullScreen) return;

    const _document = document as IDocument;
    if (_document.exitFullscreen) {
      _document.exitFullscreen();
    } else if (_document.mozCancelFullScreen) {
      _document.mozCancelFullScreen();
    } else if (_document.webkitExitFullscreen) {
      _document.webkitExitFullscreen();
    } else if (_document.msExitFullscreen) {
      _document.msExitFullscreen();
    }
  };

  return {
    isFullScreen,
    openFullScreen,
    closeFullScreen,
  };
};
