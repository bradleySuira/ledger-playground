import { computed, ComputedRef, inject, provide, reactive } from "vue"
import Transport from '@ledgerhq/hw-transport'
import ETHApp from '@ledgerhq/hw-app-eth'
import BTCApp from '@ledgerhq/hw-app-btc'

export const initStore = () => {
  // State
  const state = reactive<{
    transport: Transport | null;
    app: ETHApp | BTCApp | null;
  }>({
    transport: null,
    app: null
  })

  // Getters
  const getTransport = computed(() => state.transport)
  const getApp = computed(() => state.app)

  // Actions
  const setTransport = (transport: Transport) => {
    state.transport = transport
  }

  const setApp = (app: ETHApp | BTCApp) => {
    state.app = app
  }


  provide('getTransport', getTransport)
  provide('setTransport', setTransport)
  provide('getApp', getApp)
  provide('setApp', setApp)
}

export const useStore = () => ({
    getTransport: inject<ComputedRef<Transport>>("getTransport"),
    setTransport: inject<(transport: Transport) => void>("setTransport"),
    getApp: inject<ComputedRef<Transport>>("getApp"),
    setApp: inject<(app: ETHApp | BTCApp) => void>("setApp"),
});