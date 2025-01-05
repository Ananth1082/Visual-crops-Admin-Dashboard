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

type Grouptype = {
  id: string;
  name: string;
  logo: string;
  area_code: string;
};

export function GroupTable() {
  const [group, setGroup] = useState<Grouptype[]>([]);

  useEffect(() => {
    console.log("Fetching users...");
    fetch("http://localhost:8080/api/v2/group")
      .then((response) => response.json())
      .then((data: { groups: Grouptype[] }) => {
        console.log("Fetched data:", data);
        const groups: Grouptype[] = data.groups;
        console.log(groups.map((grp) => grp.area_code));

        setGroup(groups);
      })
      .catch((error) => console.error("Error fetching groups:", error));
  }, []);

  if (!group || group.length === 0) {
    return <p>No users found</p>;
  }

  const userElements = group.map((grp, i) => (
    <TableRow
      key={i}
      className={i % 2 === 0 ? "text-left bg-accent" : "text-left"}
    >
      <TableCell>
        <div className="font-medium">{grp.id}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{grp.name}</TableCell>
      <TableCell className="hidden sm:table-cell">{grp.area_code}</TableCell>

      <TableCell className="hidden md:table-cell">
        <img src={grp.logo} className="h-20"></img>
      </TableCell>
    </TableRow>
  ));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="hidden sm:table-cell">Name</TableHead>
          <TableHead className="hidden sm:table-cell">Code</TableHead>
          <TableHead className="hidden sm:table-cell">Logo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{userElements}</TableBody>
    </Table>
  );
}
