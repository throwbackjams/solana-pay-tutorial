import Products from '../../components/Products';
import SiteHeading from '../../components/SiteHeading';

export default function ShopPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl items-stretch m-auto pt-24">
            <SiteHeading>Concert Ticket Central</SiteHeading>
            <Products submitTarget='./shop/checkout' enabled={true}/>
            <a className = "rounded-md bg-white text-left p-4" href= "https://spl-token-faucet.com/?token-name=USDC-Dev" target="_blank">Click here to get USDC devnet test tokens</a>
        </div>
    )
}