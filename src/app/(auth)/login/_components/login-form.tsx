'use client'

import {z} from "zod";
import {useRouter} from "next/navigation";
import {useForm} from "@tanstack/react-form";
import {authClient} from "@/lib/tools/auth-client";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const loginSchema = z.object({
    identifier: z.string().min(2, 'Введите почту или имя польователя'),
    password: z.string().min(6, 'Минимум 6 символов')
})

export function LoginForm() {
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            identifier: '',
            password: ''
        },
        onSubmit: async ({value}) => {
            const isEmail = value.identifier.includes('@')

            const authenticate = isEmail ?
                authClient.signIn.email({
                    email: value.identifier,
                    password: value.password,
                    callbackURL: '/'
                }) : authClient.signIn.username({
                    username: value.identifier,
                    password: value.password,
                    callbackURL: '/'
                })

            const {error} = await authenticate

            if (error) {
                alert(error.message || 'Ошибка авторизации')
            } else {
                router.push('/')
                router.refresh()
            }
        },
        validators: {
            onSubmit: loginSchema
        }
    })

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                form.handleSubmit()
            }}
            className='flex flex-col gap-4 p-8 bg-surfaсe backdrop-blur-xl rounded-2xl w-full max-w-105 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10'
        >
            <div className="space-y-1">
                <h1 className="text-2xl font-medium text-white">
                    С возвращением!
                </h1>
                <p className="text-muted-foreground text-sm">
                    Введите данные для входа в аккаунт
                </p>
            </div>

            <form.Field
                name='identifier'
                validators={{onChange: loginSchema.shape.identifier}}
                children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                        <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Email или имя пользователя</FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                placeholder="tyler_durden"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                aria-invalid={isInvalid}
                            />
                            {isInvalid && (
                                <FieldError errors={field.state.meta.errors}/>
                            )}
                        </Field>
                    )
                }}
            />

            <form.Field
                name='password'
                validators={{onChange: loginSchema.shape.password}}
                children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                        <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Пароль</FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                placeholder="******"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                aria-invalid={isInvalid}
                            />
                            {isInvalid && (
                                <FieldError errors={field.state.meta.errors}/>
                            )}
                        </Field>
                    )
                }}
            />

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitted]}
                children={([canSubmit, isSubmitting]) => (
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2"
                    >
                        {isSubmitting ? 'Вход...' : 'Войти'}
                    </Button>
                )}
            />

            <p className="mt-1 text-center text-sm text-muted-foreground">
                Нет аккаунта? {' '}
                <Link href='/register' className='text-foreground hover:underline'>
                    Создать аккаунт
                </Link>
            </p>
        </form>
    )
}