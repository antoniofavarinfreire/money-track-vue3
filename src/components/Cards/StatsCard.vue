<template>
  <v-card>
    <v-card-title
      class="card-stats"
      :style="{ BackgroundColor: dataBackgroundColor }"
    >
    </v-card-title>

    <v-card-text>
      <slot name="content"></slot>
    </v-card-text>

    <v-card-action>
      <slot name="footer"></slot>
    </v-card-action>
  </v-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "StatsCard",
});
</script>
