"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/dashboard/role-guard";

export default function ReceiptsPage() {
  return (
    <RoleGuard allowedRoles={["tenant", "guarantor"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mis Recibos</h2>
            <p className="text-muted-foreground">
              Consulta y descarga tus recibos de pago
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Descargar Todos
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Recibos</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar recibos..." className="pl-8 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Aquí se mostrará tu historial de recibos</p>
              <p className="text-sm">Funcionalidad en desarrollo</p>
            </div>
          </CardContent>
        </Card>

        {/* Ejemplo de recibos */}
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Receipt className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      Recibo de Alquiler - Enero 2024
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Propiedad: Calle Principal 123
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Pagado</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
