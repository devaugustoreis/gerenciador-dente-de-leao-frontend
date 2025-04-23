import { MaterialItem as MaterialItemModel } from "../../models/material-item.model"
import styles from "./MaterialItem.module.css"
import plusIcon from "../../assets/icons/plus.svg"
import editIcon from "../../assets/icons/pencil.png"
import closeIcon from "../../assets/icons/close.png"

interface MaterialItemProps {
    material: MaterialItemModel
}

const MaterialItem = ({ material }: MaterialItemProps) => {
    const imageSrc = new URL(`../../assets/images/${material.imgPath}`, import.meta.url).href;

    return (
        <div className={styles.materialItem}>
            <img src={imageSrc} alt={`Imagem de ${ material.name }`} className={styles.materialImage} />

            <div className={styles.materialData}>
                <h3 className={styles.materialName}> { material.name }</h3>
                <h5 className={styles.materialStockQuantity}> <b>{ material.stockQuantity }</b> unidades restantes</h5>
                <p>Agendado: { material.scheduledQuantity } unidades</p>
                <p>Término Previsto: {new Date(material.endPrevision).toLocaleDateString()}</p>

                <div className={styles.actionsContainer}>
                    <button className={`${styles.actionBtn} ${styles.closeBtn}`}><img src={closeIcon} alt="Botão fechar" /></button>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`}><img src={editIcon} alt="Botão editar" /></button>
                    <button className={`${styles.actionBtn} ${styles.addBtn}`}><img src={plusIcon} alt="Botão adicionar" /></button>
                </div>
            </div>
        </div>
    )
}

export default MaterialItem