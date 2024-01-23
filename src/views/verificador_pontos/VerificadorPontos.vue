<template>
  <div>
    <Toolbar>
      <template #start>
        <h2 class="font-bold text-lg">Verificador de Pontos</h2>
      </template>

      <template #end>
        <Button
          icon="pi pi-database"
          label="Importar"
          class="mr-2"
          @click="visible = true"
        />
      </template>
    </Toolbar>

    <!-- <Panel class="mt-3" header="Importar" :toggleable="true"> </Panel> -->

    <Offcanvas :active="visible">
      <div class="flex gap-3 flex-col">
        <CampoPontosTangerino
          @update-dados-tangerino="dadosTangerino = $event"
        />
        <CampoApontamnetosMovidesk
          @update-dados-movidesk="dadosMovidesk = $event"
        />
      </div>
    </Offcanvas>

    <!--
    <Sidebar
      v-model:visible="visible"
      header="Importar Dados"
      style="width: 600px"
    >
    </Sidebar> -->

    <Panel header="Eventos" class="mt-3">
      <Qalendar :events="events" :config="config" />
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
const visible = ref(false);

import CampoPontosTangerino, {
  DadosTangerino,
} from "@/components/campos/CampoPontosTangerino.vue";

import { Qalendar } from "qalendar";
import "qalendar/dist/style.css";
import { configInterface } from "qalendar/dist/src/typings/config.interface";
import { eventInterface } from "qalendar/dist/src/typings/interfaces/event.interface";

import { ref, watch } from "vue";
import CampoApontamnetosMovidesk, {
  DadosMovidesk,
} from "@/components/campos/CampoApontamnetosMovidesk.vue";
import Offcanvas from "@/components/utils/Offcanvas.vue";
import TabelaProblemas from "./TabelaProblemas.vue";

const dadosTangerino = ref({ eventos: [] } as DadosTangerino);
const dadosMovidesk = ref({ eventos: [], pessoas: [] } as DadosMovidesk);

//Calendario
watch([dadosTangerino, () => dadosMovidesk.value.eventos], () => {
  montarEventos();
});

const montarEventos = () => {
  const novosEventos: eventInterface[] = [];
  let id = 0;

  for (const evento of dadosTangerino.value.eventos) {
    novosEventos.push({
      title: "Trabalhando",
      time: {
        start: evento.inicio,
        end: evento.fim,
      },
      isEditable: false,
      color: "green",
      id: `${id}`,
    });
    id++;
  }

  for (const evento of dadosMovidesk.value.eventos) {
    novosEventos.push({
      title: evento.titulo,
      time: {
        start: evento.inicio,
        end: evento.fim,
      },
      isEditable: false,
      color: "yellow",
      id: `${id}`,
    });
    id++;
  }

  events.value = novosEventos;
};

const events = ref([] as eventInterface[]);

const config = ref({
  dayBoundaries: {
    start: 6,
    end: 19,
  },
} as configInterface);

//Fim calendario
</script>
