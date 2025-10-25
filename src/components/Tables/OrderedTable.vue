<template>
  <v-card class="mx-auto" elevation="5">
    <v-card-text
      class="text-h5 font-weight-bold text-white pa-4"
      style="background-color: #ff9800; border-radius: 4px 4px 0 0"
    >
      Employees Stats

      <div class="text-subtitle-1 font-weight-regular mt-1">
        New employees on 15th September, 2016
      </div>
    </v-card-text>

    <v-table>
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="text-left font-weight-bold"
            :style="{ color: '#ff9800' }"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in employees" :key="item.id" class="v-table-row">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.salary }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.city }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import type { Employee } from '@/types/employee'; // Ajuste o caminho conforme sua estrutura

// Definição dos Cabeçalhos da Tabela (v-table no Vuetify 3 usa 'title' e 'key')

interface Employee {
  id: number;
  name: string;
  salary: string;
  country: string;
  city: string;
}

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Name", key: "name" },
  { title: "Salary", key: "salary" },
  { title: "Country", key: "country" },
  { title: "City", key: "city" },
]);

// Dados da Tabela
const employees = ref<Employee[]>([
  {
    id: 1,
    name: "Dakota Rice",
    salary: "$36,738",
    country: "Niger",
    city: "Oud-Turnhout",
  },
  {
    id: 2,
    name: "Minerva Hooper",
    salary: "$23,738",
    country: "Curaçao",
    city: "Sinaai-Waas",
  },
  {
    id: 3,
    name: "Sage Rodriguez",
    salary: "$56,142",
    country: "Netherlands",
    city: "Overland Park",
  },
  {
    id: 4,
    name: "Philip Chaney",
    salary: "$38,735",
    country: "Korea, South",
    city: "Gloucester",
  },
]);
</script>

<style scoped>
/* Estilo para simular as linhas divisórias do corpo da tabela */
/* O v-table do Vuetify geralmente já tem uma linha, mas podemos garantir ou ajustar */
.v-table-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
/* A última linha normalmente não tem borda, mas é opcional */
.v-table-row:last-child {
  border-bottom: none;
}
</style>
