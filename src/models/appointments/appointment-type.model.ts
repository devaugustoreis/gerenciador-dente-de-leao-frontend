export default class AppointmentType {
    id: string;
    label: string;
    
    constructor(id: string = '', label: string = '') {
        this.id = id;
        this.label = label;
    }
}