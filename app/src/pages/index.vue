<template>
  <NuxtLayout name="default" title="Logbuch" :show-back-button="false">
    <template #bottom>
      <v-btn @click="createNewLog">
        <v-icon>mdi-plus</v-icon>
        <span>Neuer Eintrag</span>
      </v-btn>
    </template>
    <template #menu>
      <v-list-item prepend-icon="mdi-logout" @click="logout()">
        <v-list-item-title>Abmelden</v-list-item-title>
      </v-list-item>
    </template>
    <template #default>
      <div v-if="status === 'pending'" class="d-flex justify-center align-center flex-column mt-4 h-100">
        <v-progress-circular size="48" color="red" indeterminate />
        <span class="mt-2">Daten werden geladen ...</span>
      </div>
      <div v-else-if="status === 'success'" class="content">
        <div class="header">
          <div class="d-flex justify-space-around">
            <div class="d-flex flex-column justify-center align-center">
              <v-progress-circular
                :indeterminate="statistics.status.value === 'pending'"
                :model-value="statistics.data.value?.nightFlightTime.percent ?? 0"
                :rotate="360"
                :size="40"
                :width="5"
                color="teal"
              >
                <v-icon size="small">mdi-weather-night-partly-cloudy</v-icon>
              </v-progress-circular>
              <small v-if="statistics.status.value === 'success'">
                {{ statistics.data.value?.nightFlightTime.value }}
              </small>
              <small v-else-if="statistics.status.value === 'pending'"> Laden ... </small>
              <small v-else>ERROR</small>
            </div>
            <div class="d-flex flex-column justify-center align-center">
              <v-progress-circular
                :indeterminate="statistics.status.value === 'pending'"
                :model-value="statistics.data.value?.flightTime.percent ?? 0"
                :rotate="360"
                :size="40"
                :width="5"
                color="teal"
              >
                <v-icon size="small">mdi-weather-night-partly-cloudy</v-icon>
              </v-progress-circular>
              <small v-if="statistics.status.value === 'success'">
                {{ statistics.data.value?.flightTime.value }}
              </small>
              <small v-else-if="statistics.status.value === 'pending'"> Laden ... </small>
              <small v-else>ERROR</small>
            </div>
          </div>
          <v-divider class="mt-3"></v-divider>
        </div>
        <div class="list">
          <v-virtual-scroll :items="data ?? []" item-height="50">
            <template #default="{ item }">
              <v-list-item
                lines="two"
                :prepend-icon="item.type === 'training' ? 'mdi-airplane' : 'mdi-alarm-light'"
                @click="onItemClick(item.id)"
              >
                <v-list-item-title>
                  <span v-if="item.type === 'training'" :class="{ no_title: !item.location }">
                    {{ item.location ?? 'Kein Ort hinterlegt' }}
                  </span>
                  <span v-if="item.type === 'operation'" :class="{ no_title: !item.operation_name }">
                    {{ item.operation_name ?? 'Kein Einsatz hinterlegt' }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle class="d-flex justify-space-between">
                  <span>{{ format(item.flights[0].start, 'dd.MM.yyyy') }}</span>
                  <span>
                    {{
                      generateFlightTime(item.flights.map((i) => ({ start: new Date(i.start), end: new Date(i.end) })))
                    }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FromDataType } from '~/components/form-log-book.vue'
import { format } from 'date-fns'

definePageMeta({ layout: false })

const { push } = useRouter()
const { $client } = useNuxtApp()
const { data, status } = useAsyncData(() => $client.logBook.all.query())
const statistics = useAsyncData(() => $client.user.statistic.query())

const createNewLog = () => push({ name: 'create' })
const onItemClick = (id: string) => push({ path: `/edit/${id}` })
const generateFlightTime = (flights: FromDataType['flights']) => {
  let sum = 0
  for (const { start, end } of flights) {
    sum += end.getTime() - start.getTime()
  }
  return `${(sum / 1000 / 60).toFixed(0)} min`
}
const logout = async () => {
  await $client.user.logout.query()
  location.reload()
}
</script>

<style lang="css" scoped>
.no_title {
  font-style: italic;
  color: grey;
}
.content {
  display: flex;
  width: 100%;

  .header {
    width: 100%;
    position: fixed;
    top: 64px;
    align-self: flex-start;
    height: 85px;
    z-index: 999;
    background-color: white;
    padding: 12px;
  }

  .list {
    width: 100%;
    align-self: flex-start;
    margin-top: 85px;
  }
}
</style>
