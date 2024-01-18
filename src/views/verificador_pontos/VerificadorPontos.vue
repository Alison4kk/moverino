<template>
  <div>
    <h1>Verificador de Pontos</h1>

    <div>
      <Offcanvas title="Importar Dados" button-text="Importar">
        <template #body>
          <div class="d-flex flex-column gap-3">
            <CampoPontosTangerino
              @update-dados-tangerino="dadosTangerino = $event"
            />
            <CampoApontamnetosMovidesk
              @update-dados-movidesk="dadosMovidesk = $event"
            />
          </div>
        </template>
      </Offcanvas>
    </div>

    <div class="mt-3">
      <div class="is-light-mode">
        <Qalendar :events="events" :config="config" />
      </div>
    </div>

    <div class="mt-3">
      <TabelaProblemas
        :dados-movidesk="dadosMovidesk"
        :dados-tangerino="dadosTangerino"
      />
    </div>
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

import { ref, watch } from "vue";
import CampoApontamnetosMovidesk, {
  DadosMovidesk,
} from "@/components/campos/CampoApontamnetosMovidesk.vue";
import Offcanvas from "@/components/utils/Offcanvas.vue";
import TabelaProblemas from "./TabelaProblemas.vue";

const dadosTangerino = ref({ eventos: [] } as DadosTangerino);
const dadosMovidesk = ref({ eventos: [] } as DadosMovidesk);

//Calendario
watch([dadosTangerino, dadosMovidesk], () => {
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
