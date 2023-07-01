export const metadata = {
  title: "Settings",
  description:"Manage account and website settings."
};


import { authOptions, getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {} from 'react';

interface routeProps {
  
}

export default async function page({ }: routeProps) {
  const session = await getAuthSession();

  if(!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in")
  }

    return (
        <div className="max-w-4xl mx-auto py-12">
          <div className="grid items-start gap-8">
          
          </div>
        </div>
    )
}
