import MaterialItem from "../materials/material-item.model";

export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    CONCLUDED = "CONCLUDED",
    CANCELED = "CANCELED"
}

export interface AppointmentMaterial {
    id: string;
    quantity: number;
    material: MaterialItem
}

export default class Appointment {
    id: string;
    patientName: string;
    consultationTypeId: string;
    startDate: Date;
    endDate: Date;
    materials: AppointmentMaterial[];
    status: AppointmentStatus;

    constructor(data: Partial<Appointment> = {}) {
        this.id = data.id ?? "";
        this.patientName = data.patientName ?? "";
        this.consultationTypeId = data.consultationTypeId ?? "313a95ce-af15-55d3-9403-eed37e8d2bef";
        this.startDate = data.startDate ? new Date(data.startDate) : new Date();
        this.endDate = data.endDate ? new Date(data.endDate) : new Date(this.startDate.getTime() + 30 * 60 * 1000); 
        this.materials = data.materials ?? [];
        this.status = data.status ?? AppointmentStatus.SCHEDULED;
    }

    private formatLocalDate(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    toPayload() {
        return {
            id: this.id,
            patientName: this.patientName,
            consultationTypeId: this.consultationTypeId,
            startDate: this.formatLocalDate(this.startDate),
            endDate: this.formatLocalDate(this.endDate),
            materials: this.materials,
            status: this.status
        };
    }
}