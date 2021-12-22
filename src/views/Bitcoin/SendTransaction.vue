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
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label position="stacked">Send Address</ion-label>
                    <ion-input v-model="sendAddress"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">BTC Amount</ion-label>
                    <ion-input v-model="amount"></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-button @click="send">Send()</ion-button>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <p>
                    Addresses:
                    <code>
                      {{ addresses }}
                    </code>
                  </p>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <p>
                    Balance:
                    <code>
                      {{ balance }}
                    </code>
                  </p>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <p>
                    Result:
                    <code>
                      {{ result }}
                    </code>
                  </p>
                </ion-col>
              </ion-row>
            </ion-grid>
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
  IonItem,
  loadingController
} from '@ionic/vue'
import { defineComponent } from 'vue'
import { createBtcClient } from './utils'
import BN from 'bignumber.js'
import { Address } from '@liquality/types'

interface BitcoinSendTransactionData {
  sendAddress: string;
  addresses: Address[];
  amount: number;
  balance: BN;
  result: any;
}
const client = createBtcClient()

export default defineComponent<BitcoinSendTransactionData>({
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
  data: () => {
    return {
      sendAddress: 'tb1qjktj4vqe9p6zlj0ef8euygye7tt4qqp38crmyw',
      addresses: [],
      amount: 940,
      balance: new BN(0),
      result: null
    }
  },
  methods: {
    async send () {

      const provider = client._providers[0] as any
      const originalEstimateGas = provider.estimateGas

      const loading = await loadingController.create({})
        
      await loading.present();
      try {
         this.addresses = await client.wallet.getAddresses()
      this.balance = await client.chain.getBalance(this.addresses)
        this.result = await client.chain.sendTransaction({
          to: this.sendAddress,
          value: new BN(this.amount),
          data: undefined,
          fee: undefined
        })
      } catch (err) {
        this.result = err
      } finally {
        (client._providers[0] as any).estimateGas = originalEstimateGas
        await loading.dismiss()
        console.log('result', this.result)
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
