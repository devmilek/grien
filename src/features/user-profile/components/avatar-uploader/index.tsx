"use client";

import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { TrashIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";

const AvatarUploader = ({
  value,
  onChange,
  className,
}: {
  value: string | null;
  onChange: (src: string | null) => void;
  className?: string;
}) => {
  const { uploadAvatar, deleteAvatar, isLoading } = useAvatarUpload({
    onSuccess: (url) => onChange(url),
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await uploadAvatar(acceptedFiles[0], value);
      }
    },
    [uploadAvatar, value]
  );

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    await deleteAvatar(value);
    onChange(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".avif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: isLoading,
  });

  return (
    <div className="relative w-max">
      <div
        {...getRootProps()}
        className={cn(
          "size-28 rounded-full border border-dashed p-1 overflow-hidden hover:border-primary bg-white hover:bg-muted transition-colors",
          className
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <Image
            alt="Zdjęcie użytkownika"
            src={value}
            unoptimized
            height={200}
            width={200}
            className="rounded-full size-full object-cover"
          />
        ) : (
          <div className="bg-muted size-full flex items-center justify-center rounded-full">
            <UserIcon className="size-4" />
          </div>
        )}
      </div>
      <Button
        size="icon"
        variant="outline"
        className="size-8 right-0 bottom-0 absolute rounded-full"
        onClick={handleDelete}
      >
        <TrashIcon />
      </Button>
    </div>
  );
};

export default AvatarUploader;
