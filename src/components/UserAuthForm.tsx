"use client";
import { useState } from 'react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { signIn } from "next-auth/react";
import { Icons } from './Icons';
import { useToast } from '../hooks/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {

}

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn('google');
        } catch (error) {
            // toast notification
            toast({
                title: "There was a problem.",
                description: "There was an error logging in with Google.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={ cn("flex justify-center", className) } { ...props }>
            <Button isLoading={isLoading} onClick={ loginWithGoogle } disabled={ isLoading } size={ `sm` } className='w-full'>
                { isLoading ? null : <Icons.google className='h-4 w-4 mr-2' /> }
                Google
            </Button>
        </div>
    );
}
