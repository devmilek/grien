import React, { useRef } from "react";
import ReactImageCropper, { RefObject } from "./image-cropper";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import ReactImageCropper, { RefObject } from "./ReactImageCropper";

interface ReactImageCropperPopupProps {
  open: boolean;
  onClose: () => void;
  img: string;
  afterCrop: (dataUrl: string) => void;
  title: string;
  lockAspectRatio: boolean;
  aspectRatio: number;
}

const ReactImageCropperPopup: React.FC<ReactImageCropperPopupProps> = ({
  open,
  onClose,
  img,
  afterCrop,
  title,
  lockAspectRatio,
  aspectRatio,
}) => {
  const ImageCropperRef = useRef<RefObject>(null);

  const handleSaveClick = () => {
    onClose();
    if (ImageCropperRef.current) {
      afterCrop(ImageCropperRef.current.getCropData() as string);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <ReactImageCropper
          aspectRatio={aspectRatio}
          src={img}
          lockAspectRatio={lockAspectRatio}
          ref={ImageCropperRef}
        />
        <Button onClick={handleSaveClick}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};

export { ReactImageCropperPopup };
