<template>
  <div class="card">
    <div class="text-center p-2">
      <img
        src="https://www.schemer.com.br/wp-content/uploads/2022/09/logo-tangerino-sf.png"
        class=""
        style="height: 100px"
      />
    </div>
    <div class="card-body">
      <h5 class="card-title">Pontos Tangerino</h5>
      <p class="card-text">
        Exporte os pontos para um arquivo CSV. <br />
        Relatorios -> Folha de Ponto -> CSV
      </p>

      <input
        class="form-control mb-3"
        type="file"
        accept=".csv"
        ref="input"
        @change="inputChange"
      />

      <h3 v-if="dadosTangerino.eventos.length" class="text-success">OK</h3>
      <h3 v-else class="text-danger">Não carregado</h3>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import moment from 'moment';

const emit = defineEmits(['updateDadosTangerino']);

export type EventoTangerino = {
  inicio: string,
  fim: string,
  data: string
}


export type DadosTangerino = {
  eventos: EventoTangerino[]
}

const input = ref(null as HTMLInputElement | null);
const dadosTangerino = ref({eventos: []} as DadosTangerino);

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
}

const processarCsv = (dadosCsv: string[][]) => {
  const dadosTangerinoNovo: DadosTangerino = {
    eventos: []
  };

  dadosCsv.forEach((linha, index) => {

   const turnos = linha.slice(8, 15);

    for (let i = 0; i < turnos.length; i+=2) {
      const minutoInicio = turnos[i]?.replaceAll("'", '');
      const minutoFim = turnos[i + 1]?.replaceAll("'", '');
      const data = linha[2]?.replaceAll("'", '');


      if (!minutoInicio || !minutoFim || minutoInicio.indexOf(':') === -1 || minutoFim.indexOf(':') === -1)
        continue;

      const eventoTangerino: EventoTangerino = {
        inicio:  moment( `${data} ${minutoInicio}`, 'DD/MM/YYYY HH:mm' ).format('YYYY-MM-DD HH:mm') ,
        fim:  moment( `${data} ${minutoFim}`, 'DD/MM/YYYY HH:mm' ).format('YYYY-MM-DD HH:mm') ,
        data: data,
      }

      dadosTangerinoNovo.eventos.push(eventoTangerino);

    }
  });

  dadosTangerino.value = dadosTangerinoNovo;
}

watch(dadosTangerino, () => {
  emit('updateDadosTangerino', dadosTangerino.value);
});



</script>
