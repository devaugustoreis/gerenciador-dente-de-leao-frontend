interface Category {
  id: string;
  label: string;
}

export default class MaterialItem {
  id: string;
  name: string;
  category: Category;
  image: string | null;
  stockQuantity: number;
  scheduledQuantity: number;
  alertQuantity: number;
  expectedEndDate: Date | null;
  highlight: boolean;

  constructor(data: Partial<MaterialItem> = {}) {
    this.id = data.id ?? "Sem id";
    this.name = data.name ?? "";
    this.category = data.category ?? { id: "Sem id", label: "Sem categoria" };
    this.image = data.image ?? null;
    this.stockQuantity = data.stockQuantity ?? 0;
    this.scheduledQuantity = data.scheduledQuantity ?? 0;
    this.alertQuantity = data.alertQuantity ?? 0;
    this.expectedEndDate = data.expectedEndDate ? new Date(data.expectedEndDate) : null;
    this.highlight = data.highlight ?? false;
  }

  // retorna uma src pronta para <img>
  get imageSrc(): string {
    if (!this.image) return new URL('@/assets/images/material-placeholder.png', import.meta.url).href;
    if (this.image.startsWith('data:')) return this.image;
    return `data:image/png;base64,${this.image}`;
  }
}
