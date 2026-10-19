import type { Metadata } from 'next';
import {RegisterForm} from "./_components/register-form";

export const metadata: Metadata = {
    title: 'Регистрация',
    description: 'Создай аккаунт в лучшем кино-сообществе'
}

export default async function RegisterPage() {
    return <RegisterForm />
}