import api, { Pageable, PageableQueryParams } from "@/services/api";
import Appointment from "@/models/appointments/appointment.model";
import AppointmentType from "@/models/appointments/appointment-type.model";


const appointmentsAPI = "/entities/consultation"
const appointmentTypeAPI = "/entities/consultation-type"


export const getAppointmentTypes = async (): Promise<AppointmentType[]> => {
	const response = await api.get<Pageable<AppointmentType>>(`${appointmentTypeAPI}?page=0&size=999`);
	const appointmentTypesArray: AppointmentType[] = response.data.content
	return appointmentTypesArray.map(type => new AppointmentType(type.id, type.label));
};


export const getAppointments = async (startDate: string, endDate: string): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>(`${appointmentsAPI}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.map(appointment => new Appointment(appointment));
};


export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
	const response = await api.post<Appointment>(`${appointmentsAPI}`, appointment.toPayload());
	return response.data;
};


export const updateAppointment = async (appointment: Appointment): Promise<Appointment> => {
	const response = await api.put<Appointment>(`${appointmentsAPI}/${appointment.id}`, appointment.toPayload());
	return response.data;
};


export const deleteAppointment = async (id: string): Promise<void> => {
	await api.delete(`${appointmentsAPI}/${id}`);
};


// This endpoint only fetchs appointments which have concluded = false and endDate prior to current date.
export const getAppointmentsToConclude = async (queryParams?: PageableQueryParams): Promise<Pageable<Appointment>> => {
	const defaultParams = { page: 0, size: 999, sort: ['startDate,desc'] }
    const params = { ...defaultParams, ...(queryParams || {}) }
    const response = await api.get<Pageable<Appointment>>(`${appointmentsAPI}/concluded-false`, { params });
    return {
		content: response.data.content.map(appointment => new Appointment(appointment)),
		totalPages: response.data.totalPages
	}
};


export const concludeAppointment = async (id: string): Promise<void> => {
	await api.post(`${appointmentsAPI}/finalizar/${id}`);
};