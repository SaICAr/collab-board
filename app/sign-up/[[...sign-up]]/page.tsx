"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid w-full h-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <SignUp
        appearance={{
          elements: {
            headerSubtitle: "hidden",
            dividerText: "hidden",
            footerActionText: "text-center text-sm text-zinc-500",
            footerActionLink:
              "font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline",
            formFieldInput:
              "w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400",
            formFieldLabel: "text-sm font-medium text-zinc-950",
            footer: "!bg-white !bg-none p-0 m-0",
            footerAction: "!bg-white !bg-none !p-0 m-0 flex items-center",
            cardBox: "w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8",
            card: "p-0 border-0 shadow-none",
            headerTitle: "mt-4 text-xl tracking-tight text-zinc-950 font-bold",
            formButtonPrimary:
              "w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70",
            socialButtonsBlockButtonText: "text-sm font-medium text-black",
          },
        }}
      />
    </div>
  );
}
