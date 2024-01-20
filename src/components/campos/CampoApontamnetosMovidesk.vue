<template>
  <div>
    <Panel header="Apontamentos Movidesk">
      <div class="flex flex-col gap-3">
        <p>
          Exporte os apontamentos para um arquivo CSV.
        </p>

        <input
          class="mt-2"
          type="file"
          accept=".csv"
          ref="input"
          @change="inputChange"
        />

        <InlineMessage v-if="dadosMovidesk.eventos.length" severity="success">Importado com sucesso</InlineMessage>
        <InlineMessage v-else severity="warn">Não importado</InlineMessage>
      </div>
    </Panel>

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
  tituloResumido: string;
  ticket: string;
  data: string;
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
      titulo: `${linha[4]} - ${linha[6]}`,
      tituloResumido: `${linha[4]} - ${linha[6].slice(0, 20)}`,
      ticket: linha[4],
      data: data,
    };

    dadosMovideskNovo.eventos.push(eventoMovidesk);
  });

  dadosMovidesk.value = dadosMovideskNovo;
};

watch(dadosMovidesk, () => {
  emit("updateDadosMovidesk", dadosMovidesk.value);
});
</script>
