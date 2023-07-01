export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

import UserNameForm from "@/components/UserNameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {} from "react";

interface routeProps {}

export default async function page({}: routeProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  console.log(session);
  

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8 py-1">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm
          user={{ id: session.user.id, username: session.user.username || "" }}
        />
      </div>
    </div>
  );
}
