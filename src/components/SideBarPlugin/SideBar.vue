<template>
  <v-navigation-drawer
    permanent
    :color="sidebarBackgroundColor"
    :style="sidebarStyle"
    class="sidebar"
    :data-color="sidebarItemColor"
  >
    <!-- Logo Section -->
    <div class="logo pa-4">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <div class="logo-mini mr-3">
          <v-img
            :src="imgLogo"
            max-width="40"
            max-height="40"
            alt="Logo"
          ></v-img>
        </div>
        <span class="logo-normal text-white text-h6">
          {{ title }}
        </span>
      </router-link>
    </div>

    <!-- Sidebar Content -->
    <div class="sidebar-wrapper">
      <slot name="content"></slot>

      <!-- Navigation List -->
      <v-list nav>
        <slot>
          <template
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
          >
            <v-list-item
              :to="link.path"
              :prepend-icon="link.icon"
              :title="link.name"
              :value="link.name"
              color="primary"
            >
              <template v-if="link.badge" #append>
                <v-badge
                  :content="link.badge"
                  :color="link.badgeColor || 'error'"
                  inline
                ></v-badge>
              </template>
            </v-list-item>
          </template>
        </slot>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, provide } from "vue";
import logoMoneyTrack from "@/assets/img/logo_money_track.png";
import sidebarBackground from "@/assets/img/sidebar-2.jpg";

export interface SidebarLink {
  name: string;
  path: string;
  icon?: string;
  badge?: string | number;
  badgeColor?: string;
}

interface Props {
  title?: string;
  sidebarBackgroundImage?: string;
  imgLogo?: string;
  sidebarItemColor?: "purple" | "blue" | "green" | "orange" | "red" | "";
  sidebarBackgroundColor?: string;
  sidebarLinks?: SidebarLink[];
  autoClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Money track",
  sidebarBackgroundImage: sidebarBackground,
  imgLogo: logoMoneyTrack,
  sidebarItemColor: "green",
  sidebarBackgroundColor: "#132030",
  sidebarLinks: () => [],
  autoClose: true,
});

// Validator para sidebarItemColor
const acceptedColors = [
  "",
  "purple",
  "blue",
  "green",
  "orange",
  "red",
] as const;
if (!acceptedColors.includes(props.sidebarItemColor)) {
  console.warn(
    `Invalid sidebarItemColor: ${
      props.sidebarItemColor
    }. Accepted values are: ${acceptedColors.join(", ")}`
  );
}

// Provide autoClose para componentes filhos
provide("autoClose", props.autoClose);

// Computed style para background
const sidebarStyle = computed(() => ({
  backgroundImage: props.sidebarBackgroundImage
    ? `url(${props.sidebarBackgroundImage})`
    : "none",
  backgroundColor: props.sidebarBackgroundColor,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));
</script>

<style scoped>
.sidebar {
  background-color: v-bind(sidebarBackgroundColor);
}

.logo {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-mini {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-normal {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar-wrapper {
  height: calc(100% - 80px);
  overflow-y: auto;
}

/* Scrollbar customization */
.sidebar-wrapper::-webkit-scrollbar {
  width: 6px;
}

.sidebar-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media screen and (min-width: 991px) {
  .nav-mobile-menu {
    display: none;
  }
}
</style>
