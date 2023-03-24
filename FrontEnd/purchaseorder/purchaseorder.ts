import { PurchaseorderLineitem } from "./purchaseorder-lineitem";

export interface Purchaseorder {
    id: number;
    vendorid: number;
    items: PurchaseorderLineitem[];
    amount: number;
    podate?: string;
}
