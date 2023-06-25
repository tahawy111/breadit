"use client";
import { User } from 'next-auth';
import { } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/DropdownMenu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserAccountNavProps {
    user: Pick<User, "name" | "image" | "email">;
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
                <UserAvatar className='h-8 w-8' user={ {
                    name: user.name || null,
                    image: user.image || null
                } } />
            </DropdownMenuTrigger>

            <DropdownMenuContent className='bg-white' align='end'>
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        { user.name && <p className='font-medium'>{ user.name }</p> }
                        { user.email && <p className='w-[200px] truncate text-sm text-zinc-700'>{ user.email }</p> }
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={ `/` }>Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={ `/r/create` }>Create Community</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={ `/settings` }>Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={ (e) => {
                    signOut().then(() => {
                        router.push('/sign-in')
                    })
                } } className='cursor-pointer'>Sign out</DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );
}
