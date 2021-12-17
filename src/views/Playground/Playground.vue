<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Ledger</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content  :scroll-events="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Ledger</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle></ion-card-subtitle>
            <ion-card-title>Ledger Transport</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p>
              Please connect and unlock your ledger device.
            </p>
            <p>
              <LedgerTransport />
            </p>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle></ion-card-subtitle>
            <ion-card-title>Ledger App</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p>
              <LedgerApp />
            </p>
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
  IonToolbar
} from '@ionic/vue'
import { defineComponent } from 'vue'
import LedgerTransport from './LedgerTransport.vue'
import LedgerApp from './LedgerApp.vue'

export default defineComponent({
  name: 'Playground',
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
    LedgerTransport,
    LedgerApp
  },
  setup () {
   
   return {
    
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
