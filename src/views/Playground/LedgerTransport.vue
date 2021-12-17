<template>
  <ion-grid>
    <ion-row>
      <ion-col size="12">
        <ion-button
          @click="createTransport"
          color="primary"
          :disabled="loading"
        >
          Create Transport
        </ion-button>
        <ion-progress-bar v-if="loading" type="indeterminate" />
      </ion-col>
      <ion-col size="12">
        <p>
          {{ status }}
        </p>
      </ion-col>
      <ion-col>
        <p>
          <code v-if="transport">
            {{ transport.deviceModel }}
          </code>
          <code v-else>
            {{ error }}
          </code>
        </p>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import Transport from '@ledgerhq/hw-transport'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { computed, defineComponent, ref } from 'vue'
import { IonProgressBar } from '@ionic/vue'
import { useStore } from '@/store'

export default defineComponent({
  components: {
    IonProgressBar
  },
  name: 'LedgerTransport',
  setup () {
    const store = useStore()

    const loading = ref(false)
    const error = ref()
    const transport = computed<Transport>({
      get: () => (store.getTransport as any).value,
      set: store.setTransport as any
    })
    const app = computed({
          get: () => (store.getApp as any).value,
          set: store.setApp as any
    })
    const status = ref('Not Connected')

    const createTransport = async () => {
      loading.value = true
      try {
        const createdTransport = await TransportWebHID.create()
        createdTransport.on('disconnect', err => {
          error.value = err
          status.value = 'Not Connected'
          app.value = null
        })
        transport.value = createdTransport
        status.value = 'Connected'
        error.value = null
      } catch (err) {
        status.value = 'Not Connected'
        error.value = err as Error
      } finally {
        loading.value = false
      }
    }

    return {
      transport,
      error,
      status,
      loading,
      createTransport
    }
  }
})
</script>
