<template>
  User
  <v-btn @click="temp()">fetch</v-btn>
</template>

<script setup lang="ts">
const { $client } = useNuxtApp()

const temp = async () => $client.user.current.query()
</script>
