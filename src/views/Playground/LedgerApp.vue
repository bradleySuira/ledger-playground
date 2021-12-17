<template>
  <ion-grid>
    <ion-row class="text-center">
      <ion-col size="4">
        <ion-select
          interface="popover"
          placeholder="Select the App"
          :value="selectedApp"
          @ionChange="onLedgerAppChange"
        >
          <ion-select-option
            v-for="app in ledgerApps"
            :key="app.name"
            :value="app.name"
            >{{ app.label }}</ion-select-option
          >
        </ion-select>
      </ion-col>
      <ion-col size="12">
        <p>
          {{ status }}
        </p>
      </ion-col>
      <ion-col class="mb-4" v-if="error">
        <p>
          <code>
            {{ error }}
          </code>
        </p>
      </ion-col>
      <ion-col v-if="selectedApp === 'ethereum'"> 
        <LedgerAppEthereum />
      </ion-col>
      <ion-col v-if="selectedApp === 'bitcoin'"> 
         <LedgerAppBitcoin />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import Transport from '@ledgerhq/hw-transport'
import ETHApp from '@ledgerhq/hw-app-eth'
import BTCApp from '@ledgerhq/hw-app-btc'
import { computed, defineComponent, ref } from 'vue'
import { IonSelect, IonSelectOption } from '@ionic/vue'
import { useStore } from '@/store'
import LedgerAppEthereum from './LedgerAppEthereum.vue'
import LedgerAppBitcoin from './LedgerAppBitcoin.vue'
type LedgerApp = 'ethereum' | 'bitcoin'

export default defineComponent<{ transport: Transport }>({
  name: 'LedgerApp',
  components: {
    IonSelect,
    IonSelectOption,
    LedgerAppEthereum,
    LedgerAppBitcoin
  },
  setup () {
    const store = useStore()
    const transport = computed<Transport>({
      get: () => (store.getTransport as any).value,
      set: store.setTransport as any
    })

    const app = computed<ETHApp | BTCApp>({
      get: () => (store.getApp as any).value,
      set: store.setApp as any
    })
    const status = ref('')
    const selectedApp = ref<LedgerApp>()

    const ledgerApps = ref([
      {
        name: 'ethereum',
        label: 'Ethereum'
      },
      {
        name: 'bitcoin',
        label: 'Bitcoin'
      }
    ])

    const createApp = async () => {
      try {
        switch (selectedApp.value) {
          case 'ethereum':
            app.value = new ETHApp(transport.value as Transport)
            break
          case 'bitcoin':
            app.value = new BTCApp(transport.value as Transport)
            break
          default:
            break
        }

        if (app.value) {
          status.value = 'App Created'
        }
      } catch (err) {
        status.value = (err as Error).message
      }
    }

    const onLedgerAppChange = (e: CustomEvent) => {
      console.log('onLedgerAppChange', e.detail)
      selectedApp.value = e.detail.value
      createApp()
    }

    return {
      ledgerApps,
      transport,
      status,
      createApp,
      selectedApp,
      onLedgerAppChange
    }
  }
})
</script>
