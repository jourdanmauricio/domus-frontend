import { RecoveryPasswordPage } from "@/components/auth/recovery-password/recovery-password-page";

export default async function RecoveryPasswordServer({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { token } = await searchParams;
  return <RecoveryPasswordPage token={token} />;
}
