import {cn} from "@/lib/utils/cn";

interface Props {
    message: string
    className?: string
}

export function EmptyState({message, className}: Props) {
 return (
     <div className={cn('mt-10 text-center py-12', className)}>
         <p className="text-muted-foreground italic text-sm tracking-wide">
             {message}
         </p>
     </div>
 )
}