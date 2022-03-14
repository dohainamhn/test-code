import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { injected, walletconnect, resetWalletConnector, walletlink } from './Helpers/connectors';
import React, { useEffect } from 'react';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from '@web3-react/walletconnect-connector'

const Web3ReactConnectionComponent = () => {
	//connector, library, chainId, account, activate, deactivate
	const { account, error, chainId, activate } = useWeb3React()
	console.log('account',account)
	console.log('error',error)
	const web3reactContext = useWeb3React(); 
	//web3react
	const writeToContractUsingWeb3React = async () => {
		try {
			const provider = walletconnect.walletConnectProvider
			console.log('provider',provider)
			const a = await provider.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: 43113,
						rpcUrls: 'https://api.avax-test.network/ext/bc/C/rpc',
						chainName:'Avalanche-FUJI-Testnet-RPC',
						nativeCurrency: {
							name: 'AVAX',
							decimals: 18,
							symbol: 'AVAX',
						},
						blockExplorerUrls: ['https://testnet.snowtrace.io/'],
					},
				],
			})
			console.log(a)
			// const randomNumber = Math.floor(Math.random() * 100);
			// const myContract = getContract(web3reactContext.library, web3reactContext.account);
			// const overrides = {
			// 	gasLimit: 230000
			// };
			// const response = await myContract.store(randomNumber, overrides);
			// console.log(response);
			// alert('write ' + randomNumber);
		} catch (ex) {
			console.log(ex);
			alert(ex);
		}
	};

	useEffect(()=>{
		if(walletconnect.walletConnectProvider){
			const provider = walletconnect.walletConnectProvider
			console.log('provider',provider)
			console.log('provider2',provider.events)
			provider.off('chainChanged',()=>{})
			provider.once('chainChanged',()=>{
				console.log('zoday')
			})
			console.log('provider3',provider.registerEventListeners())
			// provider.registerEventListeners()
		}
	},[walletconnect.walletConnectProvider])

	useEffect(()=>{
		console.log('chainId',chainId)
	},[chainId])

	const disconnectMetamaskSimple = () => {
		try {
			web3reactContext.deactivate();
		} catch (ex) {
			console.log(ex);
		}
	};

	//web3react context
	const checkInfoSimple = async () => {
		try {
			console.log('web3reactContext');
			console.log(web3reactContext);
		} catch (ex) {
			console.log(ex);
		}
	};

	//web3react metamask
	const connectMetamaskSimple = async () => {
		try {
			await web3reactContext.activate(injected);
		} catch (ex) {
			console.log(ex);
		}
	};

	//web3react walletconnect
	const connectWalletConnectSimple = async () => {
    try {
			alert(walletconnect instanceof WalletConnectConnector)
			activate(walletconnect, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          // toastError('Unsupported Chain Id', 'Unsupported Chain Id Error. Check your chain Id.')
        } else if (error instanceof NoEthereumProviderError) {
          // toastError('Provider Error', 'No provider was found')
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (walletconnect instanceof WalletConnectConnector) {
            const walletConnector = walletconnect
            walletConnector.walletConnectProvider = null
          }
          // toastError('Authorization Error', 'Please authorize to access your account')
        } else {
          // toastError(error.name, error.message)
        }
      })
    } catch (ex) {
      console.log(ex);
    }
  };

	//web3react coinbase
	const connectCoinbaseSimple = async () => {
		try {
			await web3reactContext.activate(walletlink);
		} catch (ex) {
			console.log(ex);
		}
	};

	return (
		<div className="flex flex-col space-y-7 items-start pt-10 w-1/2 border-2 border-yellow-300">
			<h2>Web3React Control</h2>
			{web3reactContext.account ? <p>{web3reactContext.account}</p> : <p>Not connected</p>}
			<div className="flex space-x-3">
				<button
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					onClick={writeToContractUsingWeb3React}
				>
					Write To Contract Via Web3React
				</button>

				<button
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					onClick={checkInfoSimple}
				>
					Check web3react Context
				</button>
				<button
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					onClick={disconnectMetamaskSimple}
				>
					Disconnect Web3React
				</button>
			</div>
			<div className="flex space-x-3">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={connectMetamaskSimple}
				>
					Connect Metamask Via Web3-React
				</button>
			</div>
			<div className="flex space-x-3">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={connectWalletConnectSimple}
				>
					Connect walletconnect Via Web3-React
				</button>
			</div>
			<div className="flex space-x-3">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={connectCoinbaseSimple}
				>
					Connect coinbase Via Web3-React
				</button>
			</div>
		</div>
	);
};
export default Web3ReactConnectionComponent;
