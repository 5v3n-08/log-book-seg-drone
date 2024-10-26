<template>
  <NuxtLayout name="default" title="Neuer Eintrag">
    <template #bottom>
      <v-btn :disabled="isLoading" @click="back">
        <v-icon>mdi-close</v-icon>
        <span>Abbrechen</span>
      </v-btn>
      <v-btn :disabled="isLoadingGeocode" :loading="isLoading" @click="onSubmit">
        <v-icon>mdi-content-save</v-icon>
        <span>Speichern</span>
      </v-btn>
    </template>

    <v-container class="h-100">
      <div class="d-flex justify-space-between">
        <h4>Flugzeiten</h4>
        <span>{{ flightTime }}</span>
      </div>
      <v-row class="mt-2">
        <v-col cols="12" class="pa-0">
          <v-text-field
            label="Startdatum"
            density="comfortable"
            :model-value="format(formData.start, 'dd.MM.yyyy')"
            :active="modalState.date"
            :focused="modalState.date"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            @click="modalState.date = true"
          >
            <v-dialog v-model="modalState.date" activator="parent" width="auto">
              <v-date-picker v-if="modalState.date" :model-value="formData.start" @update:model-value="onUpdateDate" />
            </v-dialog>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pa-0">
          <v-text-field
            label="Startzeit"
            density="comfortable"
            :model-value="format(formData.start, 'HH:mm')"
            :active="modalState.timeStart"
            :focused="modalState.timeStart"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            @click="modalState.timeStart = true"
          >
            <v-dialog v-model="modalState.timeStart" activator="parent" width="auto">
              <v-time-picker
                v-if="modalState.timeStart"
                :model-value="formData.start"
                format="24hr"
                @update:hour="onUpdateTime($event, 'hours')"
                @update:minute="onUpdateTime($event, 'minutes')"
              />
            </v-dialog>
          </v-text-field>
        </v-col>
        <v-col cols="6" class="pa-0">
          <v-text-field
            label="Startzeit"
            density="comfortable"
            :model-value="format(formData.end, 'HH:mm')"
            :active="modalState.timeEnd"
            :focused="modalState.timeEnd"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            @click="modalState.timeEnd = true"
          >
            <v-dialog v-model="modalState.timeEnd" activator="parent" width="auto">
              <v-time-picker
                v-if="modalState.timeEnd"
                :model-value="formData.end"
                format="24hr"
                @update:hour="onUpdateTime($event, 'hours')"
                @update:minute="onUpdateTime($event, 'minutes')"
              />
            </v-dialog>
          </v-text-field>
        </v-col>
      </v-row>
      <v-divider class="mt-2 mb-4"></v-divider>
      <v-row>
        <v-col>
          <v-btn-toggle v-model="formData.type" divided class="w-100" mandatory>
            <v-btn color="error" class="w-50" variant="tonal" value="training">Übung</v-btn>
            <v-btn color="error" variant="tonal" class="w-50" value="operation">Einsatz</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row v-if="formData.type === 'training'">
        <v-col>
          <v-text-field
            v-model="formData.location"
            :loading="isLoadingGeocode"
            density="comfortable"
            label="Übungsort"
            hide-details
          />
          <v-btn
            class="mt-2"
            block
            :loading="isLoadingGeocode"
            variant="text"
            density="compact"
            @click="loadGeocodeReverse"
          >
            <v-icon size="small" class="mr-2">mdi-crosshairs-gps</v-icon>
            <small>Position bestimmen</small>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-2 mb-4"></v-divider>
      <v-chip-group v-model="formData.options" column multiple mandatory>
        <v-chip color="error" text="Manuell" value="manuel" variant="tonal" filter></v-chip>
        <v-chip color="error" text="Automatisch" value="automatic" variant="tonal" filter></v-chip>
        <v-chip color="error" text="Nachtflug" value="night" variant="tonal" filter></v-chip>
      </v-chip-group>
    </v-container>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { format, subMinutes } from 'date-fns'
import { tryCatchAsync } from '~/services/utils/utils.helper'

interface FromDataType {
  start: Date
  end: Date
  type: 'training' | 'operation'
  options: ('manuel' | 'automatic' | 'night')[]
  coordinates: { lat: number; lng: number }
  location: string | undefined
}

definePageMeta({ layout: false })
defineComponent({ VTimePicker })

const { back } = useRouter()
const { $client } = useNuxtApp()

const modalState = reactive({
  date: false,
  timeStart: false,
  timeEnd: false,
})

const isLoading = ref(false)
const isLoadingGeocode = ref(false)
const formData = reactive<FromDataType>({
  start: subMinutes(new Date(), 30),
  end: new Date(),
  type: 'training',
  options: ['manuel'],
  coordinates: { lat: 0, lng: 0 },
  location: undefined,
})

// const isEndTimeModalOpen = ref(false)

const onUpdateTime = (value: number, type: 'hours' | 'minutes') => {
  if (modalState.timeStart) {
    if (type === 'hours') formData.start = new Date(formData.start.setHours(value))
    if (type === 'minutes') formData.start = new Date(formData.start.setMinutes(value))
  } else {
    if (type === 'hours') formData.end = new Date(formData.end.setHours(value))
    if (type === 'minutes') formData.end = new Date(formData.end.setMinutes(value))
  }
}

const onUpdateDate = (value: Date) => {
  value.setHours(formData.start.getHours())
  value.setMinutes(formData.start.getMinutes())
  formData.start = new Date(value)

  value.setHours(formData.end.getHours())
  value.setMinutes(formData.end.getMinutes())
  formData.end = new Date(value)
}

const onSubmit = async () => {
  isLoading.value = true
  const { error } = await tryCatchAsync(() =>
    $client.logBook.create.mutate({
      start: formData.start,
      end: formData.end,
      type: formData.type,
      isFlightModeAutomatic: formData.options.includes('automatic'),
      isFlightModeManuel: formData.options.includes('manuel'),
      isNightFlight: formData.options.includes('night'),
      location: formData.location,
      lat: formData.coordinates.lat > 0 ? formData.coordinates.lat : undefined,
      lng: formData.coordinates.lng > 0 ? formData.coordinates.lng : undefined,
    })
  )
  if (error) {
    console.error(error)
  }
  isLoading.value = false
  back()
}

const loadGeocodeReverse = () => {
  isLoadingGeocode.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { result } = await tryCatchAsync(() =>
          $client.logBook.location.mutate({
            lat: coords.latitude,
            lng: coords.longitude,
          })
        )

        if (result) {
          formData.location = result.address
          formData.coordinates.lat = result.lat
          formData.coordinates.lng = result.lng
        }

        isLoadingGeocode.value = false
      },
      (error) => {
        console.error(error)

        isLoadingGeocode.value = false
      }
    )
  }
}

const flightTime = computed(() => `${((formData.end.getTime() - formData.start.getTime()) / 1000 / 60).toFixed(0)} min`)
</script>

<style lang="css" scoped></style>
