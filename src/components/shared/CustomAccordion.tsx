import styles from "@/components/shared/CustomAccordion.module.css"
import AppointmentModel from "@/models/appointments/appointment.model";
import MaterialSetModel from "@/models/material-sets/material-set.model"
import CustomButton from "@/components/shared/forms/CustomButton"


interface AccordionProps {
    element: MaterialSetModel | AppointmentModel
    isOpen: boolean
    onToggle: (id: string) => void
    onEdit: () => void
    onDelete: () => void
    onConclude?: () => void
}


const CustomAccordion = ({ element, isOpen, onToggle, onEdit, onDelete, onConclude }: AccordionProps) => {
    const accordionStyles = isOpen ? { border: '2px solid var(--moss-green)' } : {};
    const headerStyles = isOpen ? { borderBottom: '1px solid var(--gray)' } : { borderRadius: '8px' };

    let accordionId: string = element.id;
    let appointmentDate: string = "";
    let appointmentStartTime: string = "";
    let appointmentEndTime: string = "";

    if (element instanceof AppointmentModel) {
        appointmentDate = element.startDate.toLocaleDateString();
        appointmentStartTime = element.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        appointmentEndTime = element.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const renderMaterials = () => {
        if (element instanceof MaterialSetModel) {
            if (element.items.length === 0) return <span>Não há materiais vinculados ao conjunto.</span>
            return element.items.map(item => (
                <li key={item.material.id}><span>{item.quantity} {item.material.name}</span></li>
            ));
        
        } else if (element instanceof AppointmentModel) {
            if (element.materials.length === 0) return <span>Não há materiais vinculados à consulta.</span>
            return element.materials.map(item => (
                <li key={item.id}><span>{item.quantity} {item.name}</span></li>
            ));

        } 
    }


    return (
        <div className={styles.accordionContainer} style={accordionStyles} onClick={() => onToggle(accordionId)}>
            { element instanceof MaterialSetModel && <div className={styles.accordionHeader} style={headerStyles}>{ element.label }</div> }
            { element instanceof AppointmentModel && 
                <div style={{ display: "flex" }}>
                    <div className={styles.appointmentDate}>{appointmentDate}</div>
                    <div className={styles.appointmentHour}>{`${appointmentStartTime} ${appointmentEndTime}`}</div>
                    <p className={styles.accordionHeader} style={headerStyles}>{ element.patientName }</p> 
                </div>
            }

            <div className={`${styles.accordionBody} ${isOpen ? styles.open : styles.closed}`}>
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