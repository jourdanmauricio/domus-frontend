import { AddressSelector } from '@/components/geography/address-selector';

type AddressInfoProps = {
  disabled: boolean;
};

const AddressInfo = ({ disabled }: AddressInfoProps) => {
  return <AddressSelector disabled={disabled} />;
};

export { AddressInfo };
