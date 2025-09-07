import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VarifyEmail = () => {
  return (
    <>
      <Card className="w-full max-w-sm px-4">
        <h3 className="font-semibold">Varify to Your Email</h3>
        <Input type="email" placeholder="Email" />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex justify-end">
              <Button className="w-20">Confirm</Button>
            </div>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-md rounded-2xl shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-xl font-bold text-gray-800">
                Enter Verification Code
              </AlertDialogTitle>
              <p className="text-center text-sm text-gray-500">
                We have sent a 6-digit OTP to your registered email.
              </p>
            </AlertDialogHeader>
            <div className="flex justify-center mt-6">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                containerClassName="gap-3"
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg rounded-md"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg rounded-md"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg rounded-md"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg rounded-md"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-lg rounded-md"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-lg rounded-md"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex justify-center mt-4">
              <Button className="w-[60%]">Submit</Button>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline focus:outline-none"
            >
              Resend OTP
            </button>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </>
  );
};

export default VarifyEmail;
