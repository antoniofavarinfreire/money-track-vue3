<template>
  <SimpleTable />
</template>
<script lang="ts">
import SimpleTable from "@/components/Tables/SimpleTable.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableList",
  components: {
    SimpleTable,
  },
});
</script>
