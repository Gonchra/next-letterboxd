import {FilmDetails} from "@/server/types/film";
import {z} from "zod";
import {useAction} from "next-safe-action/hooks";
import {logFilmAction} from "@/server/actions/diary";
import {useForm} from "@tanstack/react-form";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {StarRating} from "@/components/shared/star-rating";
import {Heart} from "lucide-react";
import {cn} from "@/lib/utils/cn";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export const logFilmSchema = z.object({
    rating: z.number().min(0).max(5),
    review: z.string(),
    liked: z.boolean()
})

interface LogFilmDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    film: FilmDetails
}

export function LogFilmDialog({isOpen, onOpenChange, film}: LogFilmDialogProps) {
    const {executeAsync} = useAction(logFilmAction)

    const form = useForm({
        defaultValues: {
            rating: 0,
            review: '',
            liked: false
        },
        validators: {
            onSubmit: logFilmSchema
        },
        onSubmit: async ({value}) => {
            const result = await executeAsync({
                ...value,
                filmId: film.id
            })

            if (result?.data?.success) {
                form.reset()
                onOpenChange(false)
            }
        }
    })

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset()
                }
                onOpenChange(open)
            }}
        >
            <DialogContent className='max-w-md gap-0 p-0 overflow-hidden'>
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <div className="border-b border-border px-6 py-5">
                        <DialogHeader>
                            <DialogTitle className='text-base font-semibold leading-tight'>
                                Добавить фильм
                            </DialogTitle>
                            <p className="text-sm mt-0.5">
                                {film.title}{' '}
                                <span className='text-muted-foreground'>
                                    ({film.year})
                                </span>
                            </p>
                        </DialogHeader>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-5">
                        <form.Field
                            name='rating'
                            children={(ratingField) => {
                                const isInvalid = ratingField.state.meta.isTouched && !ratingField.state.meta.isValid

                                return (
                                    <Field data-invalid={isInvalid} className='flex flex-col gap-2'>
                                        <FieldLabel>
                                            Оценка
                                            <span className="normal-case text-muted-foreground/80 ml-1 tracking-normal">
                                                (необязательно)
                                            </span>
                                        </FieldLabel>
                                        <div className="flex items-center gap-3 w-full">
                                            <StarRating
                                                value={ratingField.state.value}
                                                onChange={(val) => ratingField.handleChange(val)}
                                                size='lg'
                                            />
                                            {ratingField.state.value > 0 && (
                                                <button
                                                    type='button'
                                                    onClick={() => ratingField.handleChange(0)}
                                                    className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                                                >
                                                    Очистить
                                                </button>
                                            )}

                                            <form.Field
                                                name="liked"
                                                children={(likedField) => (
                                                    <button
                                                        type='button'
                                                        onClick={() => likedField.handleChange(!likedField.state.value)}
                                                        aria-pressed={likedField.state.value}
                                                        className='ml-auto p-2 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-rose-400 transition-all'
                                                    >
                                                        <Heart
                                                            className={cn(
                                                                'size-5 transition-colors', likedField.state.value ? 'fill-rose-500 text-rose-500' : ''
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                            />
                                        </div>
                                        {isInvalid && (
                                            <FieldError
                                                errors={ratingField.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field
                            name='review'
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>
                                            Отзыв
                                            <span className="normal-case text-muted-foreground/80 ml-1 tracking-normal">
                                                (необязательно)
                                            </span>
                                        </FieldLabel>
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            placeholder='Напишите ваши мысли о фильме...'
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            rows={4}
                                            onChange={(event) => field.handleChange(event.target.value)}
                                            className='text-sm'
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}

                        />
                    </div>

                    <DialogFooter className='px-6 mb-0 bg-muted/30'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                                form.reset()
                                onOpenChange(false)
                            }}
                        >
                            Отмена
                        </Button>

                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting
                            ]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button
                                    size='sm'
                                    type='submit'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? 'Сохранение...'
                                        : 'Сохранить'
                                    }

                                </Button>
                            )}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}