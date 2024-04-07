import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShareIcon } from "lucide-react";
import React from "react";
import {
  IconType,
  SiFacebook,
  SiMessenger,
  SiPinterest,
  SiTwitter,
  SiWhatsapp,
} from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { ShareRecipeInput } from "./share-recipe-input";

const ShareRecipeButton = ({ recipeId }: { recipeId: string }) => {
  const baseUrl = process.env.BASE_URL;
  const url = `https://grief.devmilek.com/recipe/${recipeId}`;

  const socialMediaShares = [
    {
      name: "Facebook",
      icon: SiFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      name: "Twitter",
      icon: SiTwitter,
      url: `https://twitter.com/intent/tweet?url=${url}`,
    },
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      url: `https://wa.me/?text=${url}`,
    },
    {
      name: "Pinterest",
      icon: SiPinterest,
      url: `https://pinterest.com/pin/create/button/?url=${url}`,
    },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <ShareIcon className="h-4 w-4" />
          <span className="sr-only">Udostępnij</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Udostępnij przepis</DialogTitle>
          <DialogDescription>
            Skopiuj link lub udostępnij go znajomym
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          {socialMediaShares.map((share) => (
            <ShareSocialMediaButton
              key={share.name}
              href={share.url}
              icon={share.icon}
              name={share.name}
            />
          ))}
        </div>
        <ShareRecipeInput url={url} />
      </DialogContent>
    </Dialog>
  );
};

const ShareSocialMediaButton = ({
  icon: Icon,
  name,
  href,
}: {
  icon: IconType;
  name: string;
  href: string;
}) => {
  return (
    <Link className="group text-center" href={href} target="_blank">
      <div className="flex items-center justify-center aspect-square w-16 rounded-full bg-muted text-muted-foreground group-hover:bg-emerald-700/5 group-hover:text-emerald-700 transition-all">
        <Icon className="h-6 w-6" />
      </div>
      {/* <p className="font-medium text-sm mt-2">{name}</p> */}
    </Link>
  );
};

export default ShareRecipeButton;
