"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RoleGuard } from "@/components/dashboard/role-guard";

export default function PropertiesPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Gestión de Propiedades
            </h2>
            <p className="text-muted-foreground">
              Administra las propiedades inmobiliarias
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Propiedad
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Propiedades</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar propiedades..."
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Aquí se mostrará la lista de propiedades</p>
              <p className="text-sm">Funcionalidad en desarrollo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
