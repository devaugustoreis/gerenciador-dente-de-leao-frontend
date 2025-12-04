import { useState } from "react"
import toast from "react-hot-toast"
import { useAppData } from "@/store/AppDataContext"
import { PageableQueryParams } from "@/services/api"
import { movementMaterialStock } from "@/services/materialService"
import MaterialItemModel from "@/models/materials/material-item.model"
import MovementStock, { MovementType } from "@/models/materials/movement-stock.model"
import styles from "@/components/materials/modals/MaterialModal.module.css"
import ModalOverlay from "@/components/shared/ModalOverlay"
import InputLabel from "@/components/shared/InputLabel"
import CustomButton from "@/components/shared/CustomButton"

interface AddMaterialModalProps {
    action: "add" | "remove"
    material: MaterialItemModel
    pagination: PageableQueryParams
    onClose: () => void
}

const MaterialStockModal = ({ action, material, pagination, onClose }: AddMaterialModalProps) => {
    const { refreshMaterials } = useAppData()

    const [movement, setMovement] = useState<MovementStock>(
        new MovementStock({
            materialId: material.id,
            movementType: action === "add" ? MovementType.ADDITION : MovementType.REMOVAL,
            quantity: 0
        })
    )

    const config = {
        add: {
            style: "green",
            title: "Adicionar Estoque",
            message: `Quantas unidades deseja adicionar ao estoque de ${material.name}?`,
            buttonLabel: "Adicionar",
            loadingToast: `Adicionando ${movement.quantity} unidades no estoque...`,
            getNewStock: () => material.stockQuantity + movement.quantity
        },
        remove: {
            style: "red",
            title: "Remover Estoque",
            message: `Quantas unidades deseja remover do estoque de ${material.name}?`,
            buttonLabel: "Remover",
            loadingToast: `Removendo ${movement.quantity} unidades do estoque...`,
            getNewStock: () => material.stockQuantity - movement.quantity
        }
    }[action]

    const isConfirmDisabled = movement.quantity <= 0 || (action === "remove" && movement.quantity > material.stockQuantity)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value) || 0
        if (value < 0) value = 0
        setMovement(prev => ({
            ...prev,
            quantity: value
        }))
    }

    const handleConfirm = async () => {
        try {
            await toast.promise(
                movementMaterialStock(movement),
                {
                    loading: config.loadingToast,
                    success: "O estoque foi atualizado com sucesso!",
                    error: "Ocorreu um erro ao atualizar o estoque!"
                }
            )
            onClose()
            const queryParams = { ...pagination, page: pagination.page - 1 }
            refreshMaterials(queryParams)
            
        } catch (error) {
            console.error("Erro ao movimentar estoque:", error)
        }
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={`${styles.modal} ${styles[config.style]}`}>
                <div className={`${styles.modalHeader} ${styles[config.style]}`}>{config.title}</div>

                <div className={styles.modalContent}>
                    <InputLabel
                        label={config.message}
                        labelAlignment="center"
                        color={config.style}
                        inputType="number"
                        inputValue={movement.quantity}
                        onChange={handleInputChange}
                    />

                    <h1 className={styles.stockQuantity}>
                        {material.stockQuantity} -&gt; <span className={styles[config.style]}>{config.getNewStock()}</span>
                    </h1>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor={`outline-${config.style}`} onClick={onClose} />
                        <CustomButton label={config.buttonLabel} actionColor={config.style} disabled={isConfirmDisabled} onClick={handleConfirm} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MaterialStockModal
