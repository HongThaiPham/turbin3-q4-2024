import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { Turbin3Prereq, IDL } from "./Turbin3_prereq";

export function getTurbin3Program(connection: Connection, wallet: Wallet | undefined = undefined) {
    if (!wallet) {
        return new Program(IDL as Turbin3Prereq, { connection });
    }

    const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    })
    return new Program(IDL as Turbin3Prereq, provider);
}