import styles from "./MaterialSet.module.css"
import MaterialSetModel from "@/models/material-sets/material-set.model"
import CustomButton from "@/components/shared/CustomButton"


interface MaterialSetProps {
    materialSet: MaterialSetModel
    isOpen: boolean
    onToggle: (id: string) => void
    onEdit: () => void
    onDelete: () => void
}


const MaterialSet = ({ materialSet, isOpen, onToggle, onEdit, onDelete }: MaterialSetProps) => {
    const materialSetContainerStyles = isOpen ? { border: '2px solid var(--moss-green)' } : {};
    const headerStyles = isOpen ? { borderBottom: '1px solid var(--gray)' } : { borderRadius: '8px' };

    const renderSetMaterials = () => {
        return materialSet.items.map(item => (
            <li key={item.material.id}><span>{item.quantity} {item.material.name}</span></li>
        ));
    }


    return (
        <div className={styles.materialSetContainer} style={materialSetContainerStyles} onClick={() => onToggle(materialSet.id)}>
            <div className={styles.materialSetHeader} style={headerStyles}>{ materialSet.label }</div>
            
            <div className={`${styles.materialSetBody} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.bodyWrapper}>
                    <div className={styles.divisionLine}></div>
                    <ul className={styles.materialList}>
                        { renderSetMaterials() }
                    </ul>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Excluir" actionColor="red" onClick={(e) => {e.stopPropagation(); onDelete() }} />
                        <CustomButton label="Editar" actionColor="green" onClick={(e) => {e.stopPropagation(); onEdit() }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaterialSet