import styles from "./MaterialSet.module.css"
import { MaterialSet as MaterialSetModel } from "../../models/material-set.model"
import CustomButton from "../shared/CustomButton"


interface MaterialSetProps {
    materialSet: MaterialSetModel
    isOpen: boolean
    onToggle: (id: number) => void
}


const MaterialSet = ({ materialSet, isOpen, onToggle }: MaterialSetProps) => {
    const materialSetContainerStyles = isOpen ? { border: '2px solid var(--moss-green)' } : {};
    const headerStyles = isOpen ? { borderBottom: '1px solid var(--gray)' } : { borderRadius: '8px' };

    const renderSetMaterials = () => {
        return materialSet.materials.map(material => (
            <li><span>{material.quantity} {material.name}</span></li>
        ))
    }


    return (
        <div className={styles.materialSetContainer} style={materialSetContainerStyles} onClick={() => onToggle(materialSet.id)}>
            <div className={styles.materialSetHeader} style={headerStyles}>{ materialSet.name }</div>
            
            <div className={`${styles.materialSetBody} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.bodyWrapper}>
                    <div className={styles.divisionLine}></div>
                    <ul className={styles.materialList}>
                        { renderSetMaterials() }
                    </ul>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Excluir" actionColor="red" />
                        <CustomButton label="Editar" actionColor="green" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaterialSet