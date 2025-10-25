<template>
  <v-app-bar flat class="transparent-app-bar">
    <v-row>
      <v-col cols="11">
        <div class="d-flex align-center">
          <v-toolbar-title class="text-h6">{{ routeName }}</v-toolbar-title>
        </div>
      </v-col>
      <v-col cols="1">
        <div class="d-flex align-center">
          <v-list class="d-flex pa-0">
            <v-list-item href="#/user" class="pa-0">
              <v-btn icon variant="text" aria-label="User Profile">
                <v-icon>mdi-account</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router"; // Assuming you are using vue-router

const route = useRoute();

const routeName = computed(() => {
  return String(route.name || "Application Title");
});
</script>
