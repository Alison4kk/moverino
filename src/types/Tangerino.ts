export type EventoTangerino = {
  inicio: string;
  fim: string;
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