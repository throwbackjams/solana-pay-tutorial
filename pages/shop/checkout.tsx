import { createQR, encodeURL, EncodeURLComponents, findTransactionSignature, FindTransactionSignatureError, validateTransactionSignature, ValidateTransactionSignatureError } from "@solana/pay";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import BackLink from "../../components/BackLink";
import PageHeading from "../../components/PageHeading";
import { shopAddress, usdcAddress } from "../../lib/addresses";
import calculatePrice from "../../lib/calculatePrice";

export default function Checkout() {
    const router = useRouter()

    const qrRef = useRef<HTMLDivElement>(null)

    const amount = useMemo(() => calculatePrice(router.query), [router.query])

    const reference = useMemo(() => Keypair.generate().publicKey, [])

    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint)

    //Solana Pay transfer parameters
    const urlParams: EncodeURLComponents = {
        recipient: shopAddress,
        splToken: usdcAddress,
        amount,
        reference,
        label: "Ticket Purhcase from Concert Ticket Central",
        message: "Enjoy the show!"
    }

    const url = encodeURL(urlParams)
    console.log({ url })

    useEffect(() => {
        const qr = createQR(url, 512, 'transparent')
        if (qrRef.current && amount.isGreaterThan(0)) {
            qrRef.current.innerHTML = ''
            qr.append(qrRef.current)
        }
    })

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const signatureInfo = await findTransactionSignature(connection, reference, {}, 'confirmed')
                await validateTransactionSignature(
                    connection, 
                    signatureInfo.signature, 
                    shopAddress, 
                    amount, 
                    usdcAddress, 
                    reference, 
                    'confirmed')
                router.push('/shop/confirmed')
            } catch (e) {
                if (e instanceof FindTransactionSignatureError) {
                    return;
                }
                if (e instanceof ValidateTransactionSignatureError) {
                    console.error('Transaction is invalid', e)
                    return;
                }
                console.error('Unknown error', e)
            }
        }, 500)
        return () => {
            clearInterval(interval)
        }
        }, [])


    return (
        <div className="flex flex-col gap-8 items-center">
            <BackLink href="/">Cancel</BackLink>
            <PageHeading>Checkout Total: ${amount.toString()} USDC</PageHeading>
            <div ref={qrRef}/>
        </div>
    )
}