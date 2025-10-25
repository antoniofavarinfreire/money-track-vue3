<template>
  <v-card>
    <v-card-title
      class="card-chart"
      :style="{ backgroundColor: dataBackgroundColor }"
    >
    </v-card-title>

    <v-card-text>
      <slot name="content"></slot>
    </v-card-text>

    <v-card-actions>
      <slot name="footer"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChartCard",
});
</script>
