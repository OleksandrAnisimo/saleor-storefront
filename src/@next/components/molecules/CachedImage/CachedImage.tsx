import React from "react";

import { useNetworkStatus } from "@hooks";
import NoPhoto from "images/no-photo.svg";

import { IProps } from "./types";

export const CachedImage: React.FC<IProps> = ({
  url,
  url2x,
  alt,
  children,
  defaultImage = NoPhoto,
  ...props
}: IProps) => {
  const [isUnavailable, setUnavailable] = React.useState(false);
  const { online } = useNetworkStatus();

  React.useEffect(() => {
    updateAvailability();
  }, [online]);

  async function updateAvailability() {
    let _isUnavailable = false;
    if ("caches" in window) {
      if (!online) {
        const match = await window.caches.match(url!);
        let match2x;
        if (url2x) {
          match2x = await window.caches.match(url2x);
        }
        if (!match && !match2x) {
          _isUnavailable = true;
        }
      }
    }

    if (isUnavailable !== _isUnavailable) {
      setUnavailable(_isUnavailable);
    }
  }

  if (!url || isUnavailable) {
    return children || <img src={defaultImage} alt="placeholder" />;
  }

  return (
    <img
      {...props}
      src={url}
      srcSet={url2x ? `${url} 1x, ${url2x} 2x` : `${url} 1x`}
      alt={alt}
    />
  );
};
