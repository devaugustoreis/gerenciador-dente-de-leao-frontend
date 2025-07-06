import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import styles from "@/components/agenda/modals/AppointmentModal.module.css"
import ModalOverlay from "@/components/shared/ModalOverlay"
import CustomButton from "@/components/shared/CustomButton"
import { createAppointment, updateAppointment } from "@/services/appointmentService"
import Appointment, { AppointmentMaterial } from "@/models/appointments/appointment.model"
import minusIcon from "@/assets/icons/minus.svg"
import plusIcon from "@/assets/icons/plus.svg"
import InputLabel from "@/components/shared/InputLabel"
import { useAppData } from "@/store/AppDataContext"
import Spinner from "@/components/shared/Spinner"

interface AppointmentModalProps {
    appointment?: Appointment
    onClose: () => void
}

const AppointmentModal = ({ appointment, onClose }: AppointmentModalProps) => {
    const isEditing = !!appointment
    const { isLoading, materialSets, materials, setAppointments, appointments } = useAppData()
    const [formData, setFormData] = useState<Appointment>(appointment ? new Appointment({ ...appointment }) : new Appointment())

    const config = {
        create: {
            style: "blue",
            title: "Nova Consulta",
            confirmLabel: "Agendar",
            loadingToast: "Agendando consulta...",
            successToast: "A consulta foi agendada com sucesso!",
            errorToast: "Erro ao agendar consulta!",
        },
        update: {
            style: "green",
            title: "Editar Consulta",
            confirmLabel: "Salvar Alterações",
            loadingToast: "Editando consulta...",
            successToast: "A consulta foi atualizada com sucesso!",
            errorToast: "Erro ao atualizar consulta",
        },
    }

    const modalConfig = isEditing ? config.update : config.create

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, patientName: e.target.value })
    }

    const updateDatePart = (date: Date, newDateString: string): Date => {
        const [year, month, day] = newDateString.split("-").map(Number)
        return new Date(year, month - 1, day, date.getHours(), date.getMinutes())
    }

    const updateTimePart = (date: Date, newTimeString: string): Date => {
        const [hours, minutes] = newTimeString.split(":").map(Number)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        setFormData(prev => ({
            ...prev,
            startDate: updateDatePart(prev.startDate, newDate),
            endDate: updateDatePart(prev.endDate, newDate),
        }))
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setFormData(prev => ({
            ...prev,
            startDate: updateTimePart(prev.startDate, newTime),
        }))
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setFormData(prev => ({
            ...prev,
            endDate: updateTimePart(prev.endDate, newTime),
        }))
    }

    const handleApplyMaterialSet = (materialSet: typeof materialSets[number]) => {
        setFormData(prev => {
            const updatedMaterials = [...prev.materials]

            materialSet.items.forEach(setItem => {
                const existingItem = updatedMaterials.find(item => item.materialId === setItem.material.id)
                if (existingItem) {
                    existingItem.quantity += setItem.quantity
                } else {
                    updatedMaterials.push({
                        materialId: setItem.material.id,
                        quantity: setItem.quantity,
                    })
                }
            })

            return { ...prev, materials: updatedMaterials }
        })
    }

    const handleAddQuantity = (material: typeof materials[number]) => {
        setFormData(prev => {
            const existingItem = prev.materials.find(item => item.materialId === material.id)
            let newMaterials: AppointmentMaterial[]

            if (existingItem) {
                newMaterials = prev.materials.map(item =>
                    item.materialId === material.id ? { ...item, quantity: item.quantity + 1 } : item,
                )
            } else {
                newMaterials = [...prev.materials, { materialId: material.id, quantity: 1 }]
            }

            return { ...prev, materials: newMaterials }
        })
    }

    const handleRemoveQuantity = (material: typeof materials[number]) => {
        setFormData(prev => {
            const existingItem = prev.materials.find(item => item.materialId === material.id)
            if (!existingItem) return prev

            let newMaterials: AppointmentMaterial[]
            if (existingItem.quantity <= 1) {
                newMaterials = prev.materials.filter(item => item.materialId !== material.id)
            } else {
                newMaterials = prev.materials.map(item =>
                    item.materialId === material.id ? { ...item, quantity: item.quantity - 1 } : item,
                )
            }

            return { ...prev, materials: newMaterials }
        })
    }

    const getMaterialQuantity = (materialId: string) => {
        const item = formData.materials.find(i => i.materialId === materialId)
        return item ? item.quantity : 0
    }

    const handleSave = async () => {
        const action = isEditing ? updateAppointment(formData) : createAppointment(formData)

        try {
            await toast.promise(action, {
                loading: modalConfig.loadingToast,
                success: modalConfig.successToast,
                error: modalConfig.errorToast,
            })

            let updatedAppointments: typeof appointments
            if (isEditing) {
                updatedAppointments = appointments.map(app => (app.id === formData.id ? formData : app))
            } else {
                updatedAppointments = [...appointments, formData]
            }
            setAppointments(updatedAppointments)
            onClose()

        } catch (error) {
            console.error("Erro ao salvar consulta:", error)
        }
    }

    const renderMaterialSets = () => {
        return materialSets.map(materialSet => (
            <div
                key={materialSet.id}
                className={`${styles.materialSet} ${styles[modalConfig.style]}`}
                onClick={() => handleApplyMaterialSet(materialSet)}
            >
                {materialSet.label}
            </div>
        ))
    }

    const renderMaterialsList = () => {
        return materials.map(material => {
            const quantity = getMaterialQuantity(material.id)

            return (
                <li key={material.id}>
                    <span className={quantity > 0 ? styles[modalConfig.style] : undefined}>
                        {quantity} {material.name}
                    </span>
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
                    <div className={styles.inputContainer}>
                        <div className={styles.row}>
                            <InputLabel label="Nome do Paciente" inputValue={formData.patientName} onChange={handleInputChange} color={modalConfig.style} />
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <label className={`${styles[modalConfig.style]}`} htmlFor="appointment-date">
                                    Data da Consulta
                                </label>
                                <input
                                    id="appointment-date"
                                    type="date"
                                    className={`${styles[modalConfig.style]}`}
                                    value={formData.startDate.toISOString().split("T")[0]}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <label className={`${styles[modalConfig.style]}`} htmlFor="start-date">
                                    Horário de Início
                                </label>
                                <input
                                    id="start-date"
                                    type="time"
                                    step="900"
                                    min="05:00"
                                    max="22:00"
                                    value={formData.startDate.toTimeString().slice(0, 5)}
                                    onChange={handleStartTimeChange}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <label className={`${styles[modalConfig.style]}`} htmlFor="end-date">
                                    Horário de Término
                                </label>
                                <input
                                    id="end-date"
                                    type="time"
                                    step="900"
                                    value={formData.endDate.toTimeString().slice(0, 5)}
                                    onChange={handleEndTimeChange}
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className={`${styles.modalSubtitle} ${styles[modalConfig.style]}`}>Lista de Materiais</h3>

                    { !isLoading.materialSets && !isLoading.materials ? (
                    <>
                        <div className={styles.materialSetContainer}>{renderMaterialSets()}</div>
                        <div className={styles.divisionLine}></div>
                        <ul className={styles.materialList}>{renderMaterialsList()}</ul>
                    </>
                    ) : ( <Spinner /> )}

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor={`outline-${modalConfig.style}`} onClick={onClose} />
                        <CustomButton label={modalConfig.confirmLabel} actionColor={modalConfig.style} onClick={handleSave} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AppointmentModal
