<template>
  <ion-grid>
    <ion-row class="ion-align-items-center">
      <ion-col>
        <ion-button fill="outline" size="small" @click="getAppConfiguration"
          >getAppConfiguration()</ion-button
        >
        <p>
          <code>
            {{ getAppConfigurationResult }}
          </code>
        </p>
      </ion-col>
    </ion-row>
    <ion-row class="ion-align-items-center">
      <ion-col>
        <ion-button fill="outline" size="small" @click="getAddress"
          >getAddress()</ion-button
        >
        <p>
          <code>
            {{ getAddressResult }}
          </code>
        </p>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import Transport from '@ledgerhq/hw-transport'
import ETHApp from '@ledgerhq/hw-app-eth'
import BTCApp from '@ledgerhq/hw-app-btc'
import { computed, defineComponent, ref } from 'vue'
import { useStore } from '@/store'
type LedgerApp = 'ethereum' | 'bitcoin'

export default defineComponent<{ transport: Transport }>({
  name: 'LedgerApp',
  setup () {
    const store = useStore()

    const app = computed<ETHApp | BTCApp>({
      get: () => (store.getApp as any).value,
      set: store.setApp as any
    })
    const getAddressResult = ref()
    const getAppConfigurationResult = ref()

    const getAppConfiguration = async () => {
      try {
        getAppConfigurationResult.value = await (app.value as ETHApp).getAppConfiguration()
      } catch (err) {
        getAppConfigurationResult.value = err
      }
    }

    const getAddress = async () => {
      try {
        getAddressResult.value = await (app.value as ETHApp).getAddress(
          "m/44'/60'/0'/0/0"
        )
      } catch (err) {
        getAddressResult.value = err
      }
    }

    return {
      getAddressResult,
      getAppConfigurationResult,
      getAddress,
      getAppConfiguration
    }
  }
})
</script>
