import { RoleGuard } from "@/components/dashboard";
import UsersPage from "@/components/users/usersPage";

export default function UsersPageServer() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <UsersPage />
    </RoleGuard>
  );
}
