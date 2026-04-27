import { createContext, useContext, useState, ReactNode } from "react";
import { INITIAL_ITEMS } from "../lib/constants";

interface AdminContextType {
  ownValue: number;
  setOwnValue: (v: number) => void;
  otherValue: number;
  setOtherValue: (v: number) => void;
  spinPrice: number;
  setSpinPrice: (v: number) => void;
  secretRoomPrice: number;
  setSecretRoomPrice: (v: number) => void;
  ticketStock: number;
  setTicketStock: (v: number) => void;
  itemWeights: Record<number, number>;
  setItemWeights: (weights: Record<number, number>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [ownValue, setOwnValue] = useState(25);
  const [otherValue, setOtherValue] = useState(-10);
  const [spinPrice, setSpinPrice] = useState(5);
  const [secretRoomPrice, setSecretRoomPrice] = useState(15);
  const [ticketStock, setTicketStock] = useState(5);
  const [itemWeights, setItemWeights] = useState<Record<number, number>>(
    INITIAL_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultWeight }), {})
  );

  return (
    <AdminContext.Provider
      value={{
        ownValue,
        setOwnValue,
        otherValue,
        setOtherValue,
        spinPrice,
        setSpinPrice,
        secretRoomPrice,
        setSecretRoomPrice,
        ticketStock,
        setTicketStock,
        itemWeights,
        setItemWeights,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}