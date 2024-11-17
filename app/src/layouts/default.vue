<template>
  <ClientOnly>
    <v-responsive class="border rounded">
      <v-app>
        <v-app-bar color="#922217" prominent>
          <v-app-bar-nav-icon v-if="showBackButton" icon="mdi-chevron-left" @click="back"></v-app-bar-nav-icon>
          <!-- <v-app-bar-nav-icon variant="text" @click.stop="isDrawerOpen = !isDrawerOpen" /> -->
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu v-if="$slots['menu']">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text"></v-btn>
            </template>
            <v-list>
              <slot name="menu"></slot>
            </v-list>
          </v-menu>
        </v-app-bar>

        <!-- <v-navigation-drawer v-model="isDrawerOpen" temporary>
         <v-list :items="['1', '2']"></v-list>
       </v-navigation-drawer> -->

        <v-main class="flex-1">
          <!-- <v-container> -->
          <slot />
          <!-- </v-container> -->
        </v-main>

        <v-bottom-navigation grow bg-color="#922217">
          <slot name="bottom"></slot>
        </v-bottom-navigation>
      </v-app>
    </v-responsive>
  </ClientOnly>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'Logbuch' },
  showBackButton: { type: Boolean, default: true },
})

const { back } = useRouter()

// const isDrawerOpen = ref(false)
</script>

<style lang="css">
body {
  background-color: #922217;
}

.app {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
