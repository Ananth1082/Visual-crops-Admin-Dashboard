"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PosterUploadForm, PosterData } from "./poster-upload-form";

export function PosterUploadDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = (data: PosterData) => {
    // onPosterAdded(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload New Poster</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Poster</DialogTitle>
          <DialogDescription>
            Fill in the details and upload an image for your new poster.
          </DialogDescription>
        </DialogHeader>
        <PosterUploadForm />
      </DialogContent>
    </Dialog>
  );
}
