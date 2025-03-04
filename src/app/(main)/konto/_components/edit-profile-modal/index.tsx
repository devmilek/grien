"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import AvatarUploader from "./avatar-uploader";

const EditProfileModal = ({ children }: { children: React.ReactNode }) => {
  const form = useForm({});
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <DialogHeader>
          <DialogTitle className="border-b px-6 py-4">
            Edytuj profil
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edytuj swoje dane osobowe, zdjęcie profilowe i inne informacje
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-32">
          <Image src="/food2.jpg" alt="" fill className="object-cover" />
        </div>
        {/* <div className="-mt-10 px-6">
          <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
            <Image
              src="/food.jpg"
              className="h-full w-full object-cover"
              width={80}
              height={80}
              alt="Profile image"
              unoptimized
            />
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              aria-label="Change profile picture"
            >
              <ImagePlusIcon size={16} aria-hidden="true" />
            </button>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              aria-label="Upload profile picture"
            />
          </div>
        </div> */}
        <AvatarUploader />
        <Form {...form}>
          <form className="px-6 pt-4 pb-6 grid gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa profilu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa użytkownika</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="bio"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Anuluj
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Zapisz</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
