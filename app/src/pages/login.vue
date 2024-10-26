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
            v-model="password"
            type="password"
            density="comfortable"
            :min="4"
            label="Passwort"
          ></v-text-field>
          <v-text-field
            v-if="!isLoginMode"
            v-model="passwordConfirm"
            type="password"
            density="comfortable"
            :min="4"
            label="Passwort bestätigen"
          ></v-text-field>
          <v-alert v-if="errorMessage" density="comfortable" class="mb-4" type="error" variant="tonal">
            {{ errorMessage }}
          </v-alert>
          <v-btn variant="tonal" :disabled="!isLoginMode && password !== passwordConfirm" block @click="handleSubmit">
            {{ isLoginMode ? 'Anmelden' : 'Registrieren' }}
          </v-btn>
          <v-btn variant="text" block size="small" class="mt-2" @click="isLoginMode = !isLoginMode">
            {{ isLoginMode ? 'Registrieren' : 'Anmelden' }}
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

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
const passwordConfirm = ref<string>('')
const isLoginMode = ref(true)
const errorMessage = ref<string>()

const handleSubmit = async () => {
  return isLoginMode.value ? login() : register()
}

const register = async () => {
  errorMessage.value = undefined
  const { error, result } = await tryCatchAsync(() =>
    $client.user.register.mutate({ email: email.value, password: password.value })
  )
  if (error) {
    errorMessage.value = error?.message
  }

  if (result?.success) {
    setAuthUser({ ...result.user })
    push({ name: 'index' })
  }
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

<style lang="css" scoped>
.bg-image {
  position: absolute;
  background-image: url(screensaver.jpg);
  background-position: center;
  height: 100%;
  width: 100%;
}
</style>
