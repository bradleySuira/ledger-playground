import buildConfig from './build-config'
import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinLedgerProvider } from '@liquality/bitcoin-ledger-provider'
import { BitcoinRpcFeeProvider } from '@liquality/bitcoin-rpc-fee-provider'
import { Client } from '@liquality/client'
import { bitcoin } from '@liquality/types';
import Transport from '@ledgerhq/hw-transport-webhid'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
import { BitcoinEsploraSwapFindProvider } from '@liquality/bitcoin-esplora-swap-find-provider'

export function createBtcClient() {
    const network = BitcoinNetworks.bitcoin_testnet
    const esploraApi = buildConfig.exploraApis.testnet
    const batchEsploraApi = buildConfig.batchEsploraApis.testnet

    const btcClient = new Client()
    btcClient.addProvider(
        new BitcoinEsploraBatchApiProvider({
            batchUrl: batchEsploraApi,
            url: esploraApi,
            network,
            numberOfBlockConfirmation: 2
        })
    )
    

    const ledgerProvider = new BitcoinLedgerProvider({
        network,
        addressType: bitcoin.AddressType.BECH32,
        Transport,
        baseDerivationPath: "84'/1'/0'",
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore 
    btcClient.addProvider(ledgerProvider)

    btcClient.addProvider(new BitcoinEsploraSwapFindProvider(esploraApi))
    btcClient.addProvider(new BitcoinRpcFeeProvider())

    return btcClient
}