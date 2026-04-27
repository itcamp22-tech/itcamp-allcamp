import { Ticket, Coins, Ghost, Zap, Trash2, ArrowRightLeft, ShieldAlert, Sparkles, Target, ScanSearch } from "lucide-react";

export interface GachaItem {
  id: number;
  name: string;
  description: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  defaultWeight: number;
  icon: any;
}

export const DEFAULT_SCORING = {
  ownValue: 25,
  otherValue: -10,
};

export const DEFAULT_ECONOMY = {
  spinPrice: 5,
  secretRoomPrice: 15,
  ticketStock: 5,
};

export const INITIAL_ITEMS: GachaItem[] = [
  {
    id: 1,
    name: "Alchemist's Crucible",
    description: "เปลี่ยนเเร่ 2 เม็ดของสีไหนก็ได้ที่อยู่ในคลังบ้านตัวเองให้เป็นเเร่บ้านตัวเอง เพิ่มเเต้มบ้านตัวเอง",
    rarity: "Uncommon",
    defaultWeight: 12,
    icon: Sparkles,
  },
  {
    id: 2,
    name: "Trojan Contagion",
    description: "เพิ่มเเร่สีของบ้านตัวเอง 2 เเร่ ให้ทุกบ้านยกเว้นบ้านตัวเอง ลดเเต้มบ้านอื่น",
    rarity: "Rare",
    defaultWeight: 10,
    icon: ShieldAlert,
  },
  {
    id: 3,
    name: "Smuggler's Contract",
    description: "ย้ายเเร่ 2 อันสีไหนก็ได้ในคลังบ้านเราไปบ้านคนอื่น ลดเเต้มบ้านอื่น",
    rarity: "Common",
    defaultWeight: 15,
    icon: ArrowRightLeft,
  },
  {
    id: 4,
    name: "Motherlode Geode",
    description: "เพิ่มเเร่ให้บ้านตัวเอง 4 เเร่ (100 เเต้ม) เพิ่มเเต้มบ้านตัวเอง",
    rarity: "Epic",
    defaultWeight: 8,
    icon: Zap,
  },
  {
    id: 5,
    name: "Phantom Thief Gloves",
    description: "ขโมยเเร่สีของบ้านอื่น 2 เเร่ มาเป็นเเร่สีของบ้านตัวเอง (เช่น ขโมยเเร่ที่เป็นของบ้าน Drop 2 เเร่ ซึ่งเป็นสีม่วง เปลี่ยนเป็นของบ้าน Pro ทั้ง 2 เเร่ที่เป็นสีฟ้า) เพิ่มเเต้มบ้านตัวเอง",
    rarity: "Epic",
    defaultWeight: 5,
    icon: ScanSearch,
  },
  {
    id: 6,
    name: "Void Singularity",
    description: "ลดเเร่สีของเเต่ละบ้าน ในคลังของทุกๆบ้านยกเว้นบ้านตัวเองอย่างละ 2 เเร่ ลดเเต้มบ้านคนอื่น",
    rarity: "Rare",
    defaultWeight: 7,
    icon: Trash2,
  },
  {
    id: 7,
    name: "Golden Screen Pass",
    description: "บัตร Major 5 ใบ (อัตราออกน้อย เเต่ไม่ใช่น้อยจนไม่ออก)",
    rarity: "Legendary",
    defaultWeight: 3,
    icon: Ticket,
  },
  {
    id: 8,
    name: "Merchant's Refund",
    description: "ได้เหรียญ 5 เหรียญ",
    rarity: "Common",
    defaultWeight: 20,
    icon: Coins,
  },
  {
    id: 9,
    name: "Targeted Sabotage",
    description: "ลดเเร่ของบ้านคนอื่น 2 เเร่ เลือกบ้านไหนก็ได้ ลดเเต้มบ้านคนอื่น",
    rarity: "Uncommon",
    defaultWeight: 10,
    icon: Target,
  },
  {
    id: 10,
    name: "Abyssal Dust",
    description: "ไม่ได้อะไรเลย",
    rarity: "Common",
    defaultWeight: 10,
    icon: Ghost,
  },
];