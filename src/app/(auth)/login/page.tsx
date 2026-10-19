import {LoginForm} from "@/app/(auth)/login/_components/login-form";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Вход в аккаунт',
    description: "Войдите в свой аккаунт кино-сообщества."
}

export default function LoginPage() {
    return <LoginForm/>
}