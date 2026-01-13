'use client'

import { Logo } from "@/components/Logo";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton, User } from "@heroui/react";
import { useAuth } from "@/components/Providers/Auth";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {

    const { user, isPending, signOutMutation } = useAuth();

    // const isPending = true;

    return (
        (
            <div className="flex flex-col h-screen w-screen">

                <header className="w-full px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start rtl:justify-end">
                                {/* <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                    <span className="sr-only">Open sidebar</span>
                                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                    </svg>
                                </button> */}
                                <Link href={'/dashboard'}>
                                    <Logo />
                                </Link>
                            </div>

                            <div className="flex items-center">
                                {/* <div className="flex items-center ms-3"> */}
                                    {
                                        isPending
                                            ? (
                                                <div className="max-w-[200px] w-full flex items-center gap-3">
                                                    <div>
                                                        <Skeleton className="flex rounded-full w-12 h-12" />
                                                    </div>
                                                    <div className="w-48 flex flex-col gap-2">
                                                        <Skeleton className="h-3 w-3/4 rounded-lg" />
                                                        <Skeleton className="h-3 w-4/4 rounded-lg" />
                                                    </div>
                                                </div>
                                            )
                                            : <Dropdown>
                                                <DropdownTrigger>
                                                    <User
                                                        avatarProps={{
                                                            // src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                                                            src: "https://avatars.githubusercontent.com/u/65921007",
                                                        }}
                                                        description={user?.email}
                                                        name={`${user?.firstName} ${user?.lastName}`}
                                                    />
                                                </DropdownTrigger>
                                                <DropdownMenu>
                                                    <DropdownItem key="sign-out" className="text-danger" color="danger" onPress={() => signOutMutation.mutate()}>
                                                        Sair
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>

                                    }
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grow flex">

                    <nav className="w-1/6 py-4 border-r-1">

                        <div className="px-3 pb-4 overflow-y-auto">

                            <ul className="space-y-2 text-lg font-medium">
                                {
                                    routes.map((r, idx) => (

                                        <li key={idx}>
                                            <Link href={r.href} className="flex gap-4 items-center px-4 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-secondary dark:hover:bg-gray-700 group">
                                                {r.Icon()}
                                                {r.label}
                                            </Link>
                                        </li>

                                    ))
                                }
                            </ul>

                        </div>
                    </nav>
                    <main className="grow p-8">

                        {/* <main className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 overflow-y-auto"> */}
                            {children}
                        {/* </main> */}
                    </main>

                </div>


            </div>
        )
    )
}

const routes = [
    {
        label: 'Contas',
        href: '/accounts',
        Icon: () =>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                <path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
    },
    {
        label: 'Transações',
        href: '/transactions',
        Icon: () =>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="h-6 w-6">
                <path d="M416 176c0 97.2-93.1 176-208 176c-38.2 0-73.9-8.7-104.7-23.9c-7.5 4-16 7.9-25.2 11.4C59.8 346.4 37.8 352 16 352c-6.9 0-13.1-4.5-15.2-11.1s.2-13.8 5.8-17.9c0 0 0 0 0 0s0 0 0 0l.2-.2c.2-.2 .6-.4 1.1-.8c1-.8 2.5-2 4.3-3.7c3.6-3.3 8.5-8.1 13.3-14.3c5.5-7 10.7-15.4 14.2-24.7C14.7 250.3 0 214.6 0 176C0 78.8 93.1 0 208 0S416 78.8 416 176zM231.5 383C348.9 372.9 448 288.3 448 176c0-5.2-.2-10.4-.6-15.5C555.1 167.1 640 243.2 640 336c0 38.6-14.7 74.3-39.6 103.4c3.5 9.4 8.7 17.7 14.2 24.7c4.8 6.2 9.7 11 13.3 14.3c1.8 1.6 3.3 2.9 4.3 3.7c.5 .4 .9 .7 1.1 .8l.2 .2s0 0 0 0s0 0 0 0c5.6 4.1 7.9 11.3 5.8 17.9c-2.1 6.6-8.3 11.1-15.2 11.1c-21.8 0-43.8-5.6-62.1-12.5c-9.2-3.5-17.8-7.4-25.2-11.4C505.9 503.3 470.2 512 432 512c-95.6 0-176.2-54.6-200.5-129zM228 72c0-11-9-20-20-20s-20 9-20 20l0 14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1c0 0 0 0 0 0s0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4l0 14.6c0 11 9 20 20 20s20-9 20-20l0-13.8c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7L228 72z" />
            </svg>
    }
]