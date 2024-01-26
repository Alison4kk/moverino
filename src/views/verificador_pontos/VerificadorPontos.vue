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
      <FullCalendar :options="calendarOptions" />

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
                @click="copiarTexto(dialogoEvento?.evento.ticket, 'Número do Ticket Copiado')"
              >
                <i class="pi pi-copy"></i>
                {{ dialogoEvento?.evento.ticket }} -
                {{ dialogoEvento?.evento.assunto }}
              </span>
            </div>
            <div v-else>Trabalhando</div>
          </div>
        </template>
        <div v-if="isEventoMovidesk(dialogoEvento?.evento)" class="flex flex-col gap-2">
          <div>
            {{ dialogoEvento.evento.data }}
          </div>
          <div>
            <span
              class="cursor-pointer"
              @click="copiarTexto(dialogoEvento?.evento.inicioHorario, 'Horario Copiado')"
            >
              <i class="pi pi-copy"></i>
              {{ dialogoEvento?.evento.inicioHorario }}</span
            >
            <i class="pi pi-arrow-right mx-2"></i>
            <span
              class="cursor-pointer"
              @click="copiarTexto(dialogoEvento?.evento.fimHorario, 'Horario Copiado')"
            >
              <i class="pi pi-copy"></i> {{ dialogoEvento?.evento.fimHorario }}
            </span>
          </div>

          <div>
            <a :href="`https://areacentral.movidesk.com/Ticket/Edit/${dialogoEvento.evento.ticket}`" target="_blank" rel="noopener noreferrer">
              <Button label="Abrir Ticket" link />
            </a>
          </div>

        </div>
      </Dialog>
    </Panel>

    <Panel header="Problemas" class="mt-3">
      <TabelaProblemas
        :dados-movidesk="dadosMovidesk"
        :dados-tangerino="dadosTangerino"
      />
    </Panel>
  </div>
</template>

<script setup lang="ts">
import CampoPontosTangerino, {
  DadosTangerino,
} from "@/components/campos/CampoPontosTangerino.vue";

import "qalendar/dist/style.css";

import { ref, watch, computed } from "vue";
import CampoApontamnetosMovidesk, {
  DadosMovidesk,
} from "@/components/campos/CampoApontamnetosMovidesk.vue";
import Offcanvas from "@/components/utils/Offcanvas.vue";
import TabelaProblemas from "./TabelaProblemas.vue";
import useEventBus from "@/composables/useEventBus";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import moment from "moment";
import { EventoMovidesk, isEventoMovidesk } from "@/types/Movidesk";
import { EventoTangerino } from "@/types/Tangerino";
import { useToast } from "primevue/usetoast";

const dadosTangerino = ref({ eventos: [] } as DadosTangerino);
const dadosMovidesk = ref({
  eventos: [],
  pessoas: [],
  tipoImportacao: "CSV",
} as DadosMovidesk);
const visible = ref(false);

const { eventBus } = useEventBus();
const toast = useToast();

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
  locale: "pt-br",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  events: events.value,
  slotMinTime: "07:00:00",
  slotMaxTime: "19:00:00",
  slotDuration: "00:20:00",
  height: 1000,
  allDaySlot: false,
  eventMinHeight: 0,
  eventDidMount: (info: any) => {
    tippy(info.el, {
      content: `
        ${info?.event?.title}
        <br><br>
        (${moment(info?.event?.start).format("hh:mm")} - ${moment(
        info?.event?.end
      ).format("hh:mm")})
      `,
      placement: "auto",
      allowHTML: true,
    });

    const element = info.el as HTMLElement;
    const containerConteudo = element.querySelector('.evento-conteudo-container') as HTMLElement;
    const height = element?.offsetHeight;

    if (height <= 9) {
      containerConteudo.style.fontSize = "6px";
      containerConteudo.style.lineHeight = "7px";
    } else if (height <= 15) {
      containerConteudo.style.fontSize = "10px";
      containerConteudo.style.lineHeight = "12px";
    } else {
      containerConteudo.style.fontSize = "13px";
    }


  },
  eventContent: (info: any) => {
    const html = /* html */ `
      <div style="cursor: pointer;" class="evento-conteudo-container overflow-hidden h-full">
        ${info.event.title}
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
};

const montarEventos = () => {
  const novosEventos: Event[] = [];
  let id = 0;

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
    novosEventos.push({
      title: evento.tituloResumido,
      start: evento.inicio,
      end: evento.fim,
      extendedProps: { fonte: "movidesk", evento: evento },
    });
    id++;
  }

  events.value = novosEventos;
};

const events = ref([] as Event[]);
</script>
