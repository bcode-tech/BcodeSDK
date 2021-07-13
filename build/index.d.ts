import { Wallet } from 'ethers';

declare type Configuration = {
    env?: "LOCAL" | "DEV" | "PROD";
};
declare type SdkOptions = {
    apiKey: string;
    privateKey: string;
    config?: Configuration;
};
declare class PablockSDK {
    apiKey: string;
    wallet?: Wallet;
    provider?: any;
    authToken?: string;
    env: string;
    constructor(sdkOptions: SdkOptions);
    init(): Promise<void>;
    getAuthToken(): void;
    getApiKey(): void;
    sendToken(contractAddress: string, spender: string, value: number, deadline: number, config?: Object): Promise<any>;
    requestToken(contractAddress: string, to: string, amount: number): Promise<any>;
}

export default PablockSDK;
