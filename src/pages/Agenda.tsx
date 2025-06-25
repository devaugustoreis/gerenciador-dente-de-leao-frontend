import { useEffect, useState } from "react";
import { getAppointments } from "@/services/appointmentService"
import SectionHeader from "@/components/shared/SectionHeader"
import AppointmentModel from "@/models/appointments/appointment.model";
import AppointmentModal from "@/components/agenda/modals/AppointmentModal";

type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const Agenda = () => {
    const [ loading, setLoading ] = useState(true);
    const [ appointments, setAppointments ] = useState<AppointmentModel[]>([]);
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentModel | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null);

    const fetchAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data);
            console.log(data)
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, []);

    const openModal = (action: ModalAction, appointment?: AppointmentModel) => {
        setModalAction(action);
        setSelectedAppointment(appointment ?? null);
    }

    const closeModal = () => {
        setModalAction(null);
        setSelectedAppointment(null);
    }

    const onActionComplete = () => {
        setLoading(true)
        fetchAppointments();
        closeModal();
    }

    const renderModal = () => {
        if (!modalAction) return null;

        switch (modalAction) {
            case "NEW":
                return <AppointmentModal onSave={onActionComplete} onClose={closeModal} />

            case "EDIT":
                return <AppointmentModal appointment={selectedAppointment!} onSave={onActionComplete} onClose={closeModal} />

            // case "DELETE":
            //     return <DeleteAppointmentModal appointment={selectedMaterialSet!} onDelete={onActionComplete} onClose={closeModal} />

            default:
                return null;
        }
    }

    return (
        <>
            <SectionHeader title="AGENDA" buttonLabel="Agendar Consulta" onClick={() => openModal("NEW")} />
            <p>Você acessou a agenda.</p>
            { renderModal() }
        </>
    )
}

export default Agenda