"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const ShareRecipeInput = ({ url }: { url: string }) => {
  const onClick = () => {
    navigator.clipboard.writeText(url);
    toast.success("Skopiowano link do schowka");
  };

  return (
    <div>
      <Label>Skopiuj link</Label>
      <div className="w-full space-x-2 flex mt-2">
        <Input readOnly value={url} className="w-full" />
        <Button
          className="flex-shrink-0"
          variant="secondary"
          size="icon"
          onClick={onClick}
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
