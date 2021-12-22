import buildConfig from './build-config'
import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinLedgerProvider } from '@liquality/bitcoin-ledger-provider'
import { BitcoinRpcFeeProvider } from '@liquality/bitcoin-rpc-fee-provider'
import { Client } from '@liquality/client'
import { bitcoin, Address, BigNumber } from '@liquality/types';
import Transport from '@ledgerhq/hw-transport-webhid'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
import { BitcoinEsploraSwapFindProvider } from '@liquality/bitcoin-esplora-swap-find-provider'
import { CoinSelectTarget, decodeRawTransaction, selectCoins } from '@liquality/bitcoin-utils'


const ADDRESS_GAP = 20

export enum AddressSearchType {
  EXTERNAL,
  CHANGE,
  EXTERNAL_OR_CHANGE
}

export class CustomBitcoinLedgerProvider extends BitcoinLedgerProvider {
    async getInputsForAmount(
        _targets: bitcoin.OutputTarget[],
        feePerByte: number,
        fixedInputs: bitcoin.Input[] = [],
        numAddressPerCall = 100,
        sweep = false
      ) {
        let addressIndex = 0
        let changeAddresses: Address[] = []
        let externalAddresses: Address[] = []
        const addressCountMap = {
          change: 0,
          nonChange: 0
        }
  
        const feePerBytePromise = this.getMethod('getFeePerByte')()
        let utxos: bitcoin.UTXO[] = []
  
        while (addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP) {
          let addrList: Address[] = []
  
          if (addressCountMap.change < ADDRESS_GAP) {
            // Scanning for change addr
            changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
            addrList = addrList.concat(changeAddresses)
          } else {
            changeAddresses = []
          }
  
          if (addressCountMap.nonChange < ADDRESS_GAP) {
            // Scanning for non change addr
            externalAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
            addrList = addrList.concat(externalAddresses)
          }
  
          const fixedUtxos: bitcoin.UTXO[] = []
          if (fixedInputs.length > 0) {
            for (const input of fixedInputs) {
              const txHex = await this.getMethod('getRawTransactionByHash')(input.txid)
              const tx = decodeRawTransaction(txHex, this._network)
              const value = new BigNumber(tx.vout[input.vout].value).times(1e8).toNumber()
              const address = tx.vout[input.vout].scriptPubKey.addresses[0]
              const walletAddress = await this.getWalletAddress(address)
              const utxo = { ...input, value, address, derivationPath: walletAddress.derivationPath }
              fixedUtxos.push(utxo)
            }
          }
  
          if (!sweep || fixedUtxos.length === 0) {
            const _utxos: bitcoin.UTXO[] = await this.getMethod('getUnspentTransactions')(addrList)
            utxos.push(
              ..._utxos.map((utxo) => {
                const addr = addrList.find((a) => a.address === utxo.address)
                return {
                  ...utxo,
                  derivationPath: addr ? addr.derivationPath : ''
                }
              })
            )
          } else {
            utxos = fixedUtxos
          }
  
          const utxoBalance = utxos.reduce((a, b) => a + (b.value || 0), 0)

          const transactionCounts: bitcoin.AddressTxCounts = await this.getMethod('getAddressTransactionCounts')(addrList)
  
          if (!feePerByte) feePerByte = await feePerBytePromise
          const minRelayFee = await this.getMethod('getMinRelayFee')()
          if (feePerByte && feePerByte < minRelayFee) {
            throw new Error(`Fee supplied (${feePerByte} sat/b) too low. Minimum relay fee is ${minRelayFee} sat/b`)
          }
  
          let targets: CoinSelectTarget[]
          if (sweep) {
            const outputBalance = _targets.reduce((a, b) => a + (b['value'] || 0), 0)
  
            const sweepOutputSize = 39
            const filteredTarget = _targets.filter((t) => t.value && t.address)
            
            const paymentOutputSize = filteredTarget ? filteredTarget.length * 39 : 0
            const scriptOutputSize = _targets
              .filter((t) => !t.value && t.script)
              .reduce((size, t) => size + 39 + (t && t.script ? t.script.byteLength : 0), 0)
  
            const outputSize = sweepOutputSize + paymentOutputSize + scriptOutputSize
            const inputSize = utxos.length * 153
  
            const sweepFee = (feePerByte || 0) * (inputSize + outputSize)
            const amountToSend = new BigNumber(utxoBalance).minus(sweepFee)
  
            targets = _targets.map((target) => ({ id: 'main', value: target.value, script: target.script }))
            targets.push({ id: 'main', value: amountToSend.minus(outputBalance).toNumber() })
          } else {
            targets = _targets.map((target) => ({ id: 'main', value: target.value, script: target.script }))
          }
  
          const { inputs, outputs, change, fee } = selectCoins(utxos, targets, Math.ceil(feePerByte || 0), fixedUtxos)
  
          if (inputs && outputs) {
            return {
              inputs,
              change,
              outputs,
              fee
            }
          }
  
          for (const address of addrList) {
            const isUsed = transactionCounts[address.address]
            const isChangeAddress = changeAddresses.find((a) => address.address === a.address)
            const key = isChangeAddress ? 'change' : 'nonChange'
  
            if (isUsed) {
              addressCountMap[key] = 0
            } else {
              addressCountMap[key]++
            }
          }
  
          addressIndex += numAddressPerCall
        }
  
        throw new Error('Not enough balance')
      }
}

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