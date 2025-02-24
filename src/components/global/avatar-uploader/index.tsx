"use client";

import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { TrashIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const AvatarUploader = ({
  value,
  onChange,
  className,
}: {
  value: string | null;
  onChange: (src: string | null) => void;
  className?: string;
}) => {
  const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
  const [isLoading, setIsLoading] = React.useState(false);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);

      if (value && value.startsWith(R2_PUBLIC_URL)) {
        try {
          const id = value
            .split("/")
            [value.split("/").length - 1].split(".")[0];
          await axios.delete(`/api/images/${id}`);
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error(e.response?.data ? e.response.data : e.message);
            toast.error("Nie udało się usunąć poprzedniego obrazka");
          }
        }
      }

      try {
        const res = await axios.post("/api/images", formdata);
        onChange(res.data.url);
      } catch (e) {
        if (e instanceof AxiosError) {
          console.error(e.response?.data ? e.response.data : e.message);
          toast.error("Nie udało się przesłać obrazka");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [R2_PUBLIC_URL, onChange, value]
  );

  const handleDelete = async () => {
    if (value && value.startsWith(R2_PUBLIC_URL)) {
      // extract id from value url
      // remove extension
      const id = value.split("/")[value.split("/").length - 1].split(".")[0];

      console.log(id);

      try {
        await axios.delete(`/api/images/${id}`);
      } catch {
        toast.error("Nie udało się usunąć obrazka");
      }
    }
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
        onClick={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <TrashIcon />
      </Button>
    </div>
  );
};

export default AvatarUploader;
