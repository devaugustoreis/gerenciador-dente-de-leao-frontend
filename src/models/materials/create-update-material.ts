export default class CreateUpdateMaterial {
    materialId: string;
    name: string;
    categoryId: string

    constructor(data: Partial<CreateUpdateMaterial> = {}) {
        this.materialId = data.materialId ?? "";
        this.name = data.name ?? "";
        this.categoryId = data.categoryId ?? "497eff18-bd89-4d14-b23f-92e0a7cd2a48";
    }
}