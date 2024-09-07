<template>
  <NuxtLayout name="default" title="Neuer Eintrag">
    <v-container>
      <v-text-field />
      sdnpm
      {{ coords }}
      {{ error?.message }}
    </v-container>
  </NuxtLayout>
</template>

<style lang="css" scoped></style>

<script setup lang="ts">
import { useGeolocation } from '@vueuse/core'

definePageMeta({ layout: false })

const { back } = useRouter()
const { coords, error } = useGeolocation()

watch(coords, (value) => console.log(value))
</script>
