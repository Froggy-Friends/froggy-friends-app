export interface ItemRequest {
    name: string;
    description: string;
    category: string;
    twitter: string;
    discord: string;
    website: string;
    endDate: number;
    collabId: number;
    collabAddress: string;
    isCommunity: boolean;
    isBoost: boolean;
    isFriend: boolean;
    isCollabFriend: boolean;
    isTrait: boolean;
    isPhysical: boolean;
    isAllowlist: boolean;
    rarity: string;
    traitLayer: string;
    price: number;
    percent: number;
    supply: number;
    walletLimit: number;
    isOnSale: boolean;
  }