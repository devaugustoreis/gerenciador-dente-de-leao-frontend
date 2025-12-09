import placeholderImg from "@/assets/images/material-placeholder.png";

// Carrega todos os arquivos da pasta materials
const materialImages = import.meta.glob("/src/assets/images/materials/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" }) as Record<string, string>;
const imageCache = new Map<string, string>(); // Cache para não reprocessar o find()

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

  // Retorna uma src pronta para <img>
  get imageSrc(): string {
    // 1 — Se veio imagem do backend:
    if (this.image) {
      if (this.image.startsWith("data:")) return this.image;
      return `data:image/png;base64,${this.image}`;
    }

    // 2 — Normaliza o nome
    const normalizedName = this.name
      .toLowerCase()
      .normalize("NFD")                   // Remove acentos
      .replace(/[\u0300-\u036f]/g, "")    // Remove marcas diacríticas
      .replace(/\s+/g, "-")               // Espaços viram hífens
      .replace(/[^a-z0-9\-]/g, "");       // Remove caracteres inválidos

    // 3 — Cache para melhorar performance em listas grandes
    if (imageCache.has(normalizedName)) return imageCache.get(normalizedName)!;

    // 4 — Tenta achar imagem nos assets importados
    const entry = Object.entries(materialImages).find(([path]) =>
      path.toLowerCase().includes(`/materials/${normalizedName}.`)
    );

    if (entry) {
      const url = entry[1];
      imageCache.set(normalizedName, url);
      return url;
    }

    // 5 — Fallback
    imageCache.set(normalizedName, placeholderImg);
    return placeholderImg;
  }
}
