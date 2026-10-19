'use client'

import {YearFilter} from "@/app/(main)/films/_components/year-filter";
import {StatusFilter} from "@/app/(main)/films/_components/status-filter";
import {SortFilter} from "@/app/(main)/films/_components/sort-filter";

interface FilmsFilterProps {
    isGuest: boolean
    currentFilters: {
        year?: number
        genre?: string
        sortBy: string
        sortOrder: string
        period: string
        filterType?: string
    }
}

export function FilmsFilter({
                                currentFilters = {sortBy: 'popularity', sortOrder: 'desc', period: 'all'},
                                isGuest
                            }: FilmsFilterProps) {
    const triggerStyles = 'text-[11px] uppercase tracking-widest text-muted font-normal hover:text-white cursor-pointer flex items-center gap-1 outline-none transition-colors'

    function createFilterUrl(updates: {
        year?: number | null
        sort?: string | null
        period?: 'all' | 'week' | 'year' | null
        filterType?: 'watchlist' | 'liked' | 'watched' | null
    }) {
        const filters = {...currentFilters}

        if (updates.year !== undefined) {
            filters.year = updates.year === null ? undefined : updates.year
        }

        if (updates.period !== undefined) {
            filters.period = updates.period === null ? 'all' : updates.period
        }

        if (updates.filterType !== undefined) {
            filters.filterType = updates.filterType === null ? undefined : updates.filterType
        }

        if (updates.sort !== undefined) {
            if (updates.sort === null) {
                filters.sortBy = 'popularity'
                filters.sortOrder = 'desc'
            } else {
                const [by, order] = updates.sort.split('-')
                filters.sortBy = by
                filters.sortOrder = order
                if (by !== 'popularity') {
                    filters.period = 'all'
                }
            }
        }

        const path: string[] = []

        if (filters.filterType && !isGuest) {
            path.push('filterType', filters.filterType)
        }
        if (filters.year) {
            path.push('year', String(filters.year))
        }
        if (filters.genre) {
            path.push('genre', filters.genre)
        }
        if (filters.sortBy !== 'popularity' || filters.sortOrder !== 'desc') {
            path.push('sort', `${filters.sortBy}-${filters.sortOrder}`)
        }
        if (filters.period !== 'all' && filters.sortBy === 'popularity') {
            path.push('period', filters.period)
        }

        return path.length > 0 ? `/films/${path.join('/')}` : '/films'
    }

    return (
        <div className="flex items-center gap-6">

            {!isGuest && (
                <StatusFilter
                    triggerStyles={triggerStyles}
                    createFilterUrl={createFilterUrl}
                    currentFilterType={currentFilters.filterType}
                />
            )}

            <YearFilter
                triggerStyles={triggerStyles}
                createFilterUrl={createFilterUrl}
                currentYear={currentFilters.year}
            />

            <SortFilter
                triggerStyles={triggerStyles}
                createFilterUrl={createFilterUrl}
            />
        </div>
    )
}