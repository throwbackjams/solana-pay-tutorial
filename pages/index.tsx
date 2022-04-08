import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Products from '../components/Products'
import SiteHeading from '../components/SiteHeading'

export default function HomePage() {
  
  const { publicKey } = useWallet();

  return (
    <div className="flex flex-col gap-8 max-w-4xl items-stretch m-auto pt-24">
      <SiteHeading>Concert Ticket Central</SiteHeading>
      <div className="basis-1/4 flex gap-10" >
        <WalletMultiButton className='!bg-purple-900 hover:scale-105'/>
      </div>
      <div className="basis-1/4">
        <a href="/shop"
          className = "items-center px-10 font-bold rounded-md py-2 max-w-fit self-center bg-purple-900 text-white hover:scale-105 height-48px">
          Or Click here to checkout with Solana Pay on Mobile Wallet
          </a>
      </div>

      <Products submitTarget='/checkout' enabled={publicKey !== null} />
      <a className = "rounded-md bg-white text-left p-4" href= "https://spl-token-faucet.com/?token-name=USDC-Dev" target="_blank">Click here to get USDC devnet test tokens</a>
    </div>
  )
}
