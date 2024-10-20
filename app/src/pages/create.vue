<template>
  <NuxtLayout name="default" title="Neuer Eintrag">
    <v-container>
      <h4>Flugzeiten</h4>
      <v-row class="mt-2">
        <v-col cols="12" class="pa-0">
          <v-text-field
            label="Startdatum"
            density="comfortable"
            :model-value="format(startDate, 'dd.MM.yyyy')"
            :active="isStartDateModalOpen"
            :focused="isStartDateModalOpen"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            @click="isStartDateModalOpen = true"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pa-0">
          <v-text-field
            label="Startzeit"
            density="comfortable"
            :model-value="format(startDate, 'HH:mm')"
            :active="isStartTimeModalOpen"
            :focused="isStartTimeModalOpen"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            @click="isStartTimeModalOpen = true"
          >
          </v-text-field>
        </v-col>
        <v-col cols="6" class="pa-0">
          <v-text-field
            label="Startzeit"
            density="comfortable"
            :model-value="format(endDate, 'HH:mm')"
            :active="isEndTimeModalOpen"
            :focused="isEndTimeModalOpen"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            @click="isEndTimeModalOpen = true"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-divider class="mt-2 mb-4"></v-divider>
      <v-row>
        <v-col>
          <v-btn-toggle v-model="variant" divided class="w-100" mandatory>
            <v-btn color="error" class="w-50" variant="tonal" value="training">Übung</v-btn>
            <v-btn color="error" variant="tonal" class="w-50" value="alarm">Einsatz</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row v-if="variant === 'training'">
        <v-col>
          <v-text-field prepend-inner-icon="mdi-crosshairs-gps" density="comfortable" label="Übungsort"></v-text-field>
        </v-col>
      </v-row>
      <v-divider class="mt-2 mb-4"></v-divider>
      <v-chip-group column multiple mandatory>
        <v-chip color="error" text="Manuell" value="manuel" variant="tonal" filter></v-chip>
        <v-chip color="error" text="Automatisch" value="automatic" variant="tonal" filter></v-chip>
        <v-chip color="error" text="Nachtflug" value="night" variant="tonal" filter></v-chip>
      </v-chip-group>
    </v-container>
    <v-dialog
      :model-value="isStartTimeModalOpen || isEndTimeModalOpen"
      width="auto"
      @update:model-value="
        () => {
          isStartTimeModalOpen = false
          isEndTimeModalOpen = false
        }
      "
    >
      <v-time-picker
        v-if="isStartTimeModalOpen || isEndTimeModalOpen"
        :model-value="isStartTimeModalOpen ? startDate : endDate"
        format="24hr"
        @update:hour="onUpdateTime($event, 'hours')"
        @update:minute="onUpdateTime($event, 'minutes')"
      ></v-time-picker>
    </v-dialog>
    <v-dialog
      :model-value="isStartDateModalOpen || isEndDateModalOpen"
      width="auto"
      @update:model-value="
        () => {
          isStartDateModalOpen = false
          isEndDateModalOpen = false
        }
      "
    >
      <v-date-picker
        v-if="isStartDateModalOpen || isEndDateModalOpen"
        :model-value="isStartDateModalOpen ? startDate : endDate"
        @update:model-value="onUpdateDate"
      ></v-date-picker>
    </v-dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { useGeolocation } from '@vueuse/core'
import { format, subMinutes } from 'date-fns'

definePageMeta({ layout: false })
defineComponent({ VTimePicker })

const { back } = useRouter()
const { coords, error } = useGeolocation()

const startDate = ref(subMinutes(new Date(), 30))
const endDate = ref(new Date())

const isStartDateModalOpen = ref(false)
const isStartTimeModalOpen = ref(false)
const isEndDateModalOpen = ref(false)
const isEndTimeModalOpen = ref(false)
const variant = ref<'training' | 'alarm'>('training')
// const isEndTimeModalOpen = ref(false)

const onUpdateTime = (value: number, type: 'hours' | 'minutes') => {
  const date = isStartTimeModalOpen.value ? startDate : endDate
  if (type === 'hours') date.value.setHours(value)
  if (type === 'minutes') date.value.setMinutes(value)
}

const onUpdateDate = (value: Date) => {
  const date = isStartDateModalOpen.value ? startDate : endDate
  value.setHours(date.value.getHours())
  value.setMinutes(date.value.getMinutes())
  date.value = value
}

watch(coords, (value) => console.log(value))
</script>

<style lang="css" scoped></style>
