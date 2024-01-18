<template>
  <div>

    <h3>{{ problemas.length ? 'Problemas encontrados: ' : 'Nenhum problema encontrado 🆗' }}</h3>

    <table v-if="problemas.length" class="table">
      <thead>
        <tr>
          <th scope="col">Data</th>
          <th scope="col">Descrição</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(problema, index) in problemas" :key="index">
          <th scope="row">{{ problema.tipo == 'problema' ? '🛑' : '❕' }}  {{ problema.data }}</th>
          <td scope="row">{{ problema.descricao }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { DadosMovidesk } from '@/components/campos/CampoApontamnetosMovidesk.vue';
import { DadosTangerino } from '@/components/campos/CampoPontosTangerino.vue';
import moment from 'moment';
import { PropType, ref, watch } from 'vue';

export type ProblemaApontamento = {
  tipo: 'alerta' | 'problema',
  descricao: string,
  data: string,
}

const props = defineProps({
  dadosTangerino: {
    type: Object as PropType<DadosTangerino>,
    required: true,
  },
  dadosMovidesk: {
    type: Object as PropType<DadosMovidesk>,
    required: true,
  },
});


watch([() => props.dadosTangerino, () => props.dadosMovidesk], () => {
  console.log('watch');

  if (props.dadosTangerino.eventos.length == 0 || props.dadosMovidesk.eventos.length == 0) return;
  processarProblemas();
});


const processarProblemas = () => {
  problemas.value = [];
  checadores.value.forEach(checador => checador());
}

const problemas = ref([] as ProblemaApontamento[]);
const checadores = ref([] as (() => void)[]);

/**
 * Apontamentos movidesk colidindo com outro
 *
 * Verifica algum apontamento do movidesk ocupa algum mesmo espaço de tempo que algum outro apontamento do movidesk.
 */
checadores.value.push(() => {
  debugger;
  const eventos = props.dadosMovidesk.eventos;

  for (let i = 0; i < eventos.length; i++) {
    const evento = eventos[i];
    const inicio = moment(evento.inicio);
    const fim = moment(evento.fim);

    for (let j = 0; j < eventos.length; j++) {
      if (i == j) continue;

      const evento2 = eventos[j];
      const inicio2 = moment(evento2.inicio);
      const fim2 = moment(evento2.fim);

      if (inicio.isBetween(inicio2, fim2) || fim.isBetween(inicio2, fim2)) {
        problemas.value.push({
          tipo: 'problema',
          descricao: `Apontamento "${evento.tituloResumido}" colidindo com "${evento2.tituloResumido}"`,
          data: evento.data,
        });
      }
    }
  }
});

/**
 * Apontamentos do Movidesk que estão fora do horário de trabalho (não estao contidos em nenhum apontamento do Tangerino)
 */
checadores.value.push(() => {
  const eventos = props.dadosMovidesk.eventos;

  for (let i = 0; i < eventos.length; i++) {
    const evento = eventos[i];
    const inicio = moment(evento.inicio);
    const fim = moment(evento.fim);

    let contido = false;

      for (const eventoTangerino of props.dadosTangerino.eventos) {
        const inicioTangerino = moment(eventoTangerino.inicio);
        const fimTangerino = moment(eventoTangerino.fim);

        if (inicio.isBetween(inicioTangerino, fimTangerino) && fim.isBetween(inicioTangerino, fimTangerino)) {
          contido = true;
          break;
        }
      }

    if (!contido) {
      problemas.value.push({
        tipo: 'problema',
        descricao: `Apontamento "${evento.tituloResumido}" fora do horário de trabalho`,
        data: evento.data,
      });
    }
  }
});

/**
 * Dias em que os apontamentos do Movidesk não chegam a 95% dos apontamentos do Tangerino
 */
checadores.value.push(() => {
  const eventosTangerino = props.dadosTangerino.eventos;
  const eventosMovidesk = props.dadosMovidesk.eventos;

  const diasTangerino = eventosTangerino.map(evento => evento.data);
  const diasMovidesk = eventosMovidesk.map(evento => evento.data);

  const dias = [...new Set([...diasTangerino, ...diasMovidesk])];

  for (const dia of dias) {
    const eventosTangerinoDia = eventosTangerino.filter(evento => evento.data == dia);
    const eventosMovideskDia = eventosMovidesk.filter(evento => evento.data == dia);

    const minutosTangerino = eventosTangerinoDia.reduce((acc, evento) => acc + moment(evento.fim).diff(moment(evento.inicio), 'minutes'), 0);
    const minutosMovidesk = eventosMovideskDia.reduce((acc, evento) => acc + moment(evento.fim).diff(moment(evento.inicio), 'minutes'), 0);

    if (minutosMovidesk / minutosTangerino < 0.95) {
      problemas.value.push({
        tipo: 'alerta',
        descricao: `Apontamentos do Movidesk não chegam a 95% dos apontamentos do Tangerino no dia ${dia}`,
        data: dia,
      });
    }
  }
});


</script>

<style scoped></style>
