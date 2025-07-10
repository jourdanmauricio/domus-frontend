export type ProvinceBackendDto = {
  id: string;
  nombre: string;
};

export type CityBackendDto = {
  categoria: string;
  centroide_lat: string;
  centroide_lon: string;
  departamento_id: string;
  departamento_nombre: string;
  id: string;
  localidad_censal_id: string;
  localidad_censal_nombre: string;
  municipio_id: string;
  municipio_nombre: string;
  nombre: string;
  provincia_id: string;
  provincia_nombre: string;
};

export type CityMapperDto = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  provincieId: string;
};

export type georefAddressDto = {
  altura_unidad: string;
  altura_valor: number;
  calle_categoria: string;
  calle_cruce_1_categoria: string | null;
  calle_cruce_1_id: string | null;
  calle_cruce_1_nombre: string | null;
  calle_cruce_2_categoria: string | null;
  calle_cruce_2_id: string | null;
  calle_cruce_2_nombre: string | null;
  calle_id: string;
  calle_nombre: string;
  departamento_id: string;
  departamento_nombre: string;
  localidad_censal_id: string;
  localidad_censal_nombre: string;
  nomenclatura: string;
  piso: string | null;
  provincia_id: string;
  provincia_nombre: string;
  ubicacion_lat: number;
  ubicacion_lon: number;
};

export type georefAddressResponseDto = {
  cantidad: number;
  inicio: number;
  total: number;
  parametros: any;
  direcciones: georefAddressDto[];
};
