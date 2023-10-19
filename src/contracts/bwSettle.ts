import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell, toNano, fromNano } from "ton-core";

export default class BWsettle implements Contract {

    static createForDeploy(code: Cell, adminAddress: Address, userJettonAccountCode: Cell): BWsettle {
        const data = beginCell()
            .storeUint(0, 1)
            .storeAddress(adminAddress)
            .storeRef(userJettonAccountCode)
            .endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new BWsettle(address, { code, data });
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

    async getTonBalance(provider: ContractProvider) {
        const { stack } = await provider.get("get_ton_balance", []);
        return stack.readBigNumber();
    }

    async getSettleData(provider: ContractProvider) {
        const { stack } = await provider.get("get_settle_data", []);
        let ret = {
            isLock: stack.readBigNumber(),
            adminAddr: stack.readAddress(),
            userJettonAccountCode: stack.readCell()
        }
        return ret;
    }

    async getUserJettonAccountAddress(provider: ContractProvider, ownerAddress: Address, bwJettonWalletAddress: Address): Promise<Address> {
        const res = await provider.get('get_user_jetton_account_address',
            [
                { type: 'slice', cell: beginCell().storeAddress(ownerAddress).endCell() },
                { type: 'slice', cell: beginCell().storeAddress(bwJettonWalletAddress).endCell() }
            ])
        return res.stack.readAddress()
    }

    async sendLock(provider: ContractProvider, via: Sender, gas = 0.01) {
        const messageBody = beginCell()
            .storeUint(0x878f9b0e, 32) // op
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: gas.toString(),
            body: messageBody
        });
    }

    async sendUnlock(provider: ContractProvider, via: Sender, gas = 0.01) {
        const messageBody = beginCell()
            .storeUint(0x6ae4b0ef, 32) // op
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: gas.toString(),
            body: messageBody
        });
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
