
import { User } from 'next-auth';
import Image from 'next/image';
import { } from 'react';
import { AvatarFallback, Avatar } from './ui/Avatar';
import { Icons } from './Icons';
import { AvatarProps } from '@radix-ui/react-avatar';

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "name" | "image">;
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            { user.image ? (
                <div className='relative aspect-square h-full w-full'>
                    <Image fill src={ user.image } alt='Profile Picture' referrerPolicy='no-referrer' />
                </div>
            ) : (
                <AvatarFallback>
                    <span className='sr-only'>{ user.name }</span>
                    <Icons.user />
                </AvatarFallback>
            ) }
        </Avatar>
    );
}
