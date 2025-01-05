import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

type Usertype = {
  username: string;
  state: string;
  district: string;
  phone: string;
};

export function UserTable() {
  const [users, setUsers] = useState<Usertype[]>([]);

  useEffect(() => {
    console.log("Fetching users...");
    fetch("http://localhost:8080/api/v2/user/get-all-users")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const users: Usertype[] = data.map((user: any) => {
          return {
            username: user.Names.length > 0 ? user.Names[0].name : "No name",
            state: user.state.name,
            district: user.district.name,
            phone: user.phone,
          };
        });
        console.log(users);

        setUsers(users);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  if (!users || users.length === 0) {
    return <p>No users found</p>;
  }

  const userElements = users.map((user, i) => (
    <TableRow
      key={i}
      className={i % 2 === 0 ? "text-left bg-accent" : "text-left"}
    >
      <TableCell>
        <div className="font-medium">{user.username}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {user.phone}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{user.state}</TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge
          className="text-xs"
          variant={i % 2 === 1 ? "secondary" : "outline"}
        >
          user {/* Hardcoded value for now */}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{user.district}</TableCell>
      <TableCell className="text-right">{user.phone}</TableCell>
    </TableRow>
  ));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">State</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell">District</TableHead>
          <TableHead className="text-right">Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{userElements}</TableBody>
    </Table>
  );
}
