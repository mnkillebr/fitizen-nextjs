"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { User } from "@/db/schema";

export default function ProfilePhoto({ user }: { user: typeof User.$inferSelect }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const handleImageUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    // avatarFetcher.submit(formData, { method: "post", encType: "multipart/form-data" });
    
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const currentProfileUrl = user.profilePhotoUrl;

  return (
    <div className="flex flex-col space-y-4 items-center">
      <Label className="text-lg">Profile Photo</Label>
      <Avatar
        className="size-48 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={triggerFileInput}
      >
        <AvatarImage
          src={previewImage || currentProfileUrl || undefined} 
          alt={user.firstName} 
        />
        <AvatarFallback>
          {user.firstName[0]}
          {user.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <Label 
          htmlFor="avatar"
          className="cursor-pointer flex items-center gap-2 text-sm font-medium"
          onClick={triggerFileInput}
        >
          <Camera className="h-4 w-4" />
          {selectedFile || currentProfileUrl ? "Change Profile Photo" : "Choose Profile Photo"}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </Label>
        {selectedFile && (
          <Button
            type="button"
            onClick={handleImageUpload}
            className="mt-2 w-fit self-center text-black"
          >
            Upload Image
          </Button>
        )}
      </div>
    </div>
  )
}