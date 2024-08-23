<template>
  <div>
    <Toolbar>
      <template #start>
        <h2 class="font-bold text-lg">Verificador de Pontos</h2>
      </template>

      <template #end>
        <Button
          v-if="dadosMovidesk.tipoImportacao == 'API'"
          icon="pi pi-refresh"
          label="Buscar da API"
          class="mr-2"
          @click="eventBus.emit('buscar-apontamentos-movidesk')"
        />
        <Button
          icon="pi pi-database"
          label="Importação"
          class="mr-2"
          @click="visible = true"
        />
      </template>
    </Toolbar>

    <!-- <Panel class="mt-3" header="Importar" :toggleable="true"> </Panel> -->

    <Offcanvas header="Importação de Pontos" v-model="visible">
      <div class="flex gap-3 flex-col">
        <CampoPontosTangerino
          @update-dados-tangerino="dadosTangerino = $event"
        />
        <CampoApontamnetosMovidesk
          ref="campoApontamentosMovidesk"
          @update-dados-movidesk="dadosMovidesk = $event"
        />
      </div>
    </Offcanvas>

    <Panel header="Eventos" class="mt-3">

      <div class="flex gap-5">
        <LabeledInput label="Periodo: ">
          <Dropdown
            v-model="visualiacaoCalendario"
            :options="[
              {label: 'Semana', value: 'timeGridWeek'},
              {label: 'Mês', value: 'dayGridMonth'},
              {label: 'Dia', value: 'timeGridDay'},
              {label: 'Lista', value: 'listWeek'},
            ]"
            optionLabel="label"
            optionValue="value"
          />
        </LabeledInput>
        <div class="flex gap-2 items-end">
          <Button
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="retrocederCalendario"
          />
          <Button
            severity="secondary"
            icon="pi pi-arrow-right"
            @click="avancarCalendario"
          />
          <Button
            severity="secondary"
            label="Hoje"
            @click="voltarHoje"
          />
        </div>

      </div>

      <FullCalendar ref="fullcalendarElement" :options="calendarOptions" class="mt-5" />

      <Dialog
        v-model:visible="dialogoEventoVisivel"
        :style="{ width: '50rem' }"
        modal
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <template #header>
          <div class="font-bold text-lg">
            <div v-if="isEventoMovidesk(dialogoEvento?.evento)">
              <span
                class="cursor-pointer"
                @click="
                  copiarTexto(
                    dialogoEvento?.evento.ticket,
                    'Número do Ticket Copiado'
                  )
                "
              >
                <i class="pi pi-copy"></i>
                {{ dialogoEvento?.evento.ticket }} -
                {{ dialogoEvento?.evento.assunto }}
              </span>
            </div>
            <div v-else>Trabalhando</div>
          </div>
        </template>
        <div v-if="dialogoEvento?.evento" class="flex flex-col gap-2">
          <div v-if="isEventoMovidesk(dialogoEvento.evento)">
              {{ dialogoEvento.evento.categoria }} | {{ dialogoEvento.evento.data }}
          </div>
          <div v-else>
            {{ dialogoEvento.evento.data }}
          </div>
          <div>
            <span
              class="cursor-pointer"
              @click="
                copiarTexto(
                  dialogoEvento?.evento.inicioHorario,
                  'Horario Copiado'
                )
              "
            >
              <i class="pi pi-copy"></i>
              {{ dialogoEvento?.evento.inicioHorario }}</span
            >
            <i class="pi pi-arrow-right mx-2"></i>
            <span
              class="cursor-pointer"
              @click="
                copiarTexto(dialogoEvento?.evento.fimHorario, 'Horario Copiado')
              "
            >
              <i class="pi pi-copy"></i> {{ dialogoEvento?.evento.fimHorario }}
            </span>
            <span v-if="isEventoMovidesk(dialogoEvento.evento)">
              ({{ dialogoEvento.evento?.atividade }})
            </span>
          </div>

          <div class="text-gray-400">
            <span
              class="cursor-pointer"
              v-show="dialogoEvento?.anterior"
              @click="
                copiarTexto(
                  dialogoEvento?.anterior ?? '',
                  'Horario Copiado'
                )
              "
            >
              <i class="pi pi-copy"></i>
              {{ dialogoEvento?.anterior }}</span
            >
            <span> | - |</span>
            <span
              class="cursor-pointer"
              v-show="dialogoEvento?.posterior"
              @click="
                copiarTexto(dialogoEvento?.posterior ?? '', 'Horario Copiado')
              "
            >
              <i class="pi pi-copy"></i> {{ dialogoEvento?.posterior }}
            </span>

          </div>

          <div v-if="isEventoMovidesk(dialogoEvento.evento)">
            <a
              :href="`https://areacentral.movidesk.com/Ticket/Edit/${dialogoEvento.evento.ticket}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button label="Abrir Ticket" link />
            </a>
          </div>
        </div>
      </Dialog>
    </Panel>

      <TabelaProblemas
        :dados-movidesk="dadosMovidesk"
        :dados-tangerino="dadosTangerino"
      />
  </div>
</template>

<script setup lang="ts">
import CampoPontosTangerino, {
  DadosTangerino,
} from "@/components/campos/CampoPontosTangerino.vue";

import "qalendar/dist/style.css";

import { ref, watch, computed, onMounted } from "vue";
import CampoApontamnetosMovidesk, {
  DadosMovidesk,
} from "@/components/campos/CampoApontamnetosMovidesk.vue";
import Offcanvas from "@/components/utils/Offcanvas.vue";
import TabelaProblemas from "./TabelaProblemas.vue";
import useEventBus from "@/composables/useEventBus";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import moment from "moment";
import { EventoMovidesk, isEventoMovidesk } from "@/types/Movidesk";
import { EventoTangerino, isEventoTangerino } from "@/types/Tangerino";
import { useToast } from "primevue/usetoast";
import useScreenSize from "@/composables/useScreenSize";
import LabeledInput from "@/components/utils/LabeledInput.vue";


const dadosTangerino = ref({ eventos: [] } as DadosTangerino);
const dadosMovidesk = ref({
  eventos: [],
  pessoas: [],
  tipoImportacao: "CSV",
} as DadosMovidesk);
const visible = ref(false);

const { eventBus } = useEventBus();
const toast = useToast();
const {isSm, isMdOrMore, isLgOrMore} = useScreenSize()


//Manipulação do calendário
const fullcalendarElement = ref(null);
const visualiacaoCalendario = ref("timeGridWeek");

watch(visualiacaoCalendario, (nv) => {
  fullcalendarElement.value?.calendar?.changeView(nv);
});

const avancarCalendario = () => {
  fullcalendarElement.value?.calendar?.next();
};

const retrocederCalendario = () => {
  fullcalendarElement.value?.calendar?.prev();
};

const voltarHoje = () => {
  fullcalendarElement.value?.calendar?.today();
};

// onMounted(() => {

//   window.calendario = fullcalendarElement.value?.calendar;
  
// })

//Calendario
const dialogoEventoVisivel = ref(false);
const dialogoEvento = ref(null as EventExtendedProps | null);

const copiarTexto = (texto: string, mensagem?: string) => {
  navigator.clipboard.writeText(texto);
  toast.add({
    severity: "success",
    summary: "Copiado",
    detail: mensagem ?? "Texto copiado para a área de transferência",
    life: 3000,
  });
};

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: "timeGridWeek",
  locale: ptBrLocale,
  headerToolbar: {
    left: "",
    center: "title",
    right: "",
  },
  events: events.value,
  slotMinTime: "07:00:00",
  slotMaxTime: "19:00:00",
  slotDuration: "00:20:00",
  height: 1000,
  allDaySlot: false,
  eventMinHeight: 0,
  eventDidMount: (info: any) => {

    if (info.view.type == "listWeek") return;

    tippy(info.el, {
      content: `
        ${info?.event?.title}
        <br><br>
        ${info.event.extendedProps.evento?.categoria}
        <br> ${info.event.extendedProps.evento?.atividade}
        <br> 
        (${moment(info?.event?.start).format("HH:mm")} - ${moment(
        info?.event?.end
      ).format("HH:mm")})
      `,
      placement: "auto",
      allowHTML: true,
    });

    const element = info.el as HTMLElement;
    const containerConteudo = element.querySelector(
      ".evento-conteudo-container"
    ) as HTMLElement;

    setTimeout(() => {
      const height = element?.offsetHeight;

      if (height <= 9) {
        containerConteudo.style.fontSize = "6px";
        containerConteudo.style.lineHeight = "7px";
      } else if (height <= 15) {
        containerConteudo.style.fontSize = "10px";
        containerConteudo.style.lineHeight = "12px";
      }
    }, 0);
  },
  eventContent: (info: any) => {
    const listWeek = info.view.type == "listWeek";

    const html = /* html */ `
      <div style="cursor: pointer; ${listWeek ? '' : 'font-size: 13px; line-height: 14px;'}"  class="evento-conteudo-container overflow-hidden h-full">
        ${
          info?.event?.extendedProps?.fonte == "tangerino"
            ? info.event.title
            : listWeek ? info.event.extendedProps.evento.titulo : info.event.extendedProps.evento.tituloResumido
        }
      </div>
    `;

    return { html };
  },
  eventClick(info: any) {
    const extendedProps = info?.event?.extendedProps as EventExtendedProps;
    if (!extendedProps) return;

    dialogoEvento.value = extendedProps;
    dialogoEventoVisivel.value = true;
  },
}));

watch([dadosTangerino, () => dadosMovidesk.value.eventos], () => {
  montarEventos();
});

type Event = {
  title: string;
  start: string;
  end: string;
  description?: string;
  backgroundColor?: string;
  extendedProps?: EventExtendedProps;
};

type EventExtendedProps = {
  fonte: "movidesk" | "tangerino";
  evento: EventoTangerino | EventoMovidesk;
  posterior?: string;
  anterior?: string;
};

const montarEventos = () => {
  const novosEventos: Event[] = [];
  let id = 0;
  const horariosEventos: string[] = [];

  for (const evento of dadosTangerino.value.eventos) {
    horariosEventos.push(evento.inicio);
    horariosEventos.push(evento.fim);
  }
  for (const evento of dadosMovidesk.value.eventos) {
    horariosEventos.push(evento.inicio);
    horariosEventos.push(evento.fim);
  }

  horariosEventos.sort();
  const horariosEventosUnsorted =  Array.from(horariosEventos) as string[];
  horariosEventosUnsorted.sort((a, b) => a.localeCompare(b) * -1);

  for (const evento of dadosTangerino.value.eventos) {
    novosEventos.push({
      title: "Trabalhando",
      start: evento.inicio,
      end: evento.fim,
      backgroundColor: "#4caf50",
      extendedProps: { fonte: "tangerino", evento: evento },
    });
    id++;
  }

  for (const evento of dadosMovidesk.value.eventos) {

    const horarioPosterior = horariosEventos.find(
      (h) => h > evento.fim
    );
    const horarioAnterior = horariosEventosUnsorted.find(
      (h) => h < evento.inicio
    );  

    novosEventos.push({
      title: evento.titulo,
      start: evento.inicio,
      end: evento.fim,
      extendedProps: { fonte: "movidesk", evento: evento, posterior: horarioPosterior?.split(' ')[1], anterior: horarioAnterior?.split(' ')[1]},
    });
    id++;
  }

  events.value = novosEventos;
};

const events = ref([] as Event[]);
</script>

<style lang="scss">
html.dark {
  --fc-list-event-hover-bg-color: rgb(var(--surface-800));
  --fc-neutral-bg-color: rgb(var(--surface-600));
}
</style>
