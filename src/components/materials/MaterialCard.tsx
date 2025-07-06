import MaterialItemModel from "@/models/materials/material-item.model"
import styles from "./MaterialCard.module.css"
import minusIcon from "@/assets/icons/minus.svg"
import plusIcon from "@/assets/icons/plus.svg"
import closeIcon from "@/assets/icons/close.png"


interface MaterialItemProps {
    material: MaterialItemModel
    onDelete: () => void
    onEdit: () => void
    onRemoveStock: () => void
    onAddStock: () => void
}


const MaterialCard = ({ material, onDelete, onEdit, onRemoveStock, onAddStock }: MaterialItemProps) => {
    const imageSrc = new URL(`../../assets/images/${material.imgPath}`, import.meta.url).href;
    
    return (
        <div className={styles.materialItem} onClick={() => onEdit()}>
            <img src={imageSrc} alt={`Imagem de ${ material.name }`} className={styles.materialImage} />

            <div className={styles.materialData}>
                <h3 className={styles.materialName} title={ material.name }> { material.name }</h3>
                <h5 className={styles.materialStockQuantity}> <b>{ material.stockQuantity }</b> unidades restantes</h5>
                <p>Agendado: { material.scheduledQuantity } unidades</p>
                <p>Término Previsto: {new Date(material.expectedEndDate).toLocaleDateString()}</p>

                <div className={styles.actionsContainer}>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={(e) => {e.stopPropagation(); onDelete() }}>
                        <img src={ closeIcon } alt="Botão fechar" />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.removeStockBtn}`} onClick={(e) => {e.stopPropagation(); onRemoveStock() }}>
                        <img src={ minusIcon } alt="Botão remover estoque" />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.addStockBtn}`} onClick={(e) => {e.stopPropagation(); onAddStock() }}>
                        <img src={ plusIcon } alt="Botão adicionar estoque" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MaterialCard