"use client";

import { Icons } from "@/components/icons";
import { Facebook, TwitterIcon } from "lucide-react";
import { FacebookShareButton, TwitterShareButton } from "next-share";
import React from "react";

export const ShareFacebookButton = ({ url }: { url: string }) => {
  return (
    <FacebookShareButton url={url}>
      <div className="group">
        <div className="p-6 rounded-full bg-muted group-hover:bg-emerald-700/5 group-hover:text-emerald-700 transition-all">
          <Facebook className="h-8 w-8" />
        </div>
        <p className="font-medium text-sm mt-2">Facebook</p>
      </div>
    </FacebookShareButton>
  );
};

export const ShareTwitterButton = ({ url }: { url: string }) => {
  return (
    <TwitterShareButton url={url}>
      <div className="group">
        <div className="p-6 rounded-full bg-muted group-hover:bg-emerald-700/5 group-hover:text-emerald-700 transition-all">
          <TwitterIcon className="h-8 w-8" />
        </div>
        <p className="font-medium text-sm mt-2">Facebook</p>
      </div>
    </TwitterShareButton>
  );
};
