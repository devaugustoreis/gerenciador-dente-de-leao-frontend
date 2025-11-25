import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import styles from "./MaterialSetModal.module.css"
import { useAppData } from "@/store/AppDataContext"
import ModalOverlay from "@/components/shared/ModalOverlay"
import CustomInput from "@/components/shared/CustomInput"
import CustomButton from "@/components/shared/CustomButton"
import { createMaterialSet, updateMaterialSet } from "@/services/materialSetService"
import MaterialSet, { MaterialSetItem } from "@/models/material-sets/material-set.model"
import MaterialItemModel from "@/models/materials/material-item.model"
import minusIcon from "@/assets/icons/minus.svg"
import plusIcon from "@/assets/icons/plus.svg"

interface MaterialSetModalProps {
    materialSet?: MaterialSet
    onClose: () => void
}

const MaterialSetModal = ({ materialSet, onClose }: MaterialSetModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!materialSet
    const { materials, materialSets, setMaterialSets } = useAppData()
    const [ formData, setFormData ] = useState<MaterialSet>(materialSet ? new MaterialSet({ ...materialSet }) : new MaterialSet())

    const config = {
        create: {
            style: "blue",
            title: "Novo Conjunto",
            confirmLabel: "Cadastrar",
            loadingToast: "Cadastrando conjunto...",
            successToast: "O conjunto foi cadastrado com sucesso!"
        },
        update: {
            style: "green",
            title: "Editar Conjunto",
            confirmLabel: "Salvar Alterações",
            loadingToast: "Salvando alterações...",
            successToast: "O conjunto foi atualizado com sucesso!"
        }
    }

    const modalConfig = isEditing ? config.update : config.create

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, label: e.target.value })
    }

    const handleAddQuantity = (material: MaterialItemModel) => {
        setFormData(prev => {
            const existingItem = prev.items.find(item => item.material.id === material.id)
            let newItems: MaterialSetItem[]
            if (existingItem) {
                newItems = prev.items.map(item =>
                    item.material.id === material.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                newItems = [...prev.items, { material, quantity: 1 }]
            }
            return { ...prev, items: newItems }
        })
    }

    const handleRemoveQuantity = (material: MaterialItemModel) => {
        setFormData(prev => {
            const existingItem = prev.items.find(item => item.material.id === material.id)
            if (!existingItem) return prev

            let newItems: MaterialSetItem[]
            if (existingItem.quantity <= 1) {
                newItems = prev.items.filter(item => item.material.id !== material.id)
            } else {
                newItems = prev.items.map(item =>
                    item.material.id === material.id ? { ...item, quantity: item.quantity - 1 } : item
                )
            }
            return { ...prev, items: newItems }
        })
    }

    const getMaterialQuantity = (materialId: string) => {
        const item = formData.items.find(i => i.material.id === materialId)
        return item ? item.quantity : 0
    }

    const handleSave = async () => {
        const action = isEditing ? updateMaterialSet(formData) : createMaterialSet(formData)
        try {
            const responseMaterialSet = await toast.promise(
                action,
                {
                    loading: modalConfig.loadingToast,
                    success: modalConfig.successToast,
                    error: "Ocorreu um erro ao salvar o conjunto!"
                }
            )

            const updatedMaterialSets = isEditing
                ? materialSets.content.map(materialSet => materialSet.id === responseMaterialSet.id ? responseMaterialSet : materialSet)
                : [...materialSets.content, responseMaterialSet]

            setMaterialSets({
                content: updatedMaterialSets,
                totalPages: materialSets.totalPages
            })
            onClose()

        } catch (error) {
            console.error("Erro ao salvar conjunto:", error)
        }
    }

    const renderMaterialsList = () => {
        return materials.content.map(material => {
            const quantity = getMaterialQuantity(material.id)
            return (
                <li key={material.id}>
                    <span className={quantity > 0 ? styles[modalConfig.style] : undefined}>{quantity} {material.name}</span>
                    <button
                        className={`${styles.actionBtn} ${styles.removeQuantityBtn} ${styles[modalConfig.style]}`}
                        onClick={() => handleRemoveQuantity(material)}
                    >
                        <img src={minusIcon} alt="Botão remover unidade material" />
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.addQuantityBtn} ${styles[modalConfig.style]}`}
                        onClick={() => handleAddQuantity(material)}
                    >
                        <img src={plusIcon} alt="Botão adicionar unidade material" />
                    </button>
                </li>
            )
        })
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <ModalOverlay onClose={onClose} />

            <div className={`${styles.modal} ${styles[modalConfig.style]}`}>
                <div className={`${styles.modalHeader} ${styles[modalConfig.style]}`}>{modalConfig.title}</div>

                <div className={styles.modalContent}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <label className={`${styles.modalLabel} ${styles[modalConfig.style]}`}>Nome do Conjunto: </label>
                        <CustomInput 
                            type="text"
                            placeholder="Nome Conjunto"
                            ref={inputRef}
                            value={formData.label} 
                            onChange={handleInputChange}
                            focusColor={isEditing ? "var(--dark-moss-green)" : "var(--deep-blue)"}
                        />
                    </div>

                    { materials.content.length > 0 && <div className={styles.divisionLine}></div> }
                    <ul className={styles.materialList}>
                        {renderMaterialsList()}
                    </ul>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor={`outline-${modalConfig.style}`} onClick={onClose} />
                        <CustomButton label={modalConfig.confirmLabel} actionColor={modalConfig.style} onClick={handleSave} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MaterialSetModal
