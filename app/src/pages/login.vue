<template>
  <div class="bg-image">
    <div class="d-flex justify-center align-center h-100">
      <v-card width="300">
        <v-card-title class="text-center">SEG - Drohne</v-card-title>
        <v-card-text>
          <div class="text-center">
            <small>Bitte melde dich mit deinen Zugangsdaten an, um deine Logbücher zuzugreifen.</small>
          </div>
          <v-text-field v-model="email" density="comfortable" label="E-Mail" class="mt-2"></v-text-field>
          <v-text-field
            type="password"
            density="comfortable"
            v-model="password"
            :min="4"
            label="Passwort"
          ></v-text-field>
          <v-alert v-if="errorMessage" density="comfortable" class="mb-4" type="error" variant="tonal">
            {{ errorMessage }}</v-alert
          >
          <v-btn @click="login" variant="tonal" block>Anmelden</v-btn>
          <v-btn @click="register" variant="tonal" block>Registrieren</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style lang="css" scoped>
.bg-image {
  position: absolute;
  background-image: url(screensaver.jpg);
  background-position: center;
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
import { tryCatchAsync } from '~/services/utils/utils.helper'

definePageMeta({
  layout: 'blank',
})

const { $client } = useNuxtApp()
const { push } = useRouter()
const { setAuthUser } = useAuthUser()

const email = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>()

const register = async () => {
  errorMessage.value = undefined
  const { error, result } = await tryCatchAsync(() =>
    $client.user.register.mutate({ email: email.value, password: password.value })
  )
}

const login = async () => {
  errorMessage.value = undefined
  const { error, result } = await tryCatchAsync(() =>
    $client.user.login.mutate({ email: email.value, password: password.value })
  )
  if (result?.success) {
    setAuthUser({ ...result.user })
    push({ name: 'index' })
  }

  if (error?.message.includes('Invalid credentials')) {
    errorMessage.value = 'Ungültige Zugangsdaten, bitte versuchen Sie es erneut.'
  } else if (error?.message.includes('Invalid email')) {
    errorMessage.value = 'Ungültige E-Mail!'
  } else {
    errorMessage.value = error?.message
  }
}
</script>
