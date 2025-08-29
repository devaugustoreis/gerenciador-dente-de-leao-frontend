import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core/index.js'
import styles from './Calendar.module.css';
import { useAppData } from "@/store/AppDataContext"
import { ModalAction } from '@/pages/Agenda'
import Appointment from '@/models/appointments/appointment.model'


interface CalendarProps {
  openModal: (modalAction: ModalAction, appointment: Appointment) => void
}


const Calendar = ({ openModal }: CalendarProps) => {
  const { appointments } = useAppData()
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    setEvents(appointments.map(appointment => ({
      id: appointment.id,
      title: appointment.patientName,
      start: appointment.startDate,
      end: appointment.endDate
    })));
  }, [appointments]);

  function handleEventClick(clickInfo: any) {
    const selectedAppointment = appointments.find(a => a.id === clickInfo.event.id)
    if (selectedAppointment) {
      openModal("EDIT", selectedAppointment)
    }
  }

  function handleDateClick(arg: any) {
    const startDate = new Date(arg.date)
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // +30min
    const newAppointment = new Appointment({ startDate, endDate })

    openModal("NEW", newAppointment)
  }

  function handleSelect(selectionInfo: any) {
    const startDate = new Date(selectionInfo.start)
    const endDate = new Date(selectionInfo.end)
    const newAppointment = new Appointment({ startDate, endDate })

    openModal("NEW", newAppointment)
  }

  function renderEventContent(arg: any) {
    const appointment = appointments.find(appointment => appointment.id === arg.event.id)
    return (
      <div className="fc-event-main">
        <div className="fc-event-main-frame" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="fc-event-time">{arg.timeText}</div>
          <div className="fc-event-title-container" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="fc-event-title fc-sticky">{arg.event.title}</div>
            {appointment && (
              <button
                className={styles.eventDeleteBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  openModal("DELETE", appointment)
                }}
              >
                X
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <FullCalendar
      height="calc(100vh - 140px)"
      eventClassNames={() => styles.event}      
      dayCellClassNames={() => styles.dayCell} 
    
      locale="pt-br"
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      scrollTime={new Date().toTimeString().slice(0, 8)}

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
      titleFormat={(arg) => {
        const date = new Date(arg.date.year, arg.date.month) 
        const monthName = date.toLocaleString("pt-BR", { month: "long" }).toUpperCase()
        return `${monthName} - ${arg.date.year}`
      }}

      eventContent={renderEventContent}
      events={events}

      editable={false}
      dateClick={handleDateClick}
      selectable={true}
      selectMirror={true}
      select={handleSelect}
      eventClick={handleEventClick}
    />
  )
}

export default Calendar
