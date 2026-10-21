"use client";

import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { resumePdfPath, resumePreviewPath } from "@/app/data/socials";

export default function ResumeDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[20px] border-[#E4E4E7] bg-white font-sans text-[#18181B]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-[-0.02em]">Resume</DialogTitle>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-[#E4E4E7]">
          <Image
            src={resumePreviewPath}
            alt="Syahrial Danu Wardhana — Resume preview"
            width={848}
            height={1200}
            className="h-auto w-full"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={resumePdfPath}
            download
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#18181B] px-5 text-sm font-medium text-white transition-colors hover:bg-[#3F3F46]"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
          <a
            href={resumePdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E4E4E7] px-5 text-sm font-medium text-[#18181B] transition-colors hover:bg-[#F4F4F5]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Open in new tab
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
