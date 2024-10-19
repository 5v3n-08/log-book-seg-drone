<template>
  <NuxtLayout name="default" title="Neuer Eintrag">
    <v-container>
      <!-- <v-divider class="my-2"></v-divider> -->

      <h4>Flugzeiten</h4>
      <v-row class="mt-2">
        <v-col cols="8" class="pa-0">
          <v-text-field
            density="comfortable"
            :model-value="format(time, '')"
            :active="modal3"
            :focused="modal3"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
          >
            <v-dialog v-model="modal3" activator="parent" width="auto">
              <v-date-picker v-if="modal3" v-model="time"></v-date-picker>
            </v-dialog>
          </v-text-field>
        </v-col>
        <v-col cols="4" class="pa-0">
          <v-text-field
            density="comfortable"
            :active="modal2"
            :focused="modal2"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
          >
            <v-dialog v-model="modal2" activator="parent" width="auto">
              <v-time-picker v-if="modal2" v-model="time" format="24hr"></v-time-picker>
            </v-dialog>
          </v-text-field>
        </v-col>
        <!-- <v-col cols="6"><v-text-field density="comfortable" label="Enddatum" /></v-col>
        <v-col cols="6">
          <v-text-field
            density="comfortable"
            v-model="time"
            :active="modal3"
            :focused="modal3"
            label="Startzeit"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
          >
            <v-dialog v-model="modal3" activator="parent" width="auto">
              <v-date-picker v-if="modal3" v-model="time"></v-date-picker>
            </v-dialog>
          </v-text-field>
        </v-col> -->
      </v-row>
      {{ time }}
    </v-container>
  </NuxtLayout>
</template>

<style lang="css" scoped></style>

<script setup lang="ts">
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { useGeolocation } from '@vueuse/core'
import { format } from 'date-fns'

definePageMeta({ layout: false })
defineComponent({ VTimePicker })

const { back } = useRouter()
const { coords, error } = useGeolocation()

const time = ref(new Date())
const modal2 = ref()
const modal3 = ref()

watch(coords, (value) => console.log(value))
</script>
