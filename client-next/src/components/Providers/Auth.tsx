// context/AuthContext.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { request } from '@/app/lib/client';
import { addToast } from '@heroui/react';

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
}

// type AuthContextType<TUser extends User | null> = {
//     user: TUser;
//     isPending: boolean;
// } & (TUser extends User
//     ? { signOutMutation: { mutate: () => Awaited<void> } }
//     : { signInMutation: { isPending: boolean, mutate: (payload: FormData) => Awaited<void> } });

type AuthContextType = {
    user: User | null;
    isPending: boolean;
    signOutMutation: { mutate: () => Awaited<void> };
    signInMutation: { isPending: boolean, mutate: (payload: FormData) => Awaited<void> }
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isPending: false,
    signInMutation: { isPending: false, mutate: () => { } },
    signOutMutation: { mutate: () => { } },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Query para obter a o usuário a partir da sessão
    const { data: user, isPending } = useQuery({
        queryKey: ['users'],
        queryFn: () => request<User>('/api/v1/users', {}),
        select: (data) => data?.body,
        retry: false,
    })

    // Mutation para login
    const { isPending: signInIsPending, mutate: signInMutate } = useMutation({
        mutationKey: ['auth', 'sign-in'],
        mutationFn: (payload: FormData) =>
            request<null>('/api/v1/auth/sign-in', {
                method: 'POST',
                payload
            }),
        onError: (error: Error) => {
            addToast({
                title: "Falha na autenticação",
                description: error.message || "Não conseguimos te localizar. Verifique suas credenciais e tente novamente.",
                color: 'warning',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            router.push('/dashboard');
        }
    })

    // Mutation para logout
    const { mutate: signOutMutate } = useMutation({
        mutationKey: ['auth', 'sign-out'],
        mutationFn: () =>
            request<null>('/api/v1/auth/sign-out', { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            router.push('/sign-in')
        }
    });

    // // Redireciona se autenticado tentar acessar login/cadastro
    // useEffect(() => {
    //     if (!isPending && user && ['/sign-in', '/sign-up'].includes(pathname)) {
    //         router.replace('/dashboard');
    //     }
    // }, [user, isPending, pathname, router]);


    return (
        <AuthContext.Provider
            value={
                {
                    user: user ? user : null,
                    isPending,
                    signOutMutation: { mutate: signOutMutate },
                    signInMutation: { isPending: signInIsPending, mutate: signInMutate }
                }
            }
        >
            {children}
        </AuthContext.Provider >
    );
}

export const useAuth = () => useContext(AuthContext);