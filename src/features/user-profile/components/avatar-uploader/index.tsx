import { Button } from "@/components/ui/button";
import { TrashIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { honoClient } from "@/lib/hono-client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

const AvatarUploader = ({
  src,
  className,
}: {
  src: string | null | undefined;
  className?: string;
}) => {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string | null | undefined>(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleImageUpload = async (file: File) => {
    try {
      // Podstawowa walidacja po stronie klienta
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Plik jest zbyt duży. Maksymalny rozmiar to 5MB.");
        return;
      }

      // Wyświetl komunikat o ładowaniu
      toast.loading("Przesyłanie zdjęcia...", { id: "upload" });

      const res = await honoClient.api.avatar.$post({
        form: {
          image: file,
        },
      });

      // Pobierz dane odpowiedzi

      // Zamknij komunikat o ładowaniu
      toast.dismiss("upload");

      if (!res.ok) {
        const data = await res.json();
        // Użyj komunikatu błędu z API
        toast.error(
          data.message || "Wystąpił błąd podczas przesyłania zdjęcia"
        );
        return;
      }

      const data = await res.json();

      // Zaktualizuj źródło zdjęcia
      setCurrentSrc(data.url);

      // Odśwież stronę
      router.refresh();

      // Wyświetl komunikat o sukcesie
      toast.success(data.message || "Zdjęcie zostało pomyślnie przesłane");
    } catch {
      toast.dismiss("upload");
      toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
    }
  };

  const handleDelete = async () => {
    if (!src) return;

    try {
      toast.loading("Usuwanie zdjęcia...", { id: "delete" });

      const isLocalImage = src.startsWith(
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL!
      );

      if (!isLocalImage) {
        await authClient.updateUser({
          image: null,
        });
        setCurrentSrc(null);
        toast.dismiss("delete");

        toast.success("Zdjęcie zostało pomyślnie usunięte");
      } else {
        const imageId = src.replace(
          `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/`,
          ""
        );
        const res = await honoClient.api.avatar[":id"].$delete({
          param: {
            id: imageId,
          },
        });

        toast.dismiss("delete");

        if (!res.ok) {
          const errorData = await res.json();
          toast.error(
            errorData.message || "Wystąpił błąd podczas usuwania zdjęcia"
          );
          return;
        }

        await authClient.updateUser({
          image: null,
        });

        setCurrentSrc(null);

        toast.success("Zdjęcie zostało pomyślnie usunięte");
      }

      // Odśwież stronę
      router.refresh();
    } catch (error) {
      // Obsługa nieoczekiwanych błędów
      console.error("Delete error:", error);
      toast.dismiss("delete");
      toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
    }
  };

  return (
    <div className={cn("relative w-min size-32", className)}>
      <input
        hidden
        type="file"
        className="hidden"
        ref={inputRef}
        accept="image/*"
        aria-label="Wybierz zdjęcie profilowe"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
          }
        }}
      />
      <div
        className="rounded-full cursor-pointer border bg-background size-full p-1 border-dashed hover:border-primary transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {currentSrc ? (
          <Image
            unoptimized
            width={128}
            height={128}
            alt="Zdjęcie użytkownika"
            src={currentSrc}
            className="rounded-full size-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted rounded-full">
            <UserIcon size={20} />
          </div>
        )}
      </div>
      {currentSrc && (
        <Button
          size="icon"
          variant="outline"
          className="size-8 right-0 bottom-0 absolute rounded-full"
          onClick={handleDelete}
          aria-label="Usuń zdjęcie profilowe"
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};

export default AvatarUploader;
