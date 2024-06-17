import { EventoMovidesk, Pessoa, Status } from '@/types/Movidesk';
import moment, { Moment } from 'moment'



export class MovideskAPI {

  private readonly BASE_URL = "https://api.movidesk.com/public/v1";
  private readonly CATEGORIA_EMOJI = {
    "Customização": "👨‍💻",
    "Melhoria": "🔧",
    "Configuração": "💼",
    "Dúvida": "💰",
    "Erro": "👩‍💼",
    "Serviço": "❓"
  }

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
    this.query('tickets', `$select=id,subject,createdDate,category&$filter=actions/any(action: action/timeAppointments/any(ap: ap/createdBy/id eq '${codigo}' and ap/date ge ${inicio} and ap/date lt ${fim}))&$expand=actions($select=origin,id),actions($expand=timeAppointments($expand=createdBy))`)
      .then(response => response.json())
      .then(data => {
        const eventosMovidesk: EventoMovidesk[] = [];
        if (data && Array.isArray(data)) {
          data.forEach((ticket) => {
            if (!ticket?.id || !ticket?.subject || !ticket?.actions) return;
            ticket.actions.forEach((action: any) => {

              if (!action?.timeAppointments || !Array.isArray(action.timeAppointments)) return;

              action.timeAppointments.forEach((ap: any) => {

                if (ap.createdBy.id !== codigo || (ap.date + 'z') < inicio || (ap.date + 'z') > fim) {
                  return;
                };

                const catogoria = String(ticket.category).split('(')[0].trim();
                const date = ap.date.split('T')[0];
                eventosMovidesk.push({
                  data: moment(date).format('DD/MM/YYYY'),
                  inicio: moment(`${date} ${ap.periodStart}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
                  fim: moment(`${date} ${ap.periodEnd}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
                  titulo: `${ticket.id} - ${ticket.subject}` ,
                  tituloResumido: `${ticket.id} - ${ticket.subject.slice(0, 20)}${ticket.subject.length > 20 ? '...' : ''}`,
                  assunto: ticket.subject,
                  ticket: ticket.id,
                  inicioHorario: moment(ap.periodStart, 'HH:mm:ss').format('HH:mm'),
                  fimHorario: moment(ap.periodEnd, 'HH:mm:ss').format('HH:mm'),
                  atividade: ap.activity ?? 'Sem atividade',
                  categoria: catogoria
                })
              })
            });

          });
        }
        eventosMovidesk.sort((a, b) => a.inicio.localeCompare(b.inicio));
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
    localStorage.setItem("tokenMovidesk",  btoa(token));
  }

  public getToken(): string | null {
    const tokenCriptografado = localStorage.getItem("tokenMovidesk");
    if (!tokenCriptografado) return null;
    return atob(tokenCriptografado);
  }

  public removeToken() {
    localStorage.removeItem("tokenMovidesk");
  }
}