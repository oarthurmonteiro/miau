'use client'

import { Button, Link } from "@heroui/react";

export default function Page() {
    return (
        <>
            {/* Filtros e ações */}
            <Button
                as={Link}
                color="primary"
                href="/transactions/create"
                variant="solid"
            >
                criar
            </Button>
        </>
    )
}