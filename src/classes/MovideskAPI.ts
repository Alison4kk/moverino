import moment, { Moment } from 'moment'

export type Pessoa = {
  id: string,
  nome: string
}

export type EventoMovidesk = {
  inicio: string;
  fim: string;
  titulo: string;
  tituloResumido: string;
  ticket: string;
  data: string;
};

export type Status = 'ok' | 'error';

export class MovideskAPI {

  private readonly BASE_URL = "https://api.movidesk.com/public/v1";

  buscarPessoasDesenvolvimento(callback: (data: Pessoa[], status?: Status) => void) {
    this.query('persons', `$select=id,businessName,teams&$filter=teams/any(e: e eq 'Desenvolvimento')`)
      .then(response => response.json())
      .then(data => {
        const pessoas: Pessoa[] = [];
        if (data && Array.isArray(data)) {
          data.forEach((pessoa) => {
            if (!pessoa?.id || !pessoa?.businessName) return;
            pessoas.push({
              id: pessoa.id,
              nome: pessoa.businessName
            });
          });
        }
        pessoas.sort((a, b) => a.nome.localeCompare(b.nome));
        callback(pessoas, 'ok');
      })
      .catch(error => { console.log(error); callback([], 'error') });
  }

  buscarApontamentos(inicio: string, fim: string, codigo: string, callback: (data: EventoMovidesk[], status?: Status) => void) {
    this.query('tickets', `$select=id,subject,createdDate&$filter=actions/any(action: action/timeAppointments/any(ap: ap/createdBy/id eq '${codigo}' and ap/date gt ${inicio} and ap/date lt ${fim}))&$expand=actions($select=origin,id),actions($expand=timeAppointments($expand=createdBy))`)
      .then(response => response.json())
      .then(data => {
        const eventosMovidesk: EventoMovidesk[] = [];
        if (data && Array.isArray(data)) {
          data.forEach((ticket) => {
            if (!ticket?.id || !ticket?.subject || !ticket?.actions) return;
            ticket.actions.forEach((action: any) => {
              if (!action?.timeAppointments || !Array.isArray(action.timeAppointments)) return;
              action.timeAppointments.forEach((ap: any) => {
                if (ap.createdBy.id !== codigo || ap.date < inicio || ap.date > fim) return;

                const date = ap.date.split('T')[0];
                eventosMovidesk.push({
                  data: moment(date).format('DD/MM/YYYY'),
                  inicio: moment(`${date} ${ap.periodStart}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
                  fim: moment(`${date} ${ap.periodEnd}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
                  titulo: `${ticket.id} - ${ticket.subject}` ,
                  tituloResumido: `${ticket.id} - ${ticket.subject.slice(0, 20)}`,
                  ticket: ticket.id
                })
              })
            });

          });
        }
        eventosMovidesk.sort((a, b) => a.inicio.localeCompare(b.inicio));
        console.log(eventosMovidesk);
        callback(eventosMovidesk, 'ok');

      })
      .catch(error => { console.log(error); callback([], 'error') });
  }

  getBaseUrlFor(endpoint: string) {
    return `${this.BASE_URL}/${endpoint}`;
  }

  query(endpoint: string, query: string) {
    if (!endpoint || !query) throw new Error("Endpoint and query are required");
    if (!this.getToken()) throw new Error("Token is required");

    return fetch(`${this.BASE_URL}/${endpoint}?token=${this.getToken()}&${query}`);
  }

  public setToken(token: string) {
    localStorage.setItem("tokenMovidesk", token);
  }

  public getToken(): string | null {
    return localStorage.getItem("tokenMovidesk");
  }

  public removeToken() {
    localStorage.removeItem("tokenMovidesk");
  }
}