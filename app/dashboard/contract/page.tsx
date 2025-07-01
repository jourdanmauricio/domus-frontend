"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSignature, Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/dashboard/role-guard";

export default function ContractPage() {
  return (
    <RoleGuard allowedRoles={["tenant", "guarantor"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mi Contrato</h2>
            <p className="text-muted-foreground">
              Información detallada de tu contrato de arrendamiento
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Descargar Contrato
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSignature className="mr-2 h-5 w-5" />
                Detalles del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Número de Contrato
                  </p>
                  <p className="text-sm">CTR-2024-001</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Estado
                  </p>
                  <Badge variant="default">Activo</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Inicio
                  </p>
                  <p className="text-sm">01/01/2024</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Fin
                  </p>
                  <p className="text-sm">31/12/2024</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Renta Mensual
                  </p>
                  <p className="text-sm font-semibold">$1,200.00</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Depósito
                  </p>
                  <p className="text-sm">$2,400.00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Propiedad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dirección
                </p>
                <p className="text-sm">Calle Principal 123, Ciudad</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tipo
                </p>
                <p className="text-sm">Apartamento</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Habitaciones
                </p>
                <p className="text-sm">2 dormitorios, 1 baño</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Área
                </p>
                <p className="text-sm">75 m²</p>
              </div>
            </CardContent>
          </Card>

          {/* Información del Propietario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Propietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre
                </p>
                <p className="text-sm">Juan Pérez</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">juan.perez@email.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>
                <p className="text-sm">+1 234 567 8900</p>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Pagos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Próximos Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Febrero 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Vence: 01/02/2024
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$1,200.00</p>
                    <Badge variant="secondary">Pendiente</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Marzo 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Vence: 01/03/2024
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$1,200.00</p>
                    <Badge variant="outline">Futuro</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
