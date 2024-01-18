<template>
  <div class="card">
    <div class="text-center p-2">
      <img
        src="https://www.movidesk.com/assets/pt-br/img/logo-movidesk-zenvia.svg"
        class=""
        style="height: 100px"
      />
    </div>
    <div class="card-body">
      <h5 class="card-title">Apontamentos Movidesk</h5>
      <p class="card-text">
        Exporte os apontamentos para um arquivo CSV. <br />
      </p>

      <input
        class="form-control mb-3"
        type="file"
        accept=".csv"
        ref="input"
        @change="inputChange"
      />

      <h3 v-if="dadosMovidesk.eventos.length" class="text-success">OK</h3>
      <h3 v-else class="text-danger">Não carregado</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import moment from "moment";

const emit = defineEmits(["updateDadosMovidesk"]);

export type EventoMovidesk = {
  inicio: string;
  fim: string;
  titulo: string;
};

export type DadosMovidesk = {
  eventos: EventoMovidesk[];
};

const input = ref(null as HTMLInputElement | null);
const dadosMovidesk = ref({ eventos: [] } as DadosMovidesk);

const inputChange = () => {
  debugger;
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
      dadosCsv.push(linhas[i].split(";"));
    }
    processarCsv(dadosCsv);
  };
};

const processarCsv = (dadosCsv: string[][]) => {
  const dadosMovideskNovo: DadosMovidesk = { eventos: [] };

  dadosCsv.forEach((linha, index) => {
    const data = linha[11];
    const minutoInicio = linha[12];
    const minutoFim = linha[13];

    if (
      !minutoInicio ||
      !minutoFim ||
      minutoInicio.indexOf(":") === -1 ||
      minutoFim.indexOf(":") === -1
    )
      return;

    const eventoMovidesk: EventoMovidesk = {
      inicio: moment(`${data} ${minutoInicio}`, "DD/MM/YYYY HH:mm").format(
        "YYYY-MM-DD HH:mm"
      ),
      fim: moment(`${data} ${minutoFim}`, "DD/MM/YYYY HH:mm").format(
        "YYYY-MM-DD HH:mm"
      ),
      titulo: `${linha[4]} ${linha[6]}`,
    };

    dadosMovideskNovo.eventos.push(eventoMovidesk);
  });

  dadosMovidesk.value = dadosMovideskNovo;
};

watch(dadosMovidesk, () => {
  emit("updateDadosMovidesk", dadosMovidesk.value);
});
</script>
