"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { getBaseUrl } from "@/lib/get-url";
import Image from "next/image";

export interface PosterData {
  posterName: string;
  groupName: string;
  posterType: string;
  image: File[];
}

type PosterType = {
  id: string;
  name: string;
};
export function PosterUploadForm() {
  const userData = useSession().data;
  const [posterTypes, setPosterTypes] = useState<PosterType[]>([]);
  useEffect(() => {
    fetch(`${getBaseUrl()}/poster/group/admin`)
      .then((res) => res.json())
      .then((data) => {
        setPosterTypes([...data.poster_types]);
      })
      .catch(console.log);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PosterData>();
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = (data: PosterData) => {
    console.log("submit data", data);
    const formData = new FormData();
    formData.append("name", data.posterName);
    formData.append("group_id", data.posterType);
    Array.from(data.image).forEach((img) => formData.append("poster", img));
    fetch(`${getBaseUrl()}/poster`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        reset();
        setPreview(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="posterName">Poster Name</Label>
        <Input
          id="posterName"
          {...register("posterName", { required: "Poster name is required" })}
        />
        {errors.posterName && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.posterName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="posterType">Poster Type</Label>
        <Select
          onValueChange={(value) => {
            console.log(value);

            register("posterType", {
              required: "Poster type is required",
              value,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a poster type" />
          </SelectTrigger>
          <SelectContent>
            {posterTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.posterType && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.posterType.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input
          id="image"
          type="file"
          multiple
          accept="image/*"
          {...register("image", { required: "An image is required" })}
          onChange={handleImageChange}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.image.message}
          </p>
        )}
      </div>

      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
          <Image
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Upload Poster
      </Button>
    </form>
  );
}
