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
      <DialogContent className="max-w-2xl rounded-2xl border-zinc-200 bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle>Resume</DialogTitle>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto rounded-lg border border-zinc-200">
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
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
          <a
            href={resumePdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            <ExternalLink className="h-4 w-4" />
            Open in new tab
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
