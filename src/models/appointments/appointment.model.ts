export interface AppointmentMaterial {
    materialId: string;
    quantity: number;
}

export default class Appointment {
    id: string;
    patientName: string;
    consultationTypeId: string;
    startDate: Date;
    endDate: Date;
    materials: AppointmentMaterial[];

    constructor(data: Partial<Appointment> = {}) {
        this.id = data.id ?? "Sem id";
        this.patientName = data.patientName ?? "";
        this.consultationTypeId = data.consultationTypeId ?? "313a95ce-af15-55d3-9403-eed37e8d2bef";
        this.startDate = data.startDate ? new Date(data.startDate) : new Date();
        this.endDate = data.endDate ? new Date(data.endDate) : new Date(this.startDate.getTime() + 30 * 60 * 1000); 
        this.materials = data.materials ?? [];
    }
}