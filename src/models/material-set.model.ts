export interface MaterialSetItem {
    id: number;
    name: string;
    quantity: number;
}

export interface MaterialSet {
    id: number;
    name: string;
    materials: MaterialSetItem[];
}