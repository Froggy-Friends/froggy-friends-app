export interface ItemRequest {
    admin: string;
    message: string;
    signature: string;
    name: string;
    description: string;
    category: string;
    twitter: string;
    discord: string;
    website: string;
    endDate: number;
    collabId: string;
    isCommunity: boolean;
    isBoost: boolean;
    isTrait: boolean;
    isPhysical: boolean;
    isAllowlist: boolean;
    rarity: string;
    friendOrigin: string;
    traitLayer: string;
    price: string;
    percent: string;
    supply: string;
    walletLimit: string;
    isOnSale: boolean;
  }