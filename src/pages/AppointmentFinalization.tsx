import { useEffect, useState } from "react";
import { useAppData } from "@/store/AppDataContext";
import AppointmentModel, { AppointmentStatus } from "@/models/appointments/appointment.model";
import SectionHeader from "@/components/shared/SectionHeader";
import CustomFilter, { FilterOption } from "@/components/shared/CustomFilter";
import Spinner from "@/components/shared/Spinner";
import Appointment from "@/components/shared/CustomAccordion";
import AppointmentModal from "@/components/appointments/modals/AppointmentModal";
import ConcludeAppointmentModal from "@/components/appointments/modals/ConcludeAppointmentModal";
import DeleteModal from "@/components/shared/modals/DeleteModal";
import CustomPagination from "@/components/shared/CustomPagination";


type ModalAction = "EDIT" | "CONCLUDE" | "DELETE" | null;

const AppointmentFinalization = () => {
    const { isLoading, appointmentsToConclude, refreshMaterials, refreshMaterialSets, refreshAppointmentsToConclude } = useAppData()
    const [ pagination, setPagination ] = useState({
        page: 1,
        // 60px = Topbar | 80px = Section padding | 84px = Section Header + margin | 34px = Filter | 20px = Section content margin | 64px = Pagination + margin 
        // 76px = Concluded Appointment Accordion + gap between each 
        size: Math.round((window.innerHeight - 60 - 80 - 84 - 34 - 20 - 64) / 76),
        sort: ["startDate,desc"]
    })
    const [ openSetId, setOpenSetId ] = useState<string | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentModel>(new AppointmentModel())

    const filterOptions: FilterOption[] = [
        { id: "sort-start-date", label: "Data e Hora", value: "startDate" },
        { id: "sort-pacient-name", label: "Nome do Paciente", value: "patientName" },
    ]

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        refreshMaterials(undefined, signal);
        refreshMaterialSets(undefined, signal);

        const queryParams = { ...pagination, page: pagination.page - 1 }
        refreshAppointmentsToConclude(queryParams)

        return () => abortController.abort();
    }, [pagination]);

    const handleFilterChange = (filterValue: string) => {
        setPagination(prev => ({
            ...prev,
            page: 1,
            sort: [filterValue]
        }))
    }

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
            <CustomFilter options={filterOptions} selectedFilter={pagination.sort[0]} onFilterChange={handleFilterChange} />

            { isLoading.appointmentsToConclude ? <Spinner /> : (
                <div className="sectionContentContainer flexColumn">
                    {renderAppointments()}
                </div>
            )}

            <CustomPagination count={appointmentsToConclude.totalPages} page={pagination.page} onChange={handlePageChange} />

            { renderModal() }
        </>
    )
}

export default AppointmentFinalization