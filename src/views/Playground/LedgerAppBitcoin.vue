<template>
  <ion-grid>
    <ion-row class="ion-align-items-center">
      <ion-col>
        <ion-button fill="outline" size="small" @click="getAddress"
          >getWalletPublicKey()</ion-button
        >
        <p>
          <code>
            {{ getAddressResult }}
          </code>
        </p>
      </ion-col>
    </ion-row>
     <ion-row class="ion-align-items-center">
      <ion-col>
        <ion-button fill="outline" size="small" @click="getDerivationNode"
          >getDerivationNode()</ion-button
        >
        <p>
          <code>
            {{ 'WIP' }}
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
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
import { compressPubKey } from '@liquality/bitcoin-utils'
import { fromPublicKey } from 'bip32'

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

    const getAddress = async () => {
      try {
        getAddressResult.value = await (app.value as BTCApp).getWalletPublicKey(
          "84'/1'/0'"
        )
      } catch (err) {
        getAddressResult.value = err
      }
    }

    const getDerivationNode = async () => {
      try {
        const walletPubKey = getAddressResult.value
        const compressedPubKey = compressPubKey(walletPubKey.publicKey)
        const baseDerivationNode = fromPublicKey(
          Buffer.from(compressedPubKey, 'hex'),
          Buffer.from(walletPubKey.chainCode, 'hex'),
          BitcoinNetworks.bitcoin_testnet
        )
        console.log('baseDerivationNode', baseDerivationNode)
      } catch (error) {
        console.error('error', error)
      }
    }

    return {
      getAddressResult,
      getAddress,
      getDerivationNode
    }
  }
})
</script>
