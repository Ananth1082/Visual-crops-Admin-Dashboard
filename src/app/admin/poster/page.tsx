// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AlertCircle } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type FormData = {
//   posterName: string;
//   groupName: string;
//   images: FileList;
// };

// export default function PosterUploadForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();
//   const [previews, setPreviews] = useState<string[]>([]);

//   const onSubmit = (data: FormData) => {
//     console.log(data);
//     const formData = new FormData();
//     Array.from(data.images).forEach((img) => formData.append("poster", img));
//     formData.append("name", data.posterName);
//     formData.append("group_id", data.groupName);
//     formData.append("sender_id", "f11cbc55-ce74-4d40-b3a8-9975d0a1fd7b");
//     console.log(formData);

//     fetch("https://visual-crops-app-web-server.onrender.com/api/v2/poster", {
//       body: formData,
//       method: "POST",
//     })
//       .then(() => {
//         console.log("Success");
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     alert("Form submitted successfully!");
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newPreviews = Array.from(files).map((file) =>
//         URL.createObjectURL(file)
//       )[0];
//       if (newPreviews) setPreviews([...previews, newPreviews]);
//       console.log(newPreviews);
//     }
//   };

//   return (
//     <div className="mt-4">
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle>Upload Poster</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <Label htmlFor="posterName">Poster Name</Label>
//               <Input
//                 id="posterName"
//                 {...register("posterName", {
//                   required: "Poster name is required",
//                 })}
//               />
//               {errors.posterName && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   {errors.posterName.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="groupName">Group Name</Label>
//               <Input
//                 id="groupName"
//                 {...register("groupName", {
//                   required: "Group name is required",
//                 })}
//               />
//               {errors.groupName && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   {errors.groupName.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="images">Upload Images</Label>
//               <Input
//                 id="images"
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 {...register("images", {
//                   required: "At least one image is required",
//                 })}
//                 onChange={handleImageChange}
//               />
//               {errors.images && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   {errors.images.message}
//                 </p>
//               )}
//             </div>

//             {previews.length > 0 && (
//               <div className="mt-4">
//                 <h3 className="text-lg font-semibold mb-2">Image Previews</h3>
//                 <div className="grid grid-cols-3 gap-2">
//                   {previews.map((preview, index) => (
//                     <img
//                       key={index}
//                       src={preview}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-24 object-cover rounded"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             <Button type="submit" className="w-full">
//               Upload Poster
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { PosterUploadDialog } from "../../../components/poster-upload-dialog-box";
import { PosterCard } from "../../../components/poster-card";
import { constants } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type PosterViewType = {
  posterName: string;
  groupName: string;
  posterType: string;
  imageUrl: string;
};

export default function Page() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status !== "authenticated") {
    return <h1>Unauthorized</h1>;
  }
  const [posters, setPosters] = useState<PosterViewType[]>([]);
  useEffect(() => {
    fetch(`${constants.localBaseUrl}/poster/admin-poster`)
      .then((res) => res.json())
      .then(
        ({
          posters,
        }: {
          posters: {
            id: string;
            name: string;
            image_urls: string[];
            Group: {
              id: string;
              name: string;
            };
          }[];
        }) => {
          setPosters(
            posters.map((poster) => {
              return {
                posterName: poster.name,
                groupName: poster.Group.name,
                posterType: poster.Group.name,
                imageUrl: poster.image_urls[0],
              };
            })
          );
        }
      )
      .catch(console.log);
  }, []);

  return (
    <div className="container mx-auto py-5 px-10">
      <h1 className="text-3xl font-bold mb-8">Poster Management</h1>

      <div className="mb-8">
        <PosterUploadDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posters.map((poster, index) => (
          <PosterCard
            key={index}
            title={poster.posterName}
            type={poster.posterType}
            imageUrl={poster.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
