import { useState } from "react"
import toast from "react-hot-toast"
import minusIcon from "@/assets/icons/minus.svg"
import plusIcon from "@/assets/icons/plus.svg"
import { useAppData } from "@/store/AppDataContext"
import styles from "@/components/agenda/modals/AppointmentModal.module.css"
import Spinner from "@/components/shared/Spinner"
import ModalOverlay from "@/components/shared/ModalOverlay"
import CustomButton from "@/components/shared/CustomButton"
import InputLabel from "@/components/shared/InputLabel"
import { createAppointment, updateAppointment } from "@/services/appointmentService"
import Appointment, { AppointmentMaterial } from "@/models/appointments/appointment.model"
import SelectLabel from "@/components/shared/SelectLabel"

interface AppointmentModalProps {
    appointment: Appointment
    onClose: () => void
}

const AppointmentModal = ({ appointment, onClose }: AppointmentModalProps) => {
    const isEditing = appointment.consultationId !== "Sem id"
    const { isLoading, materialSets, materials, appointmentTypes, setAppointments, appointments } = useAppData()
    const [ formData, setFormData ] = useState<Appointment>(new Appointment({ ...appointment }))

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
        setFormData(new Appointment({ ...formData, patientName: e.target.value }))
    }

    const generateTimeOptions = () => {
        const options: string[] = []

        for (let h = 6; h <= 22; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hh = String(h).padStart(2, "0")
                const mm = String(m).padStart(2, "0")
                options.push(`${hh}:${mm}`)
                if (h == 22) break
            }
        }
        return options
    }

    const timeOptions = generateTimeOptions()

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
        setFormData(prev => new Appointment({
            ...prev,
            startDate: updateDatePart(prev.startDate, newDate),
            endDate: updateDatePart(prev.endDate, newDate),
        }))
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTime = e.target.value
        setFormData(prev => new Appointment({
            ...prev,
            startDate: updateTimePart(prev.startDate, newTime),
        }))
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTime = e.target.value
        setFormData(prev => new Appointment({
            ...prev,
            endDate: updateTimePart(prev.endDate, newTime),
        }))
    }

    const handleApplyMaterialSet = (materialSet: typeof materialSets[number]) => {
        setFormData(prev => {
            const updatedMaterials = [...prev.materials];
            materialSet.items.forEach(setItem => {
                const existingItem = updatedMaterials.find(item => item.materialId === setItem.material.id)
                if (existingItem) {
                    existingItem.quantity += setItem.quantity;
                } else {
                    updatedMaterials.push({
                        materialId: setItem.material.id,
                        quantity: setItem.quantity,
                    })
                }
            })

            return new Appointment({ ...prev, materials: updatedMaterials })
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

            return new Appointment({ ...prev, materials: newMaterials });
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

            return new Appointment({ ...prev, materials: newMaterials });
        })
    }

    const getMaterialQuantity = (materialId: string) => {
        const item = formData.materials.find(i => i.materialId === materialId)
        return item ? item.quantity : 0
    }

    const handleSave = async () => {
        const action = isEditing ? updateAppointment(formData) : createAppointment(formData)

        try {
            const responseAppointment = await toast.promise(action, {
                loading: modalConfig.loadingToast,
                success: modalConfig.successToast,
                error: modalConfig.errorToast,
            })

            let updatedAppointments
            if (isEditing) {
                updatedAppointments = appointments.map(appointment => 
                    (appointment.consultationId === responseAppointment.consultationId ? new Appointment(responseAppointment) : appointment)
                )
            } else {
                updatedAppointments = [...appointments, new Appointment(responseAppointment)]
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
                            <SelectLabel
                                label="Tipo de Consulta"
                                options={appointmentTypes.map(type => ({
                                    value: type.id,
                                    label: type.label
                                }))}
                                value={formData.consultationTypeId}
                                color={modalConfig.style}
                                onChange={(e) => setFormData(new Appointment({ 
                                    ...formData, 
                                    consultationTypeId: e.target.value 
                                }))}
                            />
                        </div>

                        <div className={styles.row}>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <label className={`${styles[modalConfig.style]}`} htmlFor="appointment-date">
                                    Data da Consulta
                                </label>
                                <input
                                    id="appointment-date"
                                    type="date"
                                    className={`${styles[modalConfig.style]}`}
                                    value={formData.startDate.toLocaleDateString("en-CA")} // <-- evita UTC
                                    onChange={handleDateChange}
                                />
                            </div>
                            
                            <div style={{ display: "flex", flex: 1, gap: "2.5rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                    <label className={`${styles[modalConfig.style]}`} htmlFor="start-date">Horário de Início</label>
                                    <select
                                        id="start-date"
                                        value={formData.startDate.toTimeString().slice(0, 5)}
                                        onChange={handleStartTimeChange}
                                        className={styles[modalConfig.style]}
                                    >
                                        {timeOptions.map(t => (<option key={t} value={t}>{t}</option>))}
                                    </select>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                    <label className={`${styles[modalConfig.style]}`} htmlFor="end-date">Horário de Término</label>
                                    <select
                                        id="end-date"
                                        value={formData.endDate.toTimeString().slice(0, 5)}
                                        onChange={handleEndTimeChange}
                                        className={styles[modalConfig.style]}
                                    >
                                        {timeOptions.map(t => (<option key={t} value={t}>{t}</option>))}
                                    </select>
                                </div>
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
