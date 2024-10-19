<template>
  <ClientOnly>
    <v-app class="h-100">
      <v-card class="h-100" :rounded="false">
        <v-layout class="h-100">
          <v-app-bar color="#922217" prominent>
            <!-- <v-app-bar-nav-icon variant="text" @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon> -->
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="$vuetify.display.mdAndUp">
              <v-btn icon="mdi-magnify" variant="text"></v-btn>
              <v-btn icon="mdi-filter" variant="text"></v-btn>
            </template>

            <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
          </v-app-bar>

          <!-- <v-navigation-drawer v-model="isDrawerOpen" temporary>
            <v-list :items="['1', '2']"></v-list>
          </v-navigation-drawer> -->

          <v-main style="height: 100%">
            <v-card-text class="h-100"><slot></slot></v-card-text>
          </v-main>
        </v-layout>
      </v-card>
    </v-app>
  </ClientOnly>
</template>

<style lang="css">
body {
  background-color: #922217;
}
</style>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'Logbuch' },
})

const isDrawerOpen = ref(false)
</script>
