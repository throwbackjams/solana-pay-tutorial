import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Transaction, 
    SystemProgram, 
    LAMPORTS_PER_SOL } from "@solana/web3.js"
import { NextApiRequest, NextApiResponse } from "next"
import { shopAddress } from "../../lib/addresses"
import calculatePrice from "../../lib/calculatePrice"

export type MakeTransactionInputData = {
    account: string,
}

export type MakeTransactionOutputData = {
    transaction: string,
    message: string,
}

type ErrorOutput = {
    error: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>
) {
    console.log("Handling API request...");
    try {
        const amount = calculatePrice(req.query)
        if (amount.toNumber() === 0) {
            res.status(400).json({ error: "Can't checkout with charge of 0" })
            return
        }

        const { reference } = req.query
        if (!reference) {
            res.status(400).json({ error: "Missing reference" })
            return
        }

        const { account } = req.body as MakeTransactionInputData

        if (!account) {
            res.status(400).json({ error: "Missing account" })
            return
        }

        console.log("Initial checks passed. Creating tx...");

        const buyerPublicKey = new PublicKey(account)
        const shopPublicKey = shopAddress

        const network = WalletAdapterNetwork.Devnet
        const endpoint = clusterApiUrl(network)
        const connection = new Connection(endpoint)

        const { blockhash } = await (connection.getLatestBlockhash('finalized'))

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: buyerPublicKey,
        })

        const transferInstruction = SystemProgram.transfer({
            fromPubkey: buyerPublicKey,
            lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
            toPubkey: shopPublicKey,
        })

        transferInstruction.keys.push({
            pubkey: new PublicKey(reference),
            isSigner: false,
            isWritable: false,
        })

        transaction.add(transferInstruction)

        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false
        })

        const base64 = serializedTransaction.toString('base64')

        res.status(200).json({
            transaction: base64,
            message: "Thanks for your order!"
        })
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: 'error creating transction', })
        return
    }
}