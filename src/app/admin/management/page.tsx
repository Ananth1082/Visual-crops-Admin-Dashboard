"use client";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/user-table";
import { UserLogs } from "@/components/user_logs";
import { CreateUserCard } from "@/components/create_user_card";
import { GroupTable } from "@/components/group-table";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export default function UserPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "authenticated") {
    return (
      <>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <CreateUserCard />
                </div>
                <Tabs defaultValue="user">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="user">Users</TabsTrigger>
                      <TabsTrigger value="group">Groups</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="user">
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardHeader className="px-7">
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                          List of users accessing the app
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <UserTable />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="group">
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardHeader className="px-7">
                        <CardTitle>Group</CardTitle>
                        <CardDescription>List of groups</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <GroupTable />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              <UserLogs />
            </main>
          </div>
        </div>
      </>
    );
  } else {
    return <h1>Unauthorized</h1>;
  }
}
