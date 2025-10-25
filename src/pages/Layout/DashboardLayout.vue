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
      <div class="d-flex align-center mt-5 mb-5">
        <v-img
          src="../../assets/imgs/logo_money_track.png"
          alt="Money Track Logo"
          max-height="6vh"
          max-width="6vw"
          contain
        />
        <span style="font-size: 20px">Money track</span>
      </div>

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
          <v-list-item-title>Movimentação Financeira</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <TopNavBar />
        <Content />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TopNavBar from "@/components/TopNavBar/TopNavBar.vue";
import Content from "./Content.vue";
export default defineComponent({
  name: "DashboardLayout",
  components: {
    TopNavBar,
    Content,
  },
  setup() {
    const drawer = ref(true);
    const sidebarBackground = ref("#1b1f23");

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
