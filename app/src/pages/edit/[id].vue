<template>
  <NuxtLayout name="default" title="Bearbeiten">
    <template #bottom>
      <v-btn :disabled="isFormLoading" @click="isConfirmDeleteDialogOpen = true">
        <v-icon>mdi-delete</v-icon>
        <span>Löschen</span>
      </v-btn>
      <v-btn :disabled="isLoading" @click="back">
        <v-icon>mdi-close</v-icon>
        <span>Abbrechen</span>
      </v-btn>
      <v-btn :disabled="isFormLoading" :loading="isLoading" @click="onSubmit">
        <v-icon>mdi-content-save</v-icon>
        <span>Speichern</span>
      </v-btn>
    </template>
    <form-log-book
      :edit-id="params.id.toString()"
      @update:form="onUpdateForm"
      @update:loading="isFormLoading = $event"
    />
    <v-dialog v-model="isConfirmDeleteDialogOpen">
      <v-card>
        <v-card-text> Möchten Sie diesen Eintrag <b>unwiderruflich</b> löschen? </v-card-text>

        <v-card-actions>
          <v-btn text="Abbrechen" @click="isConfirmDeleteDialogOpen = false"></v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" text="Löschen" @click="onDelete"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FromDataType } from '~/components/form-log-book.vue'
import { tryCatchAsync } from '~/services/utils/utils.helper'

definePageMeta({ layout: false })

const { params } = useRoute()
const { back } = useRouter()
const { $client } = useNuxtApp()

const isLoading = ref(false)
const isFormLoading = ref(false)
const isConfirmDeleteDialogOpen = ref(false)
const state = reactive<{ form: Partial<FromDataType> }>({ form: {} })

const onUpdateForm = (value: FromDataType) => (state.form = value)

const onDelete = async () => {
  isLoading.value = true
  const { error } = await tryCatchAsync(() => $client.logBook.delete.query({ id: params.id.toString() }))
  if (error) {
    console.error(error)
  }
  isLoading.value = false
  isConfirmDeleteDialogOpen.value = false
  back()
}

const onSubmit = async () => {
  isLoading.value = true
  const { error } = await tryCatchAsync(() =>
    $client.logBook.update.mutate({
      id: params.id.toString(),
      flights: (state.form.flights ?? []).map((i) => ({ start: i.start.toISOString(), end: i.end.toISOString() })),
      type: state.form.type,
      isFlightModeAutomatic: state.form.options?.includes('automatic'),
      isFlightModeManuel: state.form.options?.includes('manuel'),
      isNightFlight: state.form.options?.includes('night'),
      location: state.form.location,
      lat: (state.form.coordinates?.lat ?? 0) > 0 ? state.form.coordinates?.lat : undefined,
      lng: (state.form.coordinates?.lng ?? 0) > 0 ? state.form.coordinates?.lng : undefined,
    })
  )
  if (error) {
    console.error(error)
  }
  isLoading.value = false
  back()
}
</script>

<style lang="css" scoped></style>
