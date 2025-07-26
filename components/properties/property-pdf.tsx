// components/properties/property-pdf.tsx
'use client';

import { Document, Page, Text, View } from '@react-pdf/renderer';
import { PropertyBackendDto } from '@/lib/types/properties';
import { styles } from '@/app/pdf-styles';
import {
  OWNER_INTENTION_LIST,
  PROPERTY_CONDITION_LIST,
  PROPERTY_TYPE_LIST,
} from '@/lib/constants/list';

interface PropertyPdfProps {
  property: PropertyBackendDto;
}

const PropertyPdf = ({ property }: PropertyPdfProps) => {
  const condition = PROPERTY_CONDITION_LIST.find(
    (condition) => condition.id === property.propertyCondition
  )?.name;
  const commercialStatus = property.commercialStatus
    ? property.commercialStatus.charAt(0).toUpperCase() + property.commercialStatus.slice(1)
    : 'No definido';

  const propertyType = PROPERTY_TYPE_LIST.find((type) => type.id === property.propertyType)?.name;
  const ownerIntention = OWNER_INTENTION_LIST.find(
    (intention) => intention.id === property.ownerIntention
  )?.name;

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Ficha de Propiedad</Text>
          <View style={styles.container}>
            <View style={styles.box}>
              <Text>Nombre: {property.name}</Text>
            </View>
            <View style={[styles.box, { backgroundColor: '#f0f0f0' }]}>
              <Text>Partida: {property.registryNumber}</Text>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.box}>
              <Text style={styles.mb10}>
                {property.address.nomenclator}
                {property.address.postalCode ? ' - CP: ' + property.address.postalCode : ''}
                {property.address.apartment ? ' - Depto: ' + property.address.apartment : ''}
                {property.functionalUnit ? ' - UF: ' + property.functionalUnit : ''}
              </Text>

              <Text style={styles.mb10}>
                Tipo: {propertyType} - Para: {ownerIntention} - Condición: {condition} - Estado
                comercial: {commercialStatus}
              </Text>
              <Text style={styles.mb10}>
                Año de constracción:{' '}
                {property.yearOfConstruction ? property.yearOfConstruction : 'No definido'}
              </Text>
              <Text style={styles.mb10}>
                Metros cubiertos: {property.coveredMeters} - Metros descubiertos:{' '}
                {property.uncoveredMeters} - Cantidad de habitaciones: {property.rooms} - Baños:{' '}
                {property.bathrooms}
              </Text>
              <Text style={styles.mb10}>
                Electricidad (NIS): {property.electricityIdentifier ?? 'No definido'} - Gas (ID):{' '}
                {property.gasIdentifier ?? 'No definido'} - Municipal (ABL):{' '}
                {property.ABLIdentifier ?? 'No definido'}
              </Text>
              {property.administration && (
                <Text style={styles.mb10}>
                  Administración: {property.administration ?? 'No definido'} - Teléfono:{' '}
                  {property.administrationPhone ?? 'No definido'} - Email:{' '}
                  {property.administrationEmail ?? 'No definido'} - Dirección:{' '}
                  {property.administrationAddress ?? 'No definido'}
                </Text>
              )}
              {property.ownerName && (
                <Text style={styles.mb10}>
                  Propietario: {property.ownerName ?? 'No definido'} - Teléfono:{' '}
                  {property.ownerPhone ?? 'No definido'} - CBU: {property.ownerCBU ?? 'No definido'}{' '}
                  - Alias: {property.ownerAlias ?? 'No definido'}
                </Text>
              )}
              <View style={styles.mb10}>
                <Text>{property.hasExpenses && '• Paga expensas'}</Text>
                <Text>
                  {property.hasExtraordinaryExpenses && '• Paga expensas extraordinarias'}
                </Text>
                <Text>{property.hasKitchen && '• Tiene cocina'}</Text>
                <Text>{property.hasPatio && '• Tiene patio'}</Text>
                <Text>{property.hasBarbecue && '• Tiene parrilla'}</Text>
                <Text>{property.hasTerrace && '• Tiene terraza'}</Text>
                <Text>{property.hasPool && '• Tiene pileta'}</Text>
                <Text>{property.hasGarden && '• Tiene jardín'}</Text>
                <Text>{property.hasBalcony && '• Tiene balcón'}</Text>
                <Text>{property.hasFurnished && '• Amueblado'}</Text>
                <Text>{property.hasZoom && '• Tiene zoom'}</Text>
                <Text>{property.hasParking && '• Tiene cochera'}</Text>
                <Text>• Comentario: {property.servicesComment ?? 'No informado'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.box}>
              <Text>descripción: {property.description}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PropertyPdf;
