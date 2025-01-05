import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function page() {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  if (status !== "authenticated" || data?.userData.role !== "USER") {
    return <h1>Unauthorized</h1>;
  }
  return (
    <div>
      <h1>Group Admin</h1>
      <p>This is the Group Admin page</p>
    </div>
  );
}
