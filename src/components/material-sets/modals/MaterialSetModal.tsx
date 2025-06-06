import { useEffect, useState } from 'react'
import styles from './MaterialSetModal.module.css'
import ModalOverlay from '@/components/shared/ModalOverlay'
import CustomButton from '@/components/shared/CustomButton'
import { createMaterialSet, updateMaterialSet } from '@/services/materialSetService'
import { getMaterials } from "@/services/materialService"
import MaterialSet, { MaterialSetItem } from '@/models/material-sets/material-set.model'
import MaterialItemModel from '@/models/materials/material-item.model'
import CustomInput from '@/components/shared/CustomInput'
import minusIcon from "@/assets/icons/minus.svg"
import plusIcon from "@/assets/icons/plus.svg"


interface MaterialSetModalProps {
    materialSet?: MaterialSet
    onSave: () => void
    onClose: () => void
}


const MaterialSetModal = ({ materialSet, onSave, onClose }: MaterialSetModalProps) => {
    const isEditing = !!materialSet
    const [ loadingMaterials, setLoadingMaterials ] = useState(true);
    const [ materialsList, setMaterialsList ] = useState<MaterialItemModel[]>([]);
    const [ formData, setFormData ] = useState<MaterialSet>( materialSet ? new MaterialSet({ ...materialSet }) : new MaterialSet() )


    const config = {
        create: {
            style: 'blue',
            title: 'Novo Conjunto',
            confirmLabel: 'Cadastrar',
        },
        update: {
            style: 'green',
            title: 'Editar Conjunto',
            confirmLabel: 'Salvar Alterações',
        }
    }

    const modalConfig = isEditing ? config.update : config.create


    const fetchMaterials = async () => {
        try {
            const data = await getMaterials();
            setMaterialsList(data);
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
        } finally {
            setLoadingMaterials(false);
        }
    }

    useEffect(() => {
        fetchMaterials();
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, label: e.target.value });
    }

    const handleAddQuantity = (material: MaterialItemModel) => {
        setFormData((prev) => {
            const existingItem = prev.items.find(item => item.material.id === material.id);
            let newItems: MaterialSetItem[];
            if (existingItem) {
                newItems = prev.items.map(item =>
                    item.material.id === material.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...prev.items, { material, quantity: 1 }];
            }
            return { ...prev, items: newItems };
        });
    }

    const handleRemoveQuantity = (material: MaterialItemModel) => {
        setFormData((prev) => {
            const existingItem = prev.items.find(item => item.material.id === material.id);
            if (!existingItem) return prev;

            let newItems: MaterialSetItem[];
            if (existingItem.quantity <= 1) {
                newItems = prev.items.filter(item => item.material.id !== material.id);
            } else {
                newItems = prev.items.map(item =>
                    item.material.id === material.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            return { ...prev, items: newItems };
        });
    }

    const getMaterialQuantity = (materialId: string) => {
        const item = formData.items.find(i => i.material.id === materialId);
        return item ? item.quantity : 0;
    }

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateMaterialSet(formData);
            } else {
                await createMaterialSet(formData);
            }
            onSave();
        } catch (error) {
            console.error("Erro ao salvar material:", error);
        }
    }

    const renderMaterialsList = () => {
        if (loadingMaterials) return <p>Carregando...</p>;

        return materialsList.map(material => {
            const quantity = getMaterialQuantity(material.id);

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

    return (
        <>
            <ModalOverlay onClose={onClose} />

            <div className={`${styles.modal} ${styles[modalConfig.style]}`}>
                <div className={`${styles.modalHeader} ${styles[modalConfig.style]}`}>{modalConfig.title}</div>
                
                <div className={styles.modalContent}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <label className={`${styles.modalLabel} ${styles[modalConfig.style]}`}>Nome do Conjunto: </label>
                        <CustomInput type="text" placeholder="Consulta Básica" value={formData.label} onChange={handleInputChange} />
                    </div>

                    {!loadingMaterials && <div className={styles.divisionLine}></div>}
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
