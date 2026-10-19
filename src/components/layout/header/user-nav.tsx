import {useRouter} from "next/navigation";
import {authClient} from "@/lib/tools/auth-client";
import Link from "next/link";
import {getInitials} from "@/lib/utils/get-initials";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export function UserNav() {
    const router = useRouter()
    const {data: session, isPending} = authClient.useSession()

    if(isPending) {
        return (
            <div className="h-6 w-20 animate-pulse bg-muted/20 rounded" />
        )
    }

    if(!session?.user) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-sm font-semibold uppercase text-muted hover:text-foreground tracking-wider transition-colors"
                >
                   Войти
                </Link>
                <Link
                    href="/register"
                    className="text-sm font-semibold uppercase text-muted hover:text-foreground tracking-wider transition-colors"
                >
                    Создать аккаунт
                </Link>
            </div>
        )
    }

    const {user} = session

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/')
                    router.refresh()
                }
            }
        })
    }

    const initials = getInitials(user.name)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className='flex items-center gap-2 text-sm font-semibold uppercase text-muted hover:text-primary focus:outline-none tracking-wider cursor-pointer transition-colors max-w-50 truncate'>
                    <Avatar className='w-6 h-6'>
                        <AvatarImage
                            src={user.image || ''}
                            alt={user.username || 'No name'}
                        />
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.username}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' sideOffset={15}>
                <DropdownMenuItem>
                    <Link href={`/${user.username}`}>Профиль</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/${user.username}/films`}>Фильмы</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/${user.username}/diary`}>Дневник</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/${user.username}/watchlist`}>Буду смотреть</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/${user.username}/likes`}>Любимые</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    Выйти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}