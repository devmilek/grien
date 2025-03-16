import { ChefHat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid lg:grid-cols-2 h-screen p-6 gap-8">
      <div className="h-full relative rounded-xl overflow-hidden hidden lg:block">
        <div className="absolute size-full bg-gradient-to-t from-black/80 to-black/0 flex flex-col justify-between p-8">
          <Link
            href="/"
            className="text-white font-display text-xl flex items-center gap-4"
          >
            <ChefHat className="size-6" />
            <span className="leading-0">grien</span>
          </Link>
          <div className="text-white space-y-4">
            <h2 className="font-display text-3xl">
              Człowiek nie może prawidłowo myśleć, kochać i spać, jeśli
              wcześniej porządnie się nie najadał.
            </h2>
            <p>- Virginia Woolf</p>
          </div>
        </div>
        <div className="relative size-full -z-10">
          <Image src="/food.jpg" fill alt="" className="object-cover" />
        </div>
      </div>
      <div className="grid place-items-center">
        <div className="max-w-md w-full">{children}</div>
      </div>
    </main>
  );
};

export default AuthLayout;
