import { useAppData } from "@/store/AppDataContext";
import AppointmentModel from "@/models/appointments/appointment.model";
import AppointmentModal from "@/components/agenda/modals/AppointmentModal";
import Spinner from "@/components/shared/Spinner";
import { useState } from "react";
import Calendar from "@/components/agenda/Calendar"

export type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const Agenda = () => {
    const { isLoading } = useAppData();
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
        else if (modalAction === "DELETE") return <AppointmentModal appointment={selectedAppointment} onClose={closeModal} />;

        return <AppointmentModal appointment={selectedAppointment} onClose={closeModal} />;
    };

    return (
        <>
            { isLoading.appointments ? <Spinner /> : (
                <div>
                    <Calendar openModal={openModal} />
                </div>
            )}

            { renderModal() }
        </>
    );
};

export default Agenda;
