import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Register | UniShare" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md py-4">
      <AuthForm mode="register" />
    </div>
  );
}
