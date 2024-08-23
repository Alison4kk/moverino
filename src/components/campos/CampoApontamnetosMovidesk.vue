<template>
  <div>
    <Panel header="Apontamentos Movidesk">
      <div class="flex flex-col gap-3">
        <LabeledInput label="Metodo de Importação:">
          <SelectButton
            :disabled="buscandoDaApi"
            id="inputTipo"
            v-model="tipo"
            :options="['CSV', 'API']"
          />
        </LabeledInput>

        <div>
          <div v-if="tipo == 'CSV'" class="flex flex-col gap-3">
            <p>Exporte os apontamentos para um arquivo CSV.</p>


            <label>
          
              <div class="rounded-md border border-white p-5 text-center">
                Importar
              </div>

              <input
                class="mt-2 hidden"
                type="file"
                accept=".csv"
                ref="inputCsv"
                :disabled="buscandoDaApi"
                @change="inputCsvChange"
              />
            </label>


            <InlineMessage
              v-if="dadosMovidesk.eventos.length"
              severity="success"
              >Importado com sucesso</InlineMessage
            >
            <InlineMessage v-else severity="warn">Não importado</InlineMessage>
          </div>

          <div v-else-if="tipo == 'API'" class="flex flex-col gap-3">
            <div v-if="!temToken" class="flex flex-col gap-3">
              <LabeledInput class="mb-2" label="Token:">
                <InputText
                  v-model="inputTokenValue"
                  :disabled="buscandoDaApi"
                  class="w-full"
                />
              </LabeledInput>

              <Button
                class="w-full"
                @click="salvarToken"
                :disabled="inputTokenValue == '' || buscandoDaApi"
                label="Importar"
              />
              <Button
                class="w-full"
                icon="pi pi-cloud-download"
                v-if="bPodeBuscarToken"
                @click="buscarTokenAdmin"
                label="Buscar do Admin"
              />
            </div>
            <div v-else class="flex flex-col gap-3">
              <Button
                class="w-full"
                severity="danger"
                @click="removerToken"
                :disabled="buscandoDaApi"
                label="Remover Token Salvo"
              />
              <InlineMessage
                v-if="dadosMovidesk.pessoas.length"
                severity="success"
                >Importado com sucesso</InlineMessage
              >
              <InlineMessage v-else-if="buscandoDaApi" severity="info"
                >Buscando dados...</InlineMessage
              >
              <InlineMessage v-else severity="warn"
                >Não importado, verifique a conexão e o Token da
                API</InlineMessage
              >
            </div>
          </div>
        </div>

        <!-- Configuração de importacao da API (usuario e intervalo de data) -->
        <div v-if="tipo == 'API' && dadosMovidesk.pessoas.length">
          <Divider />
          <div class="flex gap-4 justify-start flex-wrap">
            <LabeledInput label="Pessoa:">
              <Dropdown
                v-model="pessoaSelecionada"
                :disabled="buscandoDaApi"
                :options="opcoesDropdownPessoas"
                optionLabel="name"
                placeholder="Selecione uma pessoa"
              />
            </LabeledInput>

            <LabeledInput label="Tipo do Periodo:">
              <div class="flex flex-col gap-2">
                <SelectButton
                  v-model="tipoPeriodo"
                  :options="opcoesTipoPeriodo"
                  option-value="value"
                  optionLabel="name"
                />

                <Calendar
                  view="month"
                  v-show="tipoPeriodo == 'mes'"
                  :disabled="buscandoDaApi"
                  v-model="mesSelecionado"
                  dateFormat="mm/yy"
                />

                <Calendar
                  v-show="tipoPeriodo == 'customizado'"
                  selection-mode="range"
                  :manual-input="false"
                  :disabled="buscandoDaApi"
                  v-model="periodoCustomSelecionado"
                  dateFormat="dd/mm/yy"
                />
              </div>
            </LabeledInput>
          </div>

          <Button
            :disabled="
              !temToken ||
              buscandoDaApi ||
              !pessoaSelecionada?.code ||
              !mesSelecionado
            "
            @click="buscarApontamentos"
            label="Buscar da API"
            icon="pi pi-refresh"
            class="mt-3"
          />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import moment from "moment";
import { useToast } from "primevue/usetoast";
import { MovideskAPI } from "@/classes/MovideskAPI";
import { Pessoa, EventoMovidesk } from "@/types/Movidesk";
import LabeledInput from "../utils/LabeledInput.vue";
import useEventBus from "@/composables/useEventBus";
import { useLoading } from "@/composables/useLoading";
import SelectButton from "primevue/selectbutton";
import { useStorage } from "@vueuse/core";

const toast = useToast();
const emit = defineEmits(["updateDadosMovidesk"]);
const { eventBus } = useEventBus();

export type DadosMovidesk = {
  eventos: EventoMovidesk[];
  pessoas: Pessoa[];
  tipoImportacao: "CSV" | "API";
};

const tipo = ref("CSV" as "CSV" | "API");
const buscandoDaApi = ref(false);
if (localStorage.getItem("tipoImportacaoMovidesk"))
  tipo.value = localStorage.getItem("tipoImportacaoMovidesk") as "CSV" | "API";

watch(tipo, () => {
  localStorage.setItem("tipoImportacaoMovidesk", tipo.value);
  dadosMovidesk.value = {
    eventos: [],
    pessoas: [],
    tipoImportacao: tipo.value,
  };

  if (tipo.value == "API") {
    buscarPessoasDesenvolvimento();
  }
});

const dadosMovidesk = ref({
  eventos: [],
  pessoas: [],
  tipoImportacao: tipo.value,
} as DadosMovidesk);

onMounted(() => {
  const dadosMovideskSalvo = localStorage.getItem("dadosMovidesk");
  if (dadosMovideskSalvo) {
    dadosMovidesk.value = JSON.parse(dadosMovideskSalvo);
  }
});

//Importação por API
const movideskAPI = new MovideskAPI();
const inputTokenValue = ref("" as string | null);
const tokenSalvo = ref("" as string | null);
const temToken = ref(false);

eventBus.on("buscar-apontamentos-movidesk", () => {
  if (tipo.value == "API") buscarApontamentos();
});

onUnmounted(() => {
  eventBus.off("buscar-apontamentos-movidesk");
});

const buscarTokenAdmin = () => {
  fetch("/admin/ajax.php?pg=moverino_api&acao=recuperar-token-movidesk")
    .then((response) => response.json())
    .then((data) => {
      if (data?.token) {
        inputTokenValue.value = data.token;
        salvarToken();
      }
    });
};

const bPodeBuscarToken = ref(
  window.location.href.includes("adm.areacentral.com.br")
);

const salvarToken = () => {
  if (!inputTokenValue.value || inputTokenValue.value == "") return;

  toast.add({
    severity: "success",
    summary: "Token salvo com sucesso",
    life: 3000,
  });
  movideskAPI.setToken(inputTokenValue.value);
  inputTokenValue.value = "";
  atualizarToken();
};

const removerToken = () => {
  movideskAPI.removeToken();
  dadosMovidesk.value = {
    eventos: [],
    pessoas: [],
    tipoImportacao: tipo.value,
  };
  toast.add({
    severity: "success",
    summary: "Token removido com sucesso",
    life: 3000,
  });
  inputTokenValue.value = "";
  atualizarToken();
};

const atualizarToken = () => {
  tokenSalvo.value = movideskAPI.getToken();
  temToken.value = tokenSalvo.value != null && tokenSalvo.value != "";

  if (temToken.value) {
    buscarPessoasDesenvolvimento();
  }
};
atualizarToken();

function buscarPessoasDesenvolvimento() {
  if (!temToken.value || buscandoDaApi.value) return;
  buscandoDaApi.value = true;
  movideskAPI.buscarPessoasDesenvolvimento((pessoas, status) => {
    if (status == "error") {
      toast.add({
        severity: "error",
        summary: "Erro ao buscar pessoas",
        detail: "Verifique se o token está correto",
        life: 3000,
      });
      dadosMovidesk.value.pessoas = [];
      buscandoDaApi.value = false;
      return;
    }
    dadosMovidesk.value.pessoas = pessoas;
    buscarPessoaSalva();
    buscandoDaApi.value = false;
  });
}

function buscarPessoaSalva() {
  if (localStorage.getItem("pessoaSelecionadaMovidesk")) {
    pessoaSelecionada.value = JSON.parse(
      localStorage.getItem("pessoaSelecionadaMovidesk") as string
    );
  }
}

function buscarApontamentos() {
  if (
    !temToken.value ||
    buscandoDaApi.value ||
    !pessoaSelecionada.value?.code ||
    !mesSelecionado.value
  )
    return;

  buscandoDaApi.value = true;
  movideskAPI.buscarApontamentos(
    periodoSelecionadoUTC.value.inicio,
    periodoSelecionadoUTC.value.fim,
    pessoaSelecionada.value?.code,
    (eventos, status) => {
      if (status == "error") {
        toast.add({
          severity: "error",
          summary: "Erro ao buscar apontamentos",
          detail: "Verifique se o token está correto",
          life: 3000,
        });
        dadosMovidesk.value.eventos = [];
        buscandoDaApi.value = false;
        return;
      }
      dadosMovidesk.value.eventos = eventos;
      buscandoDaApi.value = false;
    }
  );
}

const opcoesDropdownPessoas = computed(() => {
  const opcoes: { name: string; code: string }[] = [];
  for (const pessoa of dadosMovidesk.value.pessoas) {
    opcoes.push({
      name: pessoa.nome,
      code: pessoa.id,
    });
  }
  return opcoes;
});
const pessoaSelecionada = ref(null as { name: string; code: string } | null);

watch(pessoaSelecionada, () => {
  if (pessoaSelecionada.value) {
    localStorage.setItem(
      "pessoaSelecionadaMovidesk",
      JSON.stringify(pessoaSelecionada.value)
    );
  } else {
    localStorage.removeItem("pessoaSelecionadaMovidesk");
  }
});

const tipoPeriodo = useStorage<"mes" | "semana-atual" | "customizado">(
  "tipo-periodo",
  "semana-atual"
);
const mesSelecionado = ref(moment().startOf("month").toDate() as Date);
const periodoCustomSelecionado = ref<Date[]>([]);
watch(periodoCustomSelecionado, () => {
  localStorage.setItem(
    "periodo-custom-selecionado",
    JSON.stringify(periodoCustomSelecionado.value)
  );
});

if (localStorage.getItem("periodo-custom-selecionado")) {
  const datas = JSON.parse(
    localStorage.getItem("periodo-custom-selecionado") as string
  );
  periodoCustomSelecionado.value = [new Date(datas[0]), new Date(datas[1])];
} else {
  periodoCustomSelecionado.value = [
    moment().startOf("week").toDate(),
    moment().endOf("week").toDate(),
  ];
}

const opcoesTipoPeriodo = [
  { name: "Semana Atual", value: "semana-atual" },
  { name: "Mês", value: "mes" },
  { name: "Customizado", value: "customizado" },
];

const periodoSelecionadoUTC = computed(() => {
  if (tipoPeriodo.value == "semana-atual") {
    const inicio = moment().startOf("week").format("YYYY-MM-DD") + "T00:00:00z";
    const fim = moment().endOf("week").format("YYYY-MM-DD") + "T23:59:59z";
    return { inicio, fim };
  }

  if (
    tipoPeriodo.value == "customizado" &&
    periodoCustomSelecionado.value[0] &&
    periodoCustomSelecionado.value[1]
  ) {
    const inicio =
      moment(periodoCustomSelecionado.value[0]).format("YYYY-MM-DD") +
      "T00:00:00z";
    const fim =
      moment(periodoCustomSelecionado.value[1]).format("YYYY-MM-DD") +
      "T23:59:59z";

    return { inicio, fim };
  }

  //Mes
  const inicio =
    moment(mesSelecionado.value).startOf("month").format("YYYY-MM-DD") +
    "T00:00:00z";
  const fim =
    moment(mesSelecionado.value).endOf("month").format("YYYY-MM-DD") +
    "T23:59:59z";
  return { inicio, fim };
});

//Mostrar Loading quando estiver buscando da API
const { setState } = useLoading();
watch(buscandoDaApi, () => {
  setState(buscandoDaApi.value);
});

//Importação por CSV
const inputCsv = ref(null as HTMLInputElement | null);
const inputCsvChange = () => {
  if (
    !inputCsv.value ||
    !inputCsv.value.files ||
    inputCsv.value?.files[0] == null
  )
    return;

  const reader = new FileReader();
  reader.readAsText(inputCsv.value.files[0]);

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
  const dadosMovideskNovo: DadosMovidesk = {
    eventos: [],
    pessoas: [],
    tipoImportacao: tipo.value,
  };

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
      assunto: linha[6],
      tituloResumido: `${linha[4]} - ${linha[6].slice(0, 20)}`,
      ticket: linha[4],
      data: data,
      inicioHorario: minutoInicio,
      fimHorario: minutoFim,
      categoria: '',
    };

    dadosMovideskNovo.eventos.push(eventoMovidesk);
  });

  dadosMovidesk.value = dadosMovideskNovo;
};

watch(
  [() => dadosMovidesk.value.pessoas, () => dadosMovidesk.value.eventos],
  () => {
    emit("updateDadosMovidesk", dadosMovidesk.value);
    localStorage.setItem("dadosMovidesk", JSON.stringify(dadosMovidesk.value));
  }
);

//Inicialização
onMounted(() => {
  if (tipo.value == "API") {
    buscarPessoasDesenvolvimento();
  }
});
</script>
