"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RoleGuard } from "@/components/dashboard/role-guard";

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Gestión de Usuarios
            </h2>
            <p className="text-muted-foreground">
              Administra los usuarios del sistema
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar usuarios..." className="pl-8 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Aquí se mostrará la lista de usuarios</p>
              <p className="text-sm">Funcionalidad en desarrollo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
