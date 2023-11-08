import { UserButton } from "@clerk/nextjs"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="dashboard">
            <div className="m-4 flex items-center">
                <UserButton afterSignOutUrl="/" />
                <span className="ml-2 text-sm">Perfil</span>
            </div>
            <div className="flex flex-col items-center">
                {children}
            </div>

        </div>
    )
}
