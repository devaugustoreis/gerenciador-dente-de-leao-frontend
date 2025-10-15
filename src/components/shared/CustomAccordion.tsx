import styles from "@/components/shared/CustomAccordion.module.css"
import { useAppData } from "@/store/AppDataContext"; 
import AppointmentModel from "@/models/appointments/appointment.model";
import MaterialSetModel from "@/models/material-sets/material-set.model"
import CustomButton from "@/components/shared/CustomButton"


interface AccordionProps {
    element: MaterialSetModel | AppointmentModel
    isOpen: boolean
    onToggle: (id: string) => void
    onEdit: () => void
    onDelete: () => void
    onConclude?: () => void
}


const CustomAccordion = ({ element, isOpen, onToggle, onEdit, onDelete, onConclude }: AccordionProps) => {
    const { materials } = useAppData();
    const materialSetContainerStyles = isOpen ? { border: '2px solid var(--moss-green)' } : {};
    const headerStyles = isOpen ? { borderBottom: '1px solid var(--gray)' } : { borderRadius: '8px' };

    let accordionId: string;
    let accordionTitle: string = "";

    if (element instanceof MaterialSetModel) {
        accordionId = element.id;
        accordionTitle = element.label;

    } else if (element instanceof AppointmentModel) {
        const appointmentDate = element.startDate.toLocaleDateString();
        const appointmentStartTime = element.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const appointmentEndTime = element.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        accordionId = element.consultationId;
        accordionTitle = `${element.patientName} [ ${appointmentStartTime} - ${appointmentEndTime} ] - ${appointmentDate}`;
    }

    const renderMaterials = () => {
        if (element instanceof AppointmentModel) {
            return element.materials.map(material => {
                const materialName = materials.find(m => m.id === material.materialId)?.name;
                return <li key={material.materialId}><span>{material.quantity} {materialName}</span></li>;
            });

        } else if (element instanceof MaterialSetModel) {
            return element.items.map(item => (
                <li key={item.material.id}><span>{item.quantity} {item.material.name}</span></li>
            ));
        }
    }


    return (
        <div className={styles.materialSetContainer} style={materialSetContainerStyles} onClick={() => onToggle(accordionId)}>
            <div className={styles.materialSetHeader} style={headerStyles}>{ accordionTitle }</div>

            <div className={`${styles.materialSetBody} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.bodyWrapper}>
                    <div className={styles.divisionLine}></div>
                    <ul className={styles.materialList}>
                        { renderMaterials() }
                    </ul>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Excluir" actionColor="red" onClick={(e) => {e.stopPropagation(); onDelete() }} />
                        <div style={{display: 'flex', gap: "16px"}}>
                            <CustomButton label="Editar" actionColor="outline-green" onClick={(e) => {e.stopPropagation(); onEdit() }} />
                            { element instanceof AppointmentModel && onConclude &&
                                <CustomButton label="Finalizar" actionColor="green" onClick={(e) => {e.stopPropagation(); onConclude() }} />
                            } 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomAccordion