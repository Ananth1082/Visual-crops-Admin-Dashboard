import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface PosterCardProps {
  title: string;
  type: string;
  imageUrl: string;
}

export function PosterCard({ title, type, imageUrl }: PosterCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">{type}</p>
      </CardFooter>
    </Card>
  );
}
