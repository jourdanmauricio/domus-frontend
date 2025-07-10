import { AddressSelector } from '@/components/geography/address-selector';

type AddressInfoTabProps = {
  disabled: boolean;
};

const AddressInfoTab = ({ disabled }: AddressInfoTabProps) => {
  return <AddressSelector disabled={disabled} />;
};

export { AddressInfoTab };
