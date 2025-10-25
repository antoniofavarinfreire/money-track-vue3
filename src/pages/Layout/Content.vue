<template>
  <!-- Vuetify 3 já fornece transições prontas -->
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RouteTransition",
});
</script>

<style scoped>
/* Se quiser customizar ainda mais a duração da transição */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition-duration: 0.1s !important;
}
</style>
