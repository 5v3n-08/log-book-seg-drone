<template>
  <NuxtLayout name="default" title="Logbuch">
    <v-fab class="fab" absolute color="success" icon="$plus" @click="createNewLog"></v-fab>
  </NuxtLayout>
</template>

<style lang="css" scoped>
/* .fab {
  position: absolute;
  bottom: 35px;
  right: 55px;
} */
</style>

<script setup lang="ts">
definePageMeta({ layout: false })

const { push } = useRouter()
const createNewLog = () => push({ name: 'create' })
</script>
