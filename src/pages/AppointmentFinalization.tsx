import { useEffect, useState } from "react";
import { useAppData } from "@/store/AppDataContext";
import AppointmentModel from "@/models/appointments/appointment.model";
import SectionHeader from "@/components/shared/SectionHeader";
import Spinner from "@/components/shared/Spinner";
import Appointment from "@/components/shared/CustomAccordion";
import AppointmentModal from "@/components/agenda/modals/AppointmentModal";
import ConcludeAppointmentModal from "@/components/agenda/modals/ConcludeAppointmentModal";
import DeleteModal from "@/components/shared/DeleteModal";


const appointmentsContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "calc(100vh - 184px)",
    padding: "0 2px 20px 2px",
    overflowY: "auto",
}

type ModalAction = "EDIT" | "CONCLUDE" | "DELETE" | null;

const AppointmentFinalization = () => {
    const { isLoading, refreshAppointments, appointments } = useAppData();
    const [ openSetId, setOpenSetId ] = useState<string | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null);
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentModel>(new AppointmentModel());

    useEffect(() => {
        refreshAppointments();
    }, []);


    const openModal = (action: ModalAction, appointment?: AppointmentModel) => {
        setModalAction(action)
        setSelectedAppointment(appointment ?? new AppointmentModel())
    }

    const closeModal = () => {
        setModalAction(null)
        setSelectedAppointment(new AppointmentModel())
    }

    const handleToggle = (id: string) => {
        setOpenSetId(previousId => (previousId === id ? null : id))
    }

    const renderModal = () => {
        if (!modalAction) return null;
        else if (modalAction === "DELETE") return <DeleteModal type="appointment" element={selectedAppointment} onClose={closeModal} />;
        else if (modalAction === "CONCLUDE") return <ConcludeAppointmentModal element={selectedAppointment} onClose={closeModal} />;

        return <AppointmentModal appointment={selectedAppointment} onClose={closeModal} />;
    };


    const renderAppointments = () =>
        appointments.map(appointment => {
            if (!appointment.concluded) return (
                <Appointment
                    key={appointment.consultationId}
                    element={appointment}
                    isOpen={openSetId === appointment.consultationId}
                    onToggle={handleToggle}
                    onEdit={() => openModal("EDIT", appointment)}
                    onDelete={() => openModal("DELETE", appointment)}
                    onConclude={() => openModal("CONCLUDE", appointment)}
                />
            )  
        });

        
    return (
        <>
            <SectionHeader title="FINALIZAR CONSULTAS" />

            { isLoading.appointments ? <Spinner /> : (
                <div style={appointmentsContainerStyle}>
                    {renderAppointments()}
                </div>
            )}

            {renderModal()}
        </>
    )
}

export default AppointmentFinalization