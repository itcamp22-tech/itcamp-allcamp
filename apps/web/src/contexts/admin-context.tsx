import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { INITIAL_ITEMS } from "../lib/constants";

export interface CategoryScore {
  re: number;
  drop: number;
  pro: number;
  tire: number;
}

export interface Score {
  re: CategoryScore;
  drop: CategoryScore;
  pro: CategoryScore;
  tire: CategoryScore;
}

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
  
  score: Score;
  setScore: (score: Score) => void;
  connected: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const [ownValue, setOwnValueLocal] = useState(25);
  const [otherValue, setOtherValueLocal] = useState(-10);
  const [spinPrice, setSpinPriceLocal] = useState(5);
  const [secretRoomPrice, setSecretRoomPriceLocal] = useState(15);
  const [ticketStock, setTicketStockLocal] = useState(5);
  const [itemWeights, setItemWeightsLocal] = useState<Record<number, number>>(
    INITIAL_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultWeight }), {})
  );

  const [score, setScoreLocal] = useState<Score>({
    re: { re: 10, drop: 1, pro: 1, tire: 1 },
    drop: { re: 2, drop: 15, pro: 4, tire: 1 },
    pro: { re: 3, drop: 2, pro: 8, tire: 0 },
    tire: { re: 0, drop: 0, pro: 0, tire: 0 },
  });

  useEffect(() => {
    // In production, you'd use a dynamic host based on environment
    const socket = new WebSocket("ws://103.216.158.108:3000/ws");
    
    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "INIT" || data.type === "STATE_UPDATE") {
        const { admin, score: newScore } = data.payload;
        setOwnValueLocal(admin.ownValue);
        setOtherValueLocal(admin.otherValue);
        setSpinPriceLocal(admin.spinPrice);
        setSecretRoomPriceLocal(admin.secretRoomPrice);
        setTicketStockLocal(admin.ticketStock);
        setItemWeightsLocal(admin.itemWeights);
        setScoreLocal(newScore);
      }
    };

    socket.onclose = () => {
      setConnected(false);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendAdminUpdate = useCallback((payload: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "UPDATE_ADMIN", payload }));
    }
  }, [ws]);

  const sendScoreUpdate = useCallback((payload: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "UPDATE_SCORE", payload }));
    }
  }, [ws]);

  const setOwnValue = (v: number) => {
    setOwnValueLocal(v);
    sendAdminUpdate({ ownValue: v });
  };

  const setOtherValue = (v: number) => {
    setOtherValueLocal(v);
    sendAdminUpdate({ otherValue: v });
  };

  const setSpinPrice = (v: number) => {
    setSpinPriceLocal(v);
    sendAdminUpdate({ spinPrice: v });
  };

  const setSecretRoomPrice = (v: number) => {
    setSecretRoomPriceLocal(v);
    sendAdminUpdate({ secretRoomPrice: v });
  };

  const setTicketStock = (v: number) => {
    setTicketStockLocal(v);
    sendAdminUpdate({ ticketStock: v });
  };

  const setItemWeights = (weights: Record<number, number>) => {
    setItemWeightsLocal(weights);
    sendAdminUpdate({ itemWeights: weights });
  };

  const setScore = (newScore: Score) => {
    setScoreLocal(newScore);
    sendScoreUpdate(newScore);
  };

  return (
    <AdminContext.Provider
      value={{
        ownValue, setOwnValue,
        otherValue, setOtherValue,
        spinPrice, setSpinPrice,
        secretRoomPrice, setSecretRoomPrice,
        ticketStock, setTicketStock,
        itemWeights, setItemWeights,
        score, setScore,
        connected
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