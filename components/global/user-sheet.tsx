"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { blo } from "blo";
import {
  AlertCircle,
  Copy,
  CopyCheck,
  Loader2,
  LogOut,
  Settings,
  User,
  UserRound,
  Wallet,
} from "lucide-react";
import { Button } from "../ui/button";
import Logo from "@/assets/Hypercerts.svg";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";

const UserSheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { open: openWeb3Modal } = useWeb3Modal();

  const { address, isConnecting, isDisconnected } = useAccount();

  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 2000);
  };

  const closeUserSheetAndOpenWeb3Modal = () => {
    setOpen(false);
    openWeb3Modal();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="cursor-pointer" asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center justify-start group">
        <div className="w-full relative">
          <Image
            src="/user-sheet-images/Forest.webp"
            alt="GainForest Cover"
            width={400}
            height={400}
            className="w-full h-[200px] scale-[1.1] group-hover:scale-[1.01] transition-all origin-bottom"
          />
          <span className="absolute top-4 left-4 flex items-center gap-1 bg-white/70 backdrop-blur-lg text-sm text-black px-2 py-1 rounded-full scale-100">
            <Logo
              className="h-6 w-6 object-cover object-center drop-shadow-sm brightness-[0.6]"
              alt="Hypercerts Logo"
              width={100}
              height={200}
            />
            GainForest
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-16 w-full bg-gradient-to-b from-transparent to-background"></div>
        </div>
        {isDisconnected ? (
          <div className="w-full flex flex-col flex-1 -mt-12">
            <div className="w-full flex flex-col items-center gap-4 px-4">
              <div className="h-24 w-24 bg-background/50 backdrop-blur-lg rounded-full border-4 border-destructive/50 shadow-xl flex items-center justify-center">
                <AlertCircle size={40} className="text-destructive" />
              </div>
              <span className="flex items-center justify-center w-[80%] text-center font-bold text-lg text-muted-foreground leading-none">
                Not Connected
              </span>
              <p className="text-muted-foreground flex items-center justify-center w-[80%] text-center">
                Please connect your wallet to use the application.
              </p>
              <Button
                className="gap-2"
                onClick={closeUserSheetAndOpenWeb3Modal}
              >
                <Wallet size={16} />
                Connect
              </Button>
            </div>
          </div>
        ) : isConnecting ? (
          <div className="w-full flex flex-col flex-1">
            <div className="w-full flex flex-col items-center gap-4 px-4 py-8">
              <Loader2 className="animate-spin text-primary" size={40} />
              <span className="flex items-center justify-center w-[80%] text-center font-bold text-lg text-muted-foreground leading-none">
                Connecting
              </span>
              <p className="text-muted-foreground flex items-center justify-center w-[80%] text-center">
                Please wait while your wallet is being connected.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col flex-1 -mt-12">
            <div className="w-full flex flex-col items-center gap-4 px-4">
              <Avatar className="h-24 w-24 border-4 border-foreground shadow-xl">
                <AvatarImage
                  src={address ? blo(address) : ""}
                  alt="ENS Avatar"
                />
                <AvatarFallback>
                  <UserRound />
                </AvatarFallback>
              </Avatar>
              <span className="flex items-center justify-center w-[80%] text-center font-bold text-lg text-muted-foreground break-all leading-none">
                {address}
              </span>
              <Button
                variant={"ghost"}
                className="gap-2 -mt-2 mb-2"
                onClick={copyAddress}
                disabled={!address}
              >
                {isAddressCopied ? <CopyCheck size={16} /> : <Copy size={16} />}
                {isAddressCopied ? "Copied" : "Copy Address"}
              </Button>
            </div>
            <div className="flex-1 flex flex-col items-center w-full p-4">
              <ul className="flex-1 flex flex-col gap-1 w-full">
                <li className="w-full">
                  <Link href={`/profile/${address}`}>
                    <Button
                      className="w-full text-left justify-start gap-2"
                      variant={"secondary"}
                    >
                      <User size={16} />
                      Profile
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link href={`/profile/${address}/settings`}>
                    <Button
                      className="w-full text-left justify-start gap-2"
                      variant={"secondary"}
                    >
                      <Settings size={16} />
                      Settings
                    </Button>
                  </Link>
                </li>
              </ul>
              <Button
                variant={"destructive"}
                className="w-full gap-2"
                onClick={closeUserSheetAndOpenWeb3Modal}
              >
                <LogOut size={16} />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
