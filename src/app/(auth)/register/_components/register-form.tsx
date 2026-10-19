'use client'

import {z} from "zod";
import {useRouter} from "next/navigation";
import {useForm} from "@tanstack/react-form";
import {authClient} from "@/lib/tools/auth-client";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const registerSchema = z.object({
    username: z.string().min(2, 'Минимум 2 символа'),
    email: z.email('Неверный формат почты'),
    password: z.string().min(6, 'Минимум 6 символов')
})

export function RegisterForm() {
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
        onSubmit: async ({value}) => {
            const {error} = await authClient.signUp.email({
                name: value.username,
                username: value.username,
                email: value.email,
                password: value.password,
                callbackURL: '/'
            })

            if (error) {
                alert(error.message)
            } else {
                router.push('/')
            }
        },
        validators: {
            onSubmit: registerSchema
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
                    Начни свою историю
                </h1>
                <p className="text-muted-foreground text-sm">
                    Рассказывай о кино вместе с Letterboxd
                </p>
            </div>

            <form.Field
                name='username'
                validators={{onChange: registerSchema.shape.username}}
                children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                        <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Имя</FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                placeholder="vito_corleone"
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
                name='email'
                validators={{onChange: registerSchema.shape.email}}
                children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                        <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="email"
                                placeholder="vito.corleone@gmail.com"
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
                validators={{onChange: registerSchema.shape.password}}
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
                        {isSubmitting ? 'Загрузка...' : 'Продолжить'}
                    </Button>
                )}
            />

            <p className="mt-1 text-center text-sm text-muted-foreground">
                Уже есть аккаунт? {' '}
                <Link href='/login' className='text-foreground hover:underline'>
                    Войти
                </Link>
            </p>
        </form>
    )
}