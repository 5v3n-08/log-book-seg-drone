<template>
  <NuxtLayout name="default" title="Erstellen">
    <template #bottom>
      <v-btn :disabled="isLoading" @click="back">
        <v-icon>mdi-close</v-icon>
        <span>Abbrechen</span>
      </v-btn>
      <v-btn :disabled="isFormLoading" :loading="isLoading" @click="onSubmit">
        <v-icon>mdi-content-save</v-icon>
        <span>Speichern</span>
      </v-btn>
    </template>
    <form-log-book @update:form="onUpdateForm" @update:loading="isFormLoading = $event" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FromDataType } from '~/components/form-log-book.vue'
import { tryCatchAsync } from '~/services/utils/utils.helper'

definePageMeta({ layout: false })

const { back } = useRouter()
const { $client } = useNuxtApp()

const isLoading = ref(false)
const isFormLoading = ref(false)
const state = reactive<{ form: FromDataType | undefined }>({ form: undefined })

const onUpdateForm = (value: FromDataType) => (state.form = value)

const onSubmit = async () => {
  isLoading.value = true
  const { error } = await tryCatchAsync(() => {
    if (!state.form) throw new Error('NO FORM')
    return $client.logBook.create.mutate({
      flights: (state.form.flights ?? []).map((i) => ({ start: i.start.toISOString(), end: i.end.toISOString() })),
      type: state.form.type,
      isFlightModeAutomatic: state.form.options?.includes('automatic'),
      isFlightModeManuel: state.form.options?.includes('manuel'),
      isNightFlight: state.form.options?.includes('night'),
      location: state.form.location,
      lat: (state.form.coordinates?.lat ?? 0) > 0 ? state.form.coordinates?.lat : undefined,
      lng: (state.form.coordinates?.lng ?? 0) > 0 ? state.form.coordinates?.lng : undefined,
    })
  })
  if (error) {
    console.error(error)
  }
  isLoading.value = false
  back()
}
</script>

<style lang="css" scoped></style>
