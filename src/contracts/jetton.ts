import {
  Contract,
  ContractProvider,
  Address,
  Cell,
  beginCell,
} from "ton-core";

export default class Jetton implements Contract {
  async getWalletAddress(provider: ContractProvider, forAddress: Address) {
    const { stack } = await provider.get("get_wallet_address", [
      { type: "slice", cell: beginCell().storeAddress(forAddress).endCell() },
    ]);

    return stack.readAddress().toString();
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) { }
}
