import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { CreateUserDialog } from "./create_user_dialog";

export function CreateUserCard() {
  return (
    <>
      <Card className="sm:col-span-2 w-full" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>User base</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Manage the users accessing the app
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <CreateUserDialog />
        </CardFooter>
      </Card>
    </>
  );
}
