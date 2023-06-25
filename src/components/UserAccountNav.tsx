import { User } from 'next-auth';
import {} from 'react';

interface UserAccountNavProps {
    user: Pick<User, "name" |"image" | "email">
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
    return (
        <div>UserAccountNav</div>
    )
}
