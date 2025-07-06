import MaterialItem from "@/models/materials/material-item.model";

export interface MaterialSetItem {
    material: MaterialItem;
    quantity: number;
}

export default class MaterialSet {
    id: string;
    label: string;
    items: MaterialSetItem[];

    constructor(data: Partial<MaterialSet> = {}) {
        this.id = data.id ?? "";
        this.label = data.label ?? "";
        this.items = data.items ?? [];
    }
}