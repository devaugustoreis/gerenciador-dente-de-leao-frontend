export enum MovementType {
    ADDITION = 'ADDITION',
    REMOVAL = 'REMOVAL'
}

export default class MovementStock {
    materialId: string;
    movementType: MovementType;
    quantity: number;

    constructor(data: Partial<MovementStock> = {}) {
        this.materialId = data.materialId ?? "";
        this.movementType = data.movementType ?? MovementType.ADDITION;
        this.quantity = data.quantity ?? 0;
    }
}
