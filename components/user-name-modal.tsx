"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { auth } from "@/lib/auth";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { updateUser } from "@/actions/update-user";
import { Button } from "./ui/button";
import SetNameForm from "./set-name-form";

const UserNameModal = () => {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uzupełnij dane</DialogTitle>
          <DialogDescription>
            Aby móc korzystać z serwisu, musisz uzupełnić swoje imię.
          </DialogDescription>
        </DialogHeader>
        <SetNameForm />
      </DialogContent>
    </Dialog>
  );
};

export default UserNameModal;
