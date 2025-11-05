import { useEffect, useRef, useState } from 'react'
import toast from "react-hot-toast"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import styles from './Calendar.module.css';
import { useAppData } from "@/store/AppDataContext"
import { formatDate } from '@/services/utils'
import Spinner from '@/components/shared/Spinner'
import { ModalAction } from '@/pages/Agenda'
import Appointment from '@/models/appointments/appointment.model'
import { updateAppointment } from '@/services/appointmentService'


interface CalendarProps {
    openModal: (modalAction: ModalAction, appointment: Appointment) => void
}


const Calendar = ({ openModal }: CalendarProps) => {
    const { isLoading, appointments, setAppointments, refreshAppointments } = useAppData()
    const lastRangeRef = useRef<{ startDate: string, endDate: string } | null>(null);
    const debouncerRef = useRef<any | null>(null);
    const [isDebouncing, setIsDebouncing] = useState(false);


    useEffect(() => {
        return () => clearTimeout(debouncerRef.current)
    }, [])


    const handleEventClick = (clickInfo: any) => {
        const selectedAppointment = appointments.find(a => a.consultationId === clickInfo.event.id)
        if (selectedAppointment) {
            openModal("EDIT", selectedAppointment)
        }
    }


    const handleDateClick = (arg: any) => {
        const startDate = new Date(arg.date)
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // +30 min
        const newAppointment = new Appointment({ startDate, endDate })

        openModal("NEW", newAppointment)
    }


    const handleSelect = (selectionRange: any) => {
        const startDate = new Date(selectionRange.start)
        const endDate = new Date(selectionRange.end)
        const newAppointment = new Appointment({ startDate, endDate })

        openModal("NEW", newAppointment)
    }


    const handleEventDropAndResize = async (info: any) => {
        try {
            const { event } = info
            const changedAppointment = appointments.find(a => a.consultationId === event.id)
            if (!changedAppointment) return

            changedAppointment.startDate = event.start
            changedAppointment.endDate = event.end

            const responseAppointment = await toast.promise(updateAppointment(new Appointment(changedAppointment)), {
                loading: "Alterando horário da consulta...",
                success: "A consulta foi atualizada com sucesso!",
                error: "Erro ao alterar horário da consulta!",
            })

            let updatedAppointments = appointments.map(appointment => 
                (appointment.consultationId === responseAppointment.consultationId ? responseAppointment : appointment)
            )
            
            setAppointments(updatedAppointments)

        } catch (error) {
            console.error("Erro ao alterar horário da consulta", error)
            info.revert()
        }
    }


    const handleDatesSet = (arg: any) => {
        const startDate = formatDate(arg.start)
        const endDate = formatDate(arg.end)

        const lastRange = lastRangeRef.current
        if (!lastRange || lastRange.startDate !== startDate || lastRange.endDate !== endDate) {
            lastRangeRef.current = { startDate, endDate }
            setIsDebouncing(true)
            clearTimeout(debouncerRef.current)
            debouncerRef.current = window.setTimeout(function() {
                refreshAppointments(startDate, endDate)
                setIsDebouncing(false)
            }, 250)
        }
    }


    const renderTitle = (arg: any) => {
        const date = new Date(arg.date.year, arg.date.month)
        const monthName = date.toLocaleString("pt-BR", { month: "long" }).toUpperCase()
        return `${monthName} - ${arg.date.year}`
    }


    const renderEvents = () => {
        return appointments.map(appointment => ({
            id: appointment.consultationId,
            title: appointment.patientName,
            start: appointment.startDate,
            end: appointment.endDate
        }))
    }


    const renderEventContent = (arg: any) => {
        const appointment = appointments.find(appointment => appointment.consultationId === arg.event.id)
        return (
            <div className={styles.event}>
                <div className={styles.eventContent}>
                    <div className="fc-event-title fc-sticky">{arg.event.title}</div>
                    <div className="fc-event-time">{arg.timeText}</div>
                </div>
                {appointment && (
                    <div className={styles.eventDeleteStrip} onClick={(e) => {e.stopPropagation();openModal("DELETE", appointment);}} title="Excluir agendamento">
                        <svg className={styles.eventDeleteIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={{ position: 'relative' }}>
            <FullCalendar
                height="calc(100vh - 140px)"
                eventClassNames={() => styles.event}
                dayCellClassNames={() => styles.dayCell}

                locale="pt-br"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                scrollTime={new Date().toTimeString().slice(0, 8)}
                nowIndicator={true}

                allDaySlot={false}
                slotDuration='00:15:00'
                slotMinTime='06:00:00'
                slotMaxTime='22:00:00'
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}

                headerToolbar={{
                    left: 'dayGridMonth,timeGridWeek,timeGridDay',
                    center: 'title',
                    right: 'today prev,next'
                }}
                titleFormat={renderTitle}
                buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }}

                eventContent={renderEventContent}
                events={renderEvents()}

                datesSet={handleDatesSet}
                dateClick={handleDateClick}
                selectable={true}
                selectMirror={true}
                select={handleSelect}
                editable={true}
                eventDrop={handleEventDropAndResize}
                eventDurationEditable={true}
                eventResize={handleEventDropAndResize}
                eventClick={handleEventClick}
            />

            {(isLoading.appointments || isDebouncing) && (
                <div className={styles.spinnerDiv}>
                    <Spinner />
                </div>
            )}
        </div>
    )
}

export default Calendar
