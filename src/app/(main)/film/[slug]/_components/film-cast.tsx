import {FilmDetails} from "@/server/types/film";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils/get-initials";

interface FilmCastProps {
    cast: FilmDetails['cast']
}

export function FilmCast({cast}: FilmCastProps) {
    return (
        <div className='grid grid-cols-2 gap-3'>
            {cast.slice(0, 6).map((member) => (
                <div key={member.personId} className="flex items-center gap-3">
                    <Avatar className='size-9 shrink-0'>
                        <AvatarFallback>
                            {getInitials(member.person.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate leading-tight">
                            {member.person.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {member.characterName}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}