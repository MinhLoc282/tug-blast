import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  DAppProvider, Mumbai,
} from '@usedapp/core';
import { AuthProvider } from '../screens/auth';

import Dashboard from '../screens/Dashboard';
import BuyTugPoints from '../components/BuyTugPoints/BuyTugPoints';
import OpenPosition from '../components/OpenPosition/OpenPosition';
import ClaimProceed from '../components/CliamProceed/ClaimProceed';
import History from '../components/History/History';
import StakeTugNFT from '../components/StakeTugNFT/StakeTug';

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { blastSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const projectId = 'f1f149f4b9ed28db4d741a9797d495d3'

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [blastSepolia]
const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
})

function ApplicationRoutes() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="/buy_tug_points" element={<BuyTugPoints />} />
            <Route path="/stake_tug" element={<StakeTugNFT />} />
            <Route path="/openposition" element={<OpenPosition />} />
            <Route path="/claim_proceeds" element={<ClaimProceed />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          autoDismiss
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          icon
          theme="colored"
          pauseOnHover={false}
          rtl={false}
        />
      </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>

  );
}

export default ApplicationRoutes;