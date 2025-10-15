export interface AppointmentMaterial {
    materialId: string;
    quantity: number;
}

export default class Appointment {
    consultationId: string;
    patientName: string;
    consultationTypeId: string;
    startDate: Date;
    endDate: Date;
    materials: AppointmentMaterial[];
    concluded: boolean;

    constructor(data: Partial<Appointment> = {}) {
        this.consultationId = data.consultationId ?? "Sem id";
        this.patientName = data.patientName ?? "";
        this.consultationTypeId = data.consultationTypeId ?? "313a95ce-af15-55d3-9403-eed37e8d2bef";
        this.startDate = data.startDate ? new Date(data.startDate) : new Date();
        this.endDate = data.endDate ? new Date(data.endDate) : new Date(this.startDate.getTime() + 30 * 60 * 1000); 
        this.materials = data.materials ?? [];
        this.concluded = data.concluded ?? false
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
            consultationId: this.consultationId,
            patientName: this.patientName,
            consultationTypeId: this.consultationTypeId,
            startDate: this.formatLocalDate(this.startDate),
            endDate: this.formatLocalDate(this.endDate),
            materials: this.materials,
            concluded: this.concluded
        };
    }
}