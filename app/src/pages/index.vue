<template>
  <NuxtLayout name="default" title="Logbuch">
    <template #bottom>
      <v-btn @click="createNewLog">
        <v-icon>mdi-plus</v-icon>
        <span>Neuer Eintrag</span>
      </v-btn>
    </template>
    <v-virtual-scroll :items="data" item-height="50">
      <template #default="{ item }">
        <v-list-item lines="two" :prepend-icon="item.type === 'training' ? 'mdi-airplane' : 'mdi-alarm-light'">
          <v-list-item-title>
            <span v-if="item.type === 'training'" :class="{ no_title: !item.location }">
              {{ item.location ?? 'Kein Ort hinterlegt' }}
            </span>
            <span v-if="item.type === 'operation'" :class="{ no_title: !item.operation_name }">
              {{ item.operation_name ?? 'Kein Einsatz hinterlegt' }}
            </span>
          </v-list-item-title>
          <v-list-item-subtitle>{{ format(item.start, 'dd.MM.yyyy HH:mm') }}</v-list-item-subtitle>
          <!-- <template #append>
            <v-btn size="small" variant="tonal">
              View User

              <v-icon color="orange-darken-4" end> mdi-open-in-new </v-icon>
            </v-btn>
          </template> -->
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({ layout: false })

const { push } = useRouter()
const { $client } = useNuxtApp()
const { data } = useAsyncData(() => $client.logBook.all.query())

const createNewLog = () => push({ name: 'create' })
</script>

<style lang="css" scoped>
.no_title {
  font-style: italic;
  color: grey;
}
</style>
