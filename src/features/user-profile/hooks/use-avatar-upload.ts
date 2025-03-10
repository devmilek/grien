import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface UseImageUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  onDelete?: () => void;
}

export const useAvatarUpload = (options?: UseImageUploadOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

  const uploadAvatar = useCallback(
    async (file: File, currentImage: string | null = null) => {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("file", file);

      // Delete previous image if it exists and is from our storage
      if (currentImage && currentImage.startsWith(R2_PUBLIC_URL)) {
        try {
          const id = currentImage
            .split("/")
            [currentImage.split("/").length - 1].split(".")[0];
          await axios.delete(`/api/avatars/${id}`);
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error(e.response?.data ? e.response.data : e.message);
            toast.error("Nie udało się usunąć poprzedniego obrazka");
          }
        }
      }

      try {
        const res = await axios.post("/api/avatars", formdata);
        options?.onSuccess?.(res.data.url);
        return res.data.url;
      } catch (e) {
        const error =
          e instanceof AxiosError
            ? new Error(e.response?.data || e.message)
            : new Error("Nie udało się przesłać obrazka");

        console.error(error);
        toast.error("Nie udało się przesłać obrazka");
        options?.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [R2_PUBLIC_URL, options]
  );

  const deleteAvatar = useCallback(
    async (imageUrl: string | null) => {
      if (!imageUrl || !imageUrl.startsWith(R2_PUBLIC_URL)) {
        options?.onDelete?.();
        return;
      }

      const id = imageUrl
        .split("/")
        [imageUrl.split("/").length - 1].split(".")[0];

      try {
        await axios.delete(`/api/avatars/${id}`);
        options?.onDelete?.();
        return true;
      } catch {
        toast.error("Nie udało się usunąć obrazka");
        return false;
      }
    },
    [R2_PUBLIC_URL, options]
  );

  return {
    uploadAvatar,
    deleteAvatar,
    isLoading,
  };
};
