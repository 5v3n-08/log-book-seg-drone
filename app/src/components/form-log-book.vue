<template>
  <v-container v-if="status === 'idle' || status === 'success'" class="h-100">
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-text-field
          label="Startdatum"
          density="comfortable"
          :model-value="format(formData.flights[0].start, 'dd.MM.yyyy')"
          :active="modalState.date"
          :focused="modalState.date"
          prepend-inner-icon="mdi-clock-time-four-outline"
          readonly
          @click="modalState.date = true"
        >
          <v-dialog v-model="modalState.date" activator="parent" width="auto">
            <v-date-picker
              v-if="modalState.date"
              :model-value="formData.flights[0].start"
              @update:model-value="onUpdateDate"
            >
              <template #actions>
                <v-btn class="mt-4" block @click="modalState.date = false">Speichern</v-btn>
              </template>
            </v-date-picker>
          </v-dialog>
        </v-text-field>
      </v-col>
    </v-row>
    <v-list>
      <v-list-item v-for="({ start, end }, index) in formData.flights" :key="index" class="px-0">
        <v-row>
          <v-col cols="5" class="px-0">
            <v-text-field
              label="Startzeit"
              density="comfortable"
              :model-value="format(start, 'HH:mm')"
              hide-details
              readonly
              @click="
                () => {
                  selectedIndex = index
                  selectedType = 'start'
                  modalState.time = true
                }
              "
            >
            </v-text-field>
          </v-col>
          <v-col cols="7" class="px-0">
            <v-text-field
              label="Endzeit"
              density="comfortable"
              :model-value="format(end, 'HH:mm')"
              class="text-center"
              hide-details
              readonly
              @click="
                () => {
                  selectedIndex = index
                  selectedType = 'end'
                  modalState.time = true
                }
              "
            >
              <template #append-inner>
                <v-btn
                  color="error"
                  size="small"
                  variant="text"
                  class="h-100"
                  density="comfortable"
                  :disabled="formData.flights.length <= 1"
                  @click.stop="onRemoveFlight(index)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-list-item>
      <small class="d-flex justify-space-between w-100 text-center">
        Flugzeit: <b>{{ flightTime }}</b>
      </small>
    </v-list>
    <v-btn class="mt-2" block size="small" variant="tonal" @click="onAddFlight">Hinzufügen</v-btn>
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
    <v-dialog v-model="modalState.time" width="auto">
      <v-card>
        <v-time-picker
          v-if="modalState.time && selectedIndex !== undefined && selectedType"
          :model-value="formData.flights[selectedIndex][selectedType]"
          format="24hr"
          @update:hour="onUpdateTime($event, 'hours', selectedIndex, selectedType)"
          @update:minute="onUpdateTime($event, 'minutes', selectedIndex, selectedType)"
        >
          <template #actions>
            <v-btn class="mt-4" block @click="modalState.time = false">Speichern</v-btn>
          </template>
        </v-time-picker>
      </v-card>
    </v-dialog>
  </v-container>
  <v-container v-else-if="status === 'pending'" class="h-100 d-flex flex-column justify-center align-center">
    <v-progress-circular :size="50" indeterminate></v-progress-circular>
    <div class="mt-2">Daten werden geladen ...</div>
  </v-container>
  <v-container v-else-if="status === 'error'" class="h-100 d-flex flex-column justify-center align-center">
    <v-alert color="error">ERROR</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { format, subMinutes } from 'date-fns'
import { tryCatchAsync } from '~/services/utils/utils.helper'

interface FormLogBookProps {
  editId?: string
}

type FormLogBookEmits = {
  'update:form': [data: FromDataType]
  'update:loading': [data: boolean]
}

export interface FromDataType {
  type: 'training' | 'operation'
  flights: { start: Date; end: Date }[]
  options: ('manuel' | 'automatic' | 'night')[]
  coordinates: { lat: number; lng: number }
  location: string | undefined
}

defineComponent({ VTimePicker })
const props = defineProps<FormLogBookProps>()
const emits = defineEmits<FormLogBookEmits>()

const { $client } = useNuxtApp()
const selectedIndex = ref<number | undefined>()
const selectedType = ref<'start' | 'end' | undefined>()

const { status, data } = useAsyncData(() => $client.logBook.find.query({ id: props.editId ?? '' }), {
  immediate: !!props.editId,
})

watch(status, (value) => {
  if (value === 'success' && data.value) {
    console.log(formData.flights)
    formData.flights = (data.value.flights ?? []).map((i) => ({ start: new Date(i.start), end: new Date(i.end) }))
    formData.type = data.value.type as 'operation' | 'training'
    formData.coordinates = { lat: data.value.lat ?? 0, lng: data.value.lng ?? 0 }
    formData.location = data.value.location ?? undefined

    formData.options = []
    if (data.value.is_flight_mode_manuel) {
      formData.options.push('manuel')
    }
    if (data.value.is_flight_mode_automatic) {
      formData.options.push('automatic')
    }
    if (data.value.is_night_flight) {
      formData.options.push('night')
    }
  }
})

const modalState = reactive({
  date: false,
  time: false,
})

const isLoadingGeocode = ref(false)
watch(isLoadingGeocode, (value) => emits('update:loading', value))

const formData = reactive<FromDataType>({
  type: 'training',
  options: ['manuel'],
  flights: [{ start: subMinutes(new Date(), 30), end: new Date() }],
  coordinates: { lat: 0, lng: 0 },
  location: undefined,
})
watch(formData, (value) => emits('update:form', value), { deep: true, immediate: true })

const onAddFlight = () => {
  formData.flights.push({ start: subMinutes(new Date(), 30), end: new Date() })
}

const onRemoveFlight = (index: number) => {
  formData.flights.splice(index, 1)
}

const onUpdateTime = (value: number, type: 'hours' | 'minutes', index: number, key: 'start' | 'end') => {
  if (type === 'hours') formData.flights[index][key] = new Date(formData.flights[index][key].setHours(value))
  if (type === 'minutes') formData.flights[index][key] = new Date(formData.flights[index][key].setMinutes(value))
}

const onUpdateDate = (value: Date) => {
  for (const index in formData.flights) {
    value.setHours(formData.flights[index].start.getHours())
    value.setMinutes(formData.flights[index].start.getMinutes())
    formData.flights[index].start = new Date(value)

    value.setHours(formData.flights[index].end.getHours())
    value.setMinutes(formData.flights[index].end.getMinutes())
    formData.flights[index].end = new Date(value)
  }
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

const flightTime = computed(() => {
  let sum = 0
  for (const { start, end } of formData.flights) {
    sum += end.getTime() - start.getTime()
  }
  return `${(sum / 1000 / 60).toFixed(0)} min`
})
</script>

<style lang="css">
.v-list .v-input__control input {
  text-align: center;
}

.v-list-item-title {
  color: grey;
  font-size: 12px;
}
</style>
