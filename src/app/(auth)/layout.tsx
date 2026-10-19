import {ReactNode} from "react";

export default function AuthLayout({children}: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    )
}