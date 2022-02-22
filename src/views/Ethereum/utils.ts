
import { Client } from '@liquality/client'
import { EthereumNetworks } from '@liquality/ethereum-networks'
import { EthereumEIP1559FeeProvider } from '@liquality/ethereum-eip1559-fee-provider'
import { EthereumLedgerProvider } from '@liquality/ethereum-ledger-provider'
import { EthereumRpcProvider } from '@liquality/ethereum-rpc-provider'
import buildConfig from '@/build-config'
import Transport from '@ledgerhq/hw-transport-webhid'

export function createETHClient() {
    const ethereumNetwork = EthereumNetworks.ethereum_mainnet
    const rpcApi = `https://mainnet.infura.io/v3/${buildConfig.infuraApiKey}` //`https://ropsten.infura.io/v3/${buildConfig.infuraApiKey}`
    const ethClient = new Client()
    const feeProvider = new EthereumEIP1559FeeProvider({ uri: rpcApi })
    ethClient.addProvider(new EthereumRpcProvider({ uri: rpcApi }))
    const ledgerProvider = new EthereumLedgerProvider(
        {
            network: ethereumNetwork,
            derivationPath: "m/44'/60'/0'/0/0",
            Transport: Transport,
            hardfork: 'london',
        },
    )
    ethClient.addProvider(feeProvider)
    ethClient.addProvider(ledgerProvider)

    return ethClient
}
