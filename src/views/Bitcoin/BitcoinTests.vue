<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Bitcoin Tests</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-events="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Bitcoin Tests</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle></ion-card-subtitle>
            <ion-card-title>Send Transaction</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Send Address</ion-label>
              <ion-input v-model="sendAddress"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">BTC Amount</ion-label>
              <ion-input v-model="amount"></ion-input>
            </ion-item>
            <ion-item>
              <ion-button @click="send">Send()</ion-button>
            </ion-item>
            <ion-item>
              <p>
                <code>
                  {{ 'WIP' }}
                </code>
              </p>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonItem
} from '@ionic/vue'
import { defineComponent } from 'vue'
import { createBtcClient } from './utils'
import BN from 'bignumber.js'

export default defineComponent({
  name: 'BitcoinTests',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonLabel,
    IonInput,
    IonItem
  },
  data: function () {
    return {
      sendAddress: 'tb1qjktj4vqe9p6zlj0ef8euygye7tt4qqp38crmyw',
      amount: 0.0000094
    }
  },
  methods: {
    async send () {
      const client = createBtcClient()
      const provider = client._providers[0] as any
      const originalEstimateGas = provider.estimateGas
      const addresses = await client.wallet.getAddresses()
      console.log('addresses', addresses)
      const balance = await client.chain.getBalance(addresses)
      console.log('balance', balance.toString())
      try {
        const tx = await client.chain.sendTransaction({
          to: this.sendAddress,
          value: new BN(this.amount),
          data: undefined,
          fee: undefined
        })
        console.log(tx)
      } catch (errr) {
        console.error(errr)
      }
      finally {
        (client._providers[0] as any).estimateGas = originalEstimateGas
      }
    }
  }
})
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

#container /deep/ code {
  text-align: left;
  background-color: #eee;
  border-radius: 3px;
  font-family: monospace;
  padding: 1em 0.5em;
  margin: 1em 0 2em;
  min-width: 5em;
  min-height: 5em;
  height: auto;
  display: block;
  white-space: pre-wrap;
  overflow: auto;
}
</style>
