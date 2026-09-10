import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Log in | UniShare" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/account";

  return (
    <div className="mx-auto max-w-md py-4">
      <AuthForm mode="login" next={next} />
    </div>
  );
}
