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

    <!-- <Panel header="Eventos" :class="{'is-light-mode': qalendarLightMode}" class="mt-3">
      <Qalendar :events="events" :config="config" />
    </Panel> -->

    <Panel header="Eventos" class="mt-3">
      <FullCalendar :options="calendarOptions" />
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

import { Qalendar } from "qalendar";
import "qalendar/dist/style.css";
import { configInterface } from "qalendar/dist/src/typings/config.interface";
import { eventInterface } from "qalendar/dist/src/typings/interfaces/event.interface";

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

const dadosTangerino = ref({ eventos: [] } as DadosTangerino);
const dadosMovidesk = ref({
  eventos: [],
  pessoas: [],
  tipoImportacao: "CSV",
} as DadosMovidesk);
const visible = ref(false);

const { eventBus } = useEventBus();

//Calendario

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "timeGridWeek",
  locale: "pt-br",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  events: events.value,
  slotMinTime: "07:00:00",
  slotMaxTime: "19:00:00",
  slotDuration: "00:20:00",
  height: 900,
  allDaySlot: false,
  eventMinHeight: 0
}));

const qalendarLightMode = ref(localStorage.getItem("darkMode") == "false");
eventBus.on("theme-changed", (theme) => {
  qalendarLightMode.value = theme == "light";
});

watch([dadosTangerino, () => dadosMovidesk.value.eventos], () => {
  montarEventos();
});

type Event = {
  title: string;
  start: string;
  end: string;
  description?: string;
  backgroundColor?: string;
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
      // time: {
      //   start: evento.inicio,
      //   end: evento.fim,
      // },
      // isEditable: false,
      // color: "green",
      // id: `${id}`,
    });
    id++;
  }

  for (const evento of dadosMovidesk.value.eventos) {
    novosEventos.push({
      title: evento.titulo,
      start: evento.inicio,
      end: evento.fim,
      // time: {
      //   start: evento.inicio,
      //   end: evento.fim,
      // },
      // isEditable: false,
      // color: "yellow",
      // id: `${id}`,
    });
    id++;
  }

  events.value = novosEventos;
};

const events = ref([] as Event[]);

const config = ref({
  dayBoundaries: {
    start: 6,
    end: 19,
  },
} as configInterface);

//Fim calendario
</script>
