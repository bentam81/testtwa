import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell, toNano, fromNano } from "ton-core";

export default class BWuserJettonAccount implements Contract {

    static createForDeploy(code: Cell, platformAddress: Address, userAddress: Address, platformJettonAddress: Address): BWuserJettonAccount {
        const data = beginCell()
            .storeAddress(platformAddress)
            .storeAddress(userAddress)
            .storeAddress(platformJettonAddress)
            .storeCoins(toNano(0))
            .endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new BWuserJettonAccount(address, { code, data });
    }

    static createFromAddress(address: Address) {
        return new BWuserJettonAccount(address);
    }

    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01", // send 0.01 TON to contract for rent
            bounce: false
        });
    }

    async sendInternal(provider: ContractProvider, via: Sender, body: Cell, value?: bigint) {
        await provider.internal(via, {
            value: value ?? toNano('0.05'),
            body: body
        })
    }

    async getIsActive(provider: ContractProvider) {
        let state = await provider.getState();
        return (state.state.type == 'active');
    }

    async getTonBalance(provider: ContractProvider) {
        const { stack } = await provider.get("get_ton_balance", []);
        return stack.readBigNumber();
    }

    async getJettonBalance(provider: ContractProvider) {
        const { stack } = await provider.get("get_user_jetton_account_data", []);
        return stack.readBigNumber();
    }

    async getUserJettonAccountData(provider: ContractProvider) {
        const { stack } = await provider.get("get_user_jetton_account_data", []);
        let ret = {
            balance: stack.readBigNumber(),
            platformAddr: stack.readAddress(),
            userAddr: stack.readAddress(),
            jettonAddr: stack.readAddress(),
        }
        return ret;
    }

    async sendResetGas(provider: ContractProvider, via: Sender, gas = 0.01) {
        const messageBody = beginCell()
            .storeUint(0x42a0fb43, 32) // op
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: gas.toString(),
            body: messageBody
        });
    }
}
