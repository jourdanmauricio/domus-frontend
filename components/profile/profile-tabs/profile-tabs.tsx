import { AddressInfoTab } from '@/components/profile/profile-tabs/address-info-tab';
import { ContactInfoTab } from '@/components/profile/profile-tabs/contact-info-tab';
import { PersonalInfoTab } from '@/components/profile/profile-tabs/personal-info-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProfileTabsProps = {
  disabled: boolean;
};

const ProfileTabs = ({ disabled }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue='contact'>
      <TabsList>
        <TabsTrigger value='contact'>Contacto</TabsTrigger>
        <TabsTrigger value='personal'>Personal</TabsTrigger>
        <TabsTrigger value='address'>Address</TabsTrigger>
      </TabsList>
      <TabsContent value='contact'>
        <ContactInfoTab disabled={disabled} />
      </TabsContent>
      <TabsContent value='personal'>
        <PersonalInfoTab disabled={disabled} />
      </TabsContent>
      <TabsContent value='address'>
        <AddressInfoTab disabled={disabled} />
      </TabsContent>
    </Tabs>
  );
};

export { ProfileTabs };
