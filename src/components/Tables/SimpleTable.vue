<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="items">
          <template #item.monetary="{ item }">
            <span :class="item.monetary < 0 ? 'text-error' : 'text-success'">
              {{ formatCurrency(item.monetary) }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SimpleTable",
  data() {
    const headers = [
      {
        title: "data",
        aling: "start",
        sortable: false,
        key: "date",
      },
      {
        title: "Descrição",
        key: "description",
      },
      {
        title: "Conta",
        key: "bill",
      },
      {
        title: "Valor",
        key: "monetary",
      },
      {
        title: "Origem Financeira",
        key: "financialSource",
      },
    ];
    const items = [
      {
        date: "2025-10-20", // Corresponde a 'date'
        description: "Pagamento de Aluguel", // Corresponde a 'description'
        bill: "Conta Corrente X", // Corresponde a 'bill'
        monetary: -1500.0, // Corresponde a 'monetary'
        financialSource: "Despesa", // Corresponde a 'financialSource'
      },
      {
        date: "2025-10-21",
        description: "Venda de Produto A",
        bill: "Conta Poupança Y",
        monetary: 450.5,
        financialSource: "Receita",
      },
      {
        date: "2025-10-22",
        description: "Reembolso de Despesas",
        bill: "Conta Corrente X",
        monetary: 120.0,
        financialSource: "Receita",
      },
      {
        date: "2025-10-23",
        description: "Compra de Material de Escritório",
        bill: "Cartão de Crédito Z",
        monetary: -85.9,
        financialSource: "Despesa",
      },
    ];
    return {
      headers,
      items,
    };
  },
  methods: {
    formatCurrency(value: number) {
      if (typeof value !== "number") return value;

      // Usa a API Intl.NumberFormat para formatação de moeda
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL", // Define a moeda como Real Brasileiro
      }).format(value);
    },
  },
});
</script>
