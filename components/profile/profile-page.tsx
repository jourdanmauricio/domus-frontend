"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useApiQuery } from "@/hooks/useApi";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit,
  Save,
  X
} from "lucide-react";
import { ProfileForm } from "./profile-form";
import { toast } from "@/hooks/use-toast";

export function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: userProfile, isLoading, refetch } = useApiQuery(
    API_ENDPOINTS.USERS.ME,
    QUERY_KEYS.USERS.ME
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveSuccess = () => {
    setIsEditing(false);
    refetch();
    toast({
      title: "Perfil actualizado",
      description: "Tu información ha sido guardada exitosamente.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Mi Perfil</h2>
          <p className="text-primary/80">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        <Button onClick={handleEditToggle} variant={isEditing ? "outline" : "default"}>
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile?.profile?.avatarUrl || ""} alt={userProfile?.profile?.firstName || ""} />
                <AvatarFallback>
                  {getInitials(`${userProfile?.profile?.firstName || ""} ${userProfile?.profile?.lastName || ""}`)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {userProfile?.profile?.firstName && userProfile?.profile?.lastName
                    ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
                    : session?.user?.name || "Usuario"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.email || session?.user?.email}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Roles:</span>
                <div className="flex gap-1">
                  {session?.user.roles?.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {userProfile?.profile?.dni && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">DNI:</span>
                  <span className="text-sm text-muted-foreground">
                    {userProfile.profile.dni}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Formulario de edición o información detallada */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <ProfileForm 
              userProfile={userProfile} 
              onSave={handleSaveSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              {/* Información de contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {userProfile?.email || session?.user?.email}
                        </p>
                      </div>
                    </div>
                    
                    {userProfile?.profile?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm text-muted-foreground">
                            {userProfile.profile.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userProfile?.profile?.birthDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Fecha de Nacimiento</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(userProfile.profile.birthDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {userProfile?.profile?.gender && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Género</p>
                          <p className="text-sm text-muted-foreground">
                            {userProfile.profile.gender}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {userProfile?.profile?.nationality && (
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Nacionalidad</p>
                          <p className="text-sm text-muted-foreground">
                            {userProfile.profile.nationality}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {userProfile?.profile?.language && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Idioma</p>
                          <p className="text-sm text-muted-foreground">
                            {userProfile.profile.language}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Dirección */}
              {userProfile?.profile?.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Dirección
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {userProfile.profile.address.street} {userProfile.profile.address.number}
                        {userProfile.profile.address.apartment && `, Apt ${userProfile.profile.address.apartment}`}
                      </p>
                      {userProfile.profile.address.neighborhood && (
                        <p className="text-sm text-muted-foreground">
                          {userProfile.profile.address.neighborhood}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Biografía */}
              {userProfile?.profile?.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>Biografía</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.profile.bio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 