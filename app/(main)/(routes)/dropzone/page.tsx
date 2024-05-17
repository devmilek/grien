"use client";

import React from "react";
import { ReactImageCropperDropzone } from "./image-dropzone";

const Page = () => {
  return (
    <div>
      <ReactImageCropperDropzone
        accept={{
          "image/png": [".png"],
          "image/jpg": [".jpg"],
        }}
        afterCrop={(dataUrl) => console.log(dataUrl)}
        aspectRatio={4 / 3}
        title="Drop an image"
      >
        <div>kasdasd</div>
      </ReactImageCropperDropzone>
    </div>
  );
};

export default Page;
