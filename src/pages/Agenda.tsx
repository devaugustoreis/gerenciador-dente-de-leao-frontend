import underConstruction from "@/assets/images/under-constuction.png";
// import { useAppData } from "@/store/AppDataContext";
import SectionHeader from "@/components/shared/SectionHeader";
import AppointmentModel from "@/models/appointments/appointment.model";
import AppointmentModal from "@/components/agenda/modals/AppointmentModal";
// import Spinner from "@/components/shared/Spinner";
import { useState } from "react";

type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const Agenda = () => {
    // const { appointments, isLoading } = useAppData();
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentModel | null>(null);
    const [ modalAction, setModalAction ] = useState<ModalAction>(null);

    const openModal = (action: ModalAction, appointment?: AppointmentModel) => {
        setModalAction(action);
        setSelectedAppointment(appointment ?? null);
    };

    const closeModal = () => {
        setModalAction(null);
        setSelectedAppointment(null);
    };

    const renderModal = () => {
        if (!modalAction) return null;

        switch (modalAction) {
            case "NEW":
                return <AppointmentModal onClose={closeModal} />;

            case "EDIT":
                return <AppointmentModal appointment={selectedAppointment!} onClose={closeModal} />;

            default:
                return null;
        }
    };

    return (
        <>
            <SectionHeader title="AGENDA" buttonLabel="Agendar Consulta" onClick={() => openModal("NEW")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={underConstruction} alt="Imagem website em construção" style={{ maxWidth: "100%", marginTop: "40px" }}/>
            </div>
            { renderModal() }
        </>
    );
};

export default Agenda;
