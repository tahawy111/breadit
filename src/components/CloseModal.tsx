"use client";
import { } from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';

interface CloseModalProps {

}

export default function CloseModal({ }: CloseModalProps) {
    const router = useRouter();
    return (
        <Button variant={ 'subtle' } className='h-6 w-6 p-0 rounded-md' onClick={ () => router.back() } aria-label='close modal'>
            &times;
        </Button>
    );
}
