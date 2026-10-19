'use client'

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
    currentYear?: number
    triggerStyles: string
    createFilterUrl: (updates: { year?: number | null }) => string
}

export function YearFilter({currentYear, triggerStyles, createFilterUrl}: Props) {
    const sysYear = new Date().getFullYear()
    const currentDecade = Math.floor(sysYear / 10) * 10

    const decades = Array.from(
        {length: (currentDecade - 1930) / 10 + 1},
        (_, i) => {
            const decadeStart = currentDecade - i * 10
            const isCurrent = decadeStart === currentDecade
            const maxYear = isCurrent ? sysYear : decadeStart + 9

            const years = Array.from(
                {length: maxYear - decadeStart + 1},
                (_, j) => maxYear - j,
            )
            const title = decadeStart >= 2000 ? `${decadeStart}-е` : `${String(decadeStart).slice(2)}-е`

            return {title, years}
        }
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={triggerStyles}>
                {currentYear ? `${currentYear} год` : 'Все годы'}{' '}
                <ChevronDown className='size-3 opacity-50'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
                <DropdownMenuItem>
                    <Link href={createFilterUrl({year: null})}>
                        Все время
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {decades.map((decade) => (
                    <DropdownMenuSub key={decade.title}>
                        <DropdownMenuSubTrigger>
                            {decade.title}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className='w-36'>
                            {decade.years.map((y) => (
                                <DropdownMenuItem key={y}>
                                    <Link href={createFilterUrl({year: y})}>
                                        {y} год
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}