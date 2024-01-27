<template>
  <div>
    <Panel header="Pontos Tangerino">
      <div class="flex flex-col gap-3">
        <p>
          Exporte os pontos para um arquivo CSV. <br />
          Relatorios -> Folha de Ponto -> CSV
        </p>

        <input
          class="mt-2"
          type="file"
          accept=".csv"
          ref="input"
          @change="inputChange"
        />

        <InlineMessage v-if="dadosTangerino.eventos.length" severity="success">Importado com sucesso</InlineMessage>
        <InlineMessage v-else severity="warn">Não importado</InlineMessage>
      </div>
    </Panel>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import moment from "moment";
import {EventoTangerino} from '@/types/Tangerino';

const emit = defineEmits(["updateDadosTangerino"]);



export type DadosTangerino = {
  eventos: EventoTangerino[];
};

const input = ref(null as HTMLInputElement | null);
const dadosTangerino = ref({ eventos: [] } as DadosTangerino);

onMounted(() => {
  const dadosTangerinoSalvo = localStorage.getItem('dadosTangerino');
  if (dadosTangerinoSalvo) {
    dadosTangerino.value = JSON.parse(dadosTangerinoSalvo);
  }
});

const inputChange = () => {
  if (!input.value || !input.value.files || input.value?.files[0] == null)
    return;

  const reader = new FileReader();
  reader.readAsText(input.value.files[0]);

  reader.onload = (event) => {
    const csv = event.target?.result;

    if (!csv) {
      console.warn("Nao foi possivel abrir o CSV");
      return;
    }

    const linhas = csv.toString().split("\n");
    const dadosCsv: string[][] = [];

    for (var i = 1; i < linhas.length; i++) {
      dadosCsv.push(linhas[i].split(","));
    }
    processarCsv(dadosCsv);
  };
};

const processarCsv = (dadosCsv: string[][]) => {
  const dadosTangerinoNovo: DadosTangerino = {
    eventos: [],
  };

  dadosCsv.forEach((linha, index) => {
    const turnos = linha.slice(8, 15);

    for (let i = 0; i < turnos.length; i += 2) {
      const minutoInicio = turnos[i]?.replaceAll("'", "");
      const minutoFim = turnos[i + 1]?.replaceAll("'", "");
      const data = linha[2]?.replaceAll("'", "");

      if (
        !minutoInicio ||
        !minutoFim ||
        minutoInicio.indexOf(":") === -1 ||
        minutoFim.indexOf(":") === -1
      )
        continue;

      const eventoTangerino: EventoTangerino = {
        inicio: moment(`${data} ${minutoInicio}`, "DD/MM/YYYY HH:mm").format(
          "YYYY-MM-DD HH:mm"
        ),
        inicioHorario: minutoInicio,
        fim: moment(`${data} ${minutoFim}`, "DD/MM/YYYY HH:mm").format(
          "YYYY-MM-DD HH:mm"
        ),
        fimHorario: minutoFim,
        data: data,
      };

      dadosTangerinoNovo.eventos.push(eventoTangerino);
    }
  });

  dadosTangerino.value = dadosTangerinoNovo;
};

watch(dadosTangerino, () => {
  emit("updateDadosTangerino", dadosTangerino.value);
  localStorage.setItem('dadosTangerino', JSON.stringify(dadosTangerino.value));
});
</script>
