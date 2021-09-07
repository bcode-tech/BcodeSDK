import { Wallet } from "ethers";
declare type Configuration = {
    env?: "LOCAL" | "DEV" | "PROD";
    network: "MUMBAI" | "LOCAL";
};
declare type SdkOptions = {
    apiKey: string;
    privateKey: string;
    config?: Configuration;
};
export declare class PablockSDK {
    apiKey: string;
    wallet?: Wallet;
    provider?: any;
    authToken?: string;
    env: string;
    network: string;
    constructor(sdkOptions: SdkOptions);
    init(): Promise<void>;
    getAuthToken(): string | undefined;
    getApiKey(): string;
    sendToken(contractAddress: string, spender: string, value: number, deadline: number): Promise<any>;
    requestToken(contractAddress: string, to: string, amount: number): Promise<any>;
}
export {};
