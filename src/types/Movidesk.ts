export type Pessoa = {
  id: string,
  nome: string
}

export type EventoMovidesk = {
  inicio: string;
  fim: string;
  inicioHorario: string
  fimHorario: string;
  titulo: string;
  assunto: string
  tituloResumido: string;
  ticket: string;
  data: string;
  atividade?: string;
  categoria: string;
  emoji?: string;
};

export function isEventoMovidesk(obj: any): obj is EventoMovidesk {
  return obj?.inicio && obj?.fim && obj?.titulo && obj?.tituloResumido && obj?.ticket && obj?.data;
}

export type Status = 'ok' | 'error';