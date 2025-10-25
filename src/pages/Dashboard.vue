<template>
  <v-container fluid>
    <v-row>
      <!-- Daily Sales -->
      <v-col cols="12" md="4">
        <ChartCard
          :chart-data="dailySalesChart.data"
          :chart-options="dailySalesChart.options"
          chart-type="Line"
          color="blue"
        >
          <template #content>
            <h4 class="title">Daily Sales</h4>
            <p class="category">
              <span class="text-success">
                <v-icon>mdi-arrow-up-bold</v-icon> 55%
              </span>
              increase in today's sales.
            </p>
          </template>
          <template #footer>
            <div class="stats">
              <v-icon>mdi-clock-time-four-outline</v-icon> updated 4 minutes ago
            </div>
          </template>
        </ChartCard>
      </v-col>

      <!-- Email Subscription -->
      <v-col cols="12" md="4">
        <ChartCard
          :chart-data="emailsSubscriptionChart.data"
          :chart-options="emailsSubscriptionChart.options"
          :chart-responsive-options="emailsSubscriptionChart.responsiveOptions"
          chart-type="Bar"
          color="red"
        >
          <template #content>
            <h4 class="title">Email Subscription</h4>
            <p class="category">Last Campaign Performance</p>
          </template>
          <template #footer>
            <div class="stats">
              <v-icon>mdi-clock-time-four-outline</v-icon> updated 10 days ago
            </div>
          </template>
        </ChartCard>
      </v-col>

      <!-- Completed Tasks -->
      <v-col cols="12" md="4">
        <ChartCard
          :chart-data="dataCompletedTasksChart.data"
          :chart-options="dataCompletedTasksChart.options"
          chart-type="Line"
          color="green"
        >
          <template #content>
            <h4 class="title">Completed Tasks</h4>
            <p class="category">Last Campaign Performance</p>
          </template>
          <template #footer>
            <div class="stats">
              <v-icon>mdi-clock-time-four-outline</v-icon> campaign sent 26
              minutes ago
            </div>
          </template>
        </ChartCard>
      </v-col>
    </v-row>

    <v-row>
      <!-- Stats Cards -->
      <v-col cols="12" md="3">
        <StatsCard color="green">
          <template #header>
            <v-icon>mdi-store</v-icon>
          </template>
          <template #content>
            <p class="category">Revenue</p>
            <h3 class="title">$34,245</h3>
          </template>
          <template #footer>
            <div class="stats">
              <v-icon>mdi-calendar-range</v-icon> Last 24 Hours
            </div>
          </template>
        </StatsCard>
      </v-col>

      <v-col cols="12" md="3">
        <StatsCard color="orange">
          <template #header>
            <v-icon>mdi-content-copy</v-icon>
          </template>
          <template #content>
            <p class="category">Used Space</p>
            <h3 class="title">49/50 <small>GB</small></h3>
          </template>
          <template #footer>
            <div class="stats">
              <v-icon color="red">mdi-alert</v-icon>
              <a href="#">Get More Space...</a>
            </div>
          </template>
        </StatsCard>
      </v-col>

      <v-col cols="12" md="3">
        <StatsCard color="red">
          <template #header>
            <v-icon>mdi-information-outline</v-icon>
          </template>
          <template #content>
            <p class="category">Fixed Issues</p>
            <h3 class="title">75</h3>
          </template>
          <template #footer>
            <div class="stats">
              <v-icon>mdi-tag</v-icon> Tracked from Github
            </div>
          </template>
        </StatsCard>
      </v-col>

      <v-col cols="12" md="3">
        <StatsCard color="blue">
          <template #header>
            <i class="fab fa-twitter"></i>
          </template>
          <template #content>
            <p class="category">Followers</p>
            <h3 class="title">+245</h3>
          </template>
          <template #footer>
            <div class="stats"><v-icon>mdi-update</v-icon> Just Updated</div>
          </template>
        </StatsCard>
      </v-col>
    </v-row>

    <!-- Employees Table -->
    <v-row>
      <v-col cols="12" md="6">
        <OrderedTable table-header-color="orange" />
      </v-col>

      <v-col cols="12" md="6">
        <!-- <NavTabsCard>
          <template #content>
            <span class="md-nav-tabs-title">Tasks:</span>
            <v-tabs v-model="tab" background-color="green" align-with-title>
              <v-tab value="bugs" icon="mdi-bug">Bugs</v-tab>
              <v-tab value="website" icon="mdi-code-tags">Website</v-tab>
              <v-tab value="server" icon="mdi-cloud">Server</v-tab>

              <v-tab-item value="bugs">
                <NavTabsTable />
              </v-tab-item>
              <v-tab-item value="website">
                <NavTabsTable />
              </v-tab-item>
              <v-tab-item value="server">
                <NavTabsTable />
              </v-tab-item>
            </v-tabs>
          </template>
        </NavTabsCard> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { StatsCard, ChartCard, NavTabsCard, NavTabsTable, OrderedTable } from "@/components";
import ChartCard from "@/components/Cards/ChartCard.vue";
import StatsCard from "@/components/Cards/StatsCard.vue";
import OrderedTable from "@/components/Tables/OrderedTable.vue";

interface ChartData {
  labels: string[];
  series: number[][];
}

interface ChartOptions {
  lineSmooth?: any;
  low?: number;
  high?: number;
  chartPadding?: Record<string, number>;
  axisX?: Record<string, unknown>;
}

export default defineComponent({
  name: "Dashboard",
  components: {
    ChartCard,
    StatsCard,
    // NavTabsCard,
    // NavTabsTable,
    OrderedTable,
  },
  setup() {
    const tab = ref("bugs");

    const dailySalesChart = {
      data: {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        series: [[12, 17, 7, 17, 23, 18, 38]],
      } as ChartData,
      options: {
        lineSmooth: undefined, // Chartist interpolation
        low: 0,
        high: 50,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      } as ChartOptions,
    };

    const dataCompletedTasksChart = {
      data: {
        labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
        series: [[230, 750, 450, 300, 280, 240, 200, 190]],
      } as ChartData,
      options: {
        lineSmooth: undefined,
        low: 0,
        high: 1000,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      } as ChartOptions,
    };

    const emailsSubscriptionChart = {
      data: {
        labels: [
          "Ja",
          "Fe",
          "Ma",
          "Ap",
          "Mai",
          "Ju",
          "Jul",
          "Au",
          "Se",
          "Oc",
          "No",
          "De",
        ],
        series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]],
      } as ChartData,
      options: {
        axisX: { showGrid: false },
        low: 0,
        high: 1000,
        chartPadding: { top: 0, right: 5, bottom: 0, left: 0 },
      } as ChartOptions,
      responsiveOptions: [
        [
          "screen and (max-width: 640px)",
          {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: (value: string) => value[0],
            },
          },
        ],
      ],
    };

    return {
      tab,
      dailySalesChart,
      dataCompletedTasksChart,
      emailsSubscriptionChart,
    };
  },
});
</script>

<style scoped>
.title {
  margin: 0;
}
.category {
  margin: 0;
}
.stats {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
