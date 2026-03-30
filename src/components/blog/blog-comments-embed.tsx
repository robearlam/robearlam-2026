"use client";

import { useEffect } from "react";
import { DISQUS_SHORTNAME, getDisqusEmbedUrl } from "@/lib/blog/disqus";

type BlogCommentsEmbedProps = {
  identifier: string;
  title: string;
  urlPath: string;
};

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: () => void;
      }) => void;
    };
    page?: {
      identifier?: string;
      title?: string;
      url?: string;
    };
  }
}

function applyDisqusConfig(identifier: string, title: string, urlPath: string): void {
  window.disqus_config = function disqusConfig() {
    this.page = this.page || {};
    this.page.url = `${window.location.origin}${urlPath}`;
    this.page.identifier = identifier;
    this.page.title = title;
  };
}

export function BlogCommentsEmbed({ identifier, title, urlPath }: BlogCommentsEmbedProps) {
  useEffect(() => {
    applyDisqusConfig(identifier, title, urlPath);

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config!,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = getDisqusEmbedUrl(DISQUS_SHORTNAME);
    script.async = true;
    script.setAttribute("data-timestamp", `${Date.now()}`);
    script.setAttribute("data-testid", "disqus-script");

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [identifier, title, urlPath]);

  return <div id="disqus_thread" data-testid="disqus-thread" />;
}
