export type EventoTangerino = {
  inicio: string;
  inicioHorario: string;
  fim: string;
  fimHorario: string;
  data: string;
};

export function isEventoTangerino(obj: any): obj is EventoTangerino {
  return (
    obj &&
    typeof obj.inicio === "string" &&
    typeof obj.fim === "string" &&
    typeof obj.data === "string"
  );
}