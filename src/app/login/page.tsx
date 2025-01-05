"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { getBaseUrl } from "@/lib/get-url";

export default function PhoneLogin() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    axios
      .post(`${getBaseUrl()}/auth/send-otp`, {
        phone: phoneNumber,
      })
      .then((res) => {
        console.log(res.data);

        setStep("otp");
        setOrderId(res.data.orderId);
      })
      .catch(console.error);
    setLoading(false);
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      phone: phoneNumber,
      otp,
      orderId,
    });
    console.log(res);

    if (res) {
      if (res.ok) {
        redirect(res.url!);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Invalid OTP or Authorized User, retry sending OTP.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        setStep("phone");
        setOtp("");
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Unexpected error occurred.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setStep("phone");
      setOtp("");
      setLoading(false);
    }
    setStep("phone");
    setOtp("");
    setLoading(false);
  };

  return (
    <div className="flex flex-column items-center mt-[-4.5rem] min-h-screen   bg-gray-100">
      <div className="w-[50%] border-r-2 border-black min-h-screen flex items-center justify-center">
        Logo
      </div>
      <div className="flex w-[50%] min-h-screen items-center justify-center">
        <Card className="w-[350px] px-5 py-3">
          <CardHeader>
            <CardTitle>Phone Login</CardTitle>
            <CardDescription>
              {step === "phone"
                ? "Enter your phone number to receive an OTP"
                : "Enter the OTP sent to your phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handlePhoneSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input
                      id="otp"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === "phone" ? (
              <Button
                type="submit"
                onClick={handlePhoneSubmit}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleOtpSubmit}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            )}
          </CardFooter>
        </Card>
        <Toaster />
      </div>
    </div>
  );
}
