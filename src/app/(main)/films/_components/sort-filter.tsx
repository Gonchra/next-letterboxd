import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import Link from "next/link";

interface Props {
    currentFilterType?: string
    triggerStyles: string
    createFilterUrl: (updates: {
        period?: 'all' | 'week' | null,
        sort?: string | null
    }) => string
}


export function SortFilter({triggerStyles, createFilterUrl} : Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={triggerStyles}>
                Сортировка <ChevronDown className='size-3 opacity-50'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-56'>
               <DropdownMenuSub>
                   <DropdownMenuSubTrigger>
                       По популярности
                   </DropdownMenuSubTrigger>
                   <DropdownMenuSubContent className='w-44'>
                       <DropdownMenuItem>
                           <Link href={createFilterUrl({
                               sort: 'popularity-desc',
                               period: 'all'
                           })}>
                               За все время
                           </Link>
                       </DropdownMenuItem>
                       <DropdownMenuItem>
                           <Link href={createFilterUrl({
                               sort: 'popularity-desc',
                               period: 'week'
                           })}>
                               За неделю
                           </Link>
                       </DropdownMenuItem>
                   </DropdownMenuSubContent>
               </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        По дате выхода
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className='w-48'>
                        <DropdownMenuItem>
                            <Link href={createFilterUrl({
                                sort: 'releaseDate-desc'
                            })}>
                                Сначала новые
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={createFilterUrl({
                                sort: 'releaseDate-asc'
                            })}>
                                Сначала старые
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        По рейтингу
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className='w-48'>
                        <DropdownMenuItem>
                            <Link href={createFilterUrl({
                                sort: 'rating-desc'
                            })}>
                                Сначала высокий
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={createFilterUrl({
                                sort: 'rating-asc'
                            })}>
                                Сначала низкий
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}