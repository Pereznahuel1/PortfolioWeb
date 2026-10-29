export type EstadoProyecto = "publicado" | "borrador";

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  tecnologias: string;
  imagen: string | null;
  enlace: string | null;
  estado: EstadoProyecto;
}

export type NuevoProyecto = Omit<Proyecto, "id">;