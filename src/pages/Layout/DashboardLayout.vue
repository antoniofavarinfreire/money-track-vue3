<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :color="sidebarBackground"
      app
      floating
      width="260"
    >
      <!-- <mobile-menu /> -->
      <v-list>
        <v-list-item link :to="'/app/dashboard'" active-class="active-item">
          <template v-slot:prepend>
            <v-icon>mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item link :to="'/app/table'" active-class="active-item">
          <template v-slot:prepend>
            <v-icon>mdi-content-paste</v-icon>
          </template>
          <v-list-item-title>Registro de gastos</v-list-item-title>
        </v-list-item>

        <v-list-item link :to="'/app/typography'" active-class="active-item">
          <template v-slot:prepend>
            <v-icon>mdi-library-books</v-icon>
          </template>
          <v-list-item-title>Typography</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <TopNavBar />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TopNavBar from "@/components/TopNavBar/TopNavBar.vue";
export default defineComponent({
  name: "DashboardLayout",
  components: {
    TopNavBar,
  },
  setup() {
    const drawer = ref(true);
    const sidebarBackground = ref("black");

    return {
      drawer,
      sidebarBackground,
    };
  },
});
</script>

<style scoped>
.active-item {
  background-color: #4caf50 !important; /* verde */
  color: white !important;
}

.active-item .v-icon {
  color: white !important;
}

.active-item .v-list-item-title {
  color: white !important;
}
</style>
