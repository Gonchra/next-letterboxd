import {ReactNode} from "react";
import {Navbar} from "@/components/layout/header/navbar";
import {Footer} from "@/components/layout/footer/footer";

interface Props {
    children: ReactNode
}

export default function MainLayout({children}: Props) {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className='grow'>{children}</main>
            <Footer />
        </div>
    )
}