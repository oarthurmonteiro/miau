'use client';

import TrashSvg from "@assets/svg/trash.svg";
import { useDisclosure, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

export function DeleteModal({ className, mutate, isPending }: {
    className: string,
    isPending: boolean,
    mutate: () => void
}) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    function handleMutation() {
        mutate();
        onClose();
    }

    return (
        <div className={className}>
            <Button
                type="button"
                isIconOnly
                color='danger'
                variant="light"
                className="flex"
                onPress={onOpen}
                isLoading={isPending}
            >
                <TrashSvg width={'.85rem'} />
            </Button>
            <Modal
                isOpen={isOpen}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                placement="top-center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        tem certeza?
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            Essa ação não tem retorno... Está certo que é isso que quer fazer?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            cancelar
                        </Button>
                        <Button color="primary" onPress={handleMutation}>
                            certeza!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </div >
    )

}