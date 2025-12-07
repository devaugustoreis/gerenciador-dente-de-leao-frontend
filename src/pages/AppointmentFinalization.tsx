import { useEffect, useState } from "react";
import { Pagination, Stack } from "@mui/material";
import { useAppData } from "@/store/AppDataContext";
import AppointmentModel, { AppointmentStatus } from "@/models/appointments/appointment.model";
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
    maxHeight: "calc(100vh - 288px)",
    padding: "0 2px 6px 2px",
    overflowY: "auto",
}

type ModalAction = "EDIT" | "CONCLUDE" | "DELETE" | null;

const AppointmentFinalization = () => {
    const { isLoading, appointmentsToConclude, refreshMaterials, refreshMaterialSets, refreshAppointmentsToConclude } = useAppData()
    const [ pagination, setPagination ] = useState({
        page: 1,
        // 60px = Topbar | 80px = Section padding on top and bottom. | 64px = Section Header | 20px = Section content margin | 64px = Pagination + margin 
        // 76px = Concluded Appointment Accordion + gap between each 
        size: Math.round((window.innerHeight - 60 - 80 - 64 - 20 - 64) / 76),
        sort: ["startDate,desc"]
    })
    const [ openSetId, setOpenSetId ] = useState<string | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentModel>(new AppointmentModel())

    useEffect(() => {
        refreshMaterials()
        refreshMaterialSets()
        const queryParams = { ...pagination, page: pagination.page - 1 }
        refreshAppointmentsToConclude(queryParams)
    }, [pagination]);

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
        else if (modalAction === "DELETE") return <DeleteModal element={selectedAppointment} pagination={pagination} onClose={closeModal} />
        else if (modalAction === "CONCLUDE") return <ConcludeAppointmentModal appointmentToConclude={selectedAppointment} pagination={pagination} onClose={closeModal} />

        return <AppointmentModal appointment={selectedAppointment} onClose={closeModal} />
    }


    const renderAppointments = () => appointmentsToConclude.content.map(appointment => {
        if (appointment.status === AppointmentStatus.SCHEDULED) return (
            <Appointment
                key={appointment.id}
                element={appointment}
                isOpen={openSetId === appointment.id}
                onToggle={() => handleToggle(appointment.id)}
                onEdit={() => openModal("EDIT", appointment)}
                onDelete={() => openModal("DELETE", appointment)}
                onConclude={() => openModal("CONCLUDE", appointment)}
            />
        )
    })

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, page }));
    }
       
    return (
        <>
            <SectionHeader title="FINALIZAR CONSULTAS" />

            { isLoading.appointmentsToConclude ? <Spinner /> : (
                <div style={appointmentsContainerStyle}>
                    {renderAppointments()}
                </div>
            )}

            <Stack spacing={2} alignItems="center" sx={{ mt: 3, position: "absolute", bottom: 0, width: "100%" }}>
                <Pagination
                    count={appointmentsToConclude.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontSize: '1.25rem',
                            minWidth: '40px',
                            height: '40px',
                            padding: '0 8px'
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            backgroundColor: '#21618c',
                            color: '#ffffff'
                        },
                        '& .MuiPaginationItem-root.Mui-selected:hover': {
                            backgroundColor: '#5dade2'
                        }
                    }}
                />
            </Stack>

            { renderModal() }
        </>
    )
}

export default AppointmentFinalization