import { useState } from "react";
import Calendar from "@/components/agenda/Calendar"
import AppointmentModel from "@/models/appointments/appointment.model";
import AppointmentModal from "@/components/agenda/modals/AppointmentModal";
import DeleteModal from "@/components/shared/DeleteModal";

export type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const Agenda = () => {
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentModel>(new AppointmentModel());
    const [ modalAction, setModalAction ] = useState<ModalAction>(null);

    const openModal = (action: ModalAction, appointment: AppointmentModel) => {
        setModalAction(action);
        setSelectedAppointment(appointment);
    };

    const closeModal = () => {
        setModalAction(null);
    };

    const renderModal = () => {
        if (!modalAction) return null;
        else if (modalAction === "DELETE") return <DeleteModal element={selectedAppointment} onClose={closeModal} />;

        return <AppointmentModal appointment={selectedAppointment} onClose={closeModal} />;
    };

    return (
        <>
            <Calendar openModal={openModal} />
            { renderModal() }
        </>
    );
};

export default Agenda;
