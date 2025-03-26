'use client'

import { Logo } from "@/components/Logo";
import { Button, Skeleton, User } from "@heroui/react";
import { useAuth } from "@/components/Providers/Auth";

export default function Layout({ children }: { children: React.ReactNode }) {

    const { user, isPending, signOutMutation } = useAuth();

    // const isPending = true;

    return (
        (
            <div className="flex h-screen w-screen border">
                <nav className="flex flex-col w-1/6 px-4 py-3.5 border items-center gap-3">
                    <Logo />

                    <div className="grow w-full border">
                        <div>Rotas</div>
                    </div>
                    <div>
                        <Button onPress={() => signOutMutation.mutate()} >Sair</Button>
                    </div>
                </nav>
                <main className="grow flex flex-col px-10">
                    <header className="border-b h-24 flex justify-end">
                        {
                            isPending
                                ? (
                                    <div className="max-w-[200px] w-full flex items-center gap-3">
                                        <div>
                                            <Skeleton className="flex rounded-full w-12 h-12" />
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <Skeleton className="h-3 w-3/4 rounded-lg" />
                                            <Skeleton className="h-3 w-4/4 rounded-lg" />
                                        </div>
                                    </div>
                                )
                                : <User
                                    avatarProps={{
                                        // src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                                        src: "https://avatars.githubusercontent.com/u/65921007",
                                    }}
                                    description={user?.email}
                                    name={`${user?.firstName} ${user?.lastName}`}
                                />
                        }
                    </header>
                    <main className="grow py-8">
                        {children}
                    </main>
                </main>
            </div>
        )
    )
}