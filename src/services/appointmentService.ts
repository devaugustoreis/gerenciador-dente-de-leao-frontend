import api from "@/services/api";
import Appointment from "@/models/appointments/appointment.model";


const appointmentsAPI = "/entities/consultation"


export const getAppointments = async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>(appointmentsAPI);
    return response.data.map(appointment => new Appointment(appointment));
};


export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
	const response = await api.post<Appointment>(`${appointmentsAPI}/create`, appointment);
	return response.data;
};


export const updateAppointment = async (appointment: Appointment): Promise<Appointment> => {
	const response = await api.put<Appointment>(appointmentsAPI, appointment);
	return response.data;
};


export const deleteAppointment = async (id: string): Promise<void> => {
	await api.delete(`${appointmentsAPI}/${id}`);
};