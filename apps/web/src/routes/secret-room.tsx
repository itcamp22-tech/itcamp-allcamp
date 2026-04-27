import { useScore } from "../hooks/use-score";
import { Card } from "@itcamp-allcamp/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@itcamp-allcamp/ui/components/dialog";
import { Button } from "@itcamp-allcamp/ui/components/button";
import { Checkbox } from "@itcamp-allcamp/ui/components/checkbox";
import { Input } from "@itcamp-allcamp/ui/components/input";
import { Label } from "@itcamp-allcamp/ui/components/label";
import { Separator } from "@itcamp-allcamp/ui/components/separator";
import { Ticket, Info } from "lucide-react";
import { INITIAL_ITEMS, GachaItem } from "../lib/constants";
import { useAdmin } from "../contexts/admin-context";

enum Home {
  Re = "re",
  Drop = "drop",
  Pro = "pro",
  Tire = "tire",
}

const HOME_COLORS: Record<Home, string> = {
  [Home.Re]: "bg-re hover:bg-re/90 text-white border-transparent",
  [Home.Drop]: "bg-drop hover:bg-drop/90 text-white border-transparent",
  [Home.Pro]: "bg-pro hover:bg-pro/90 text-white border-transparent",
  [Home.Tire]: "bg-tire hover:bg-tire/90 text-white border-transparent",
};

const RARITY_STYLES = {
  Common: "text-slate-500 border-slate-500/20",
  Uncommon: "text-green-500 border-green-500/20",
  Rare: "text-blue-500 border-blue-500/20",
  Epic: "text-purple-500 border-purple-500/20",
  Legendary: "text-yellow-500 border-yellow-500/20 shadow-yellow-500/20 animate-pulse",
};

export const Route = createFileRoute("/secret-room")({
  component: SecretRoomComponent,
});

function SecretRoomComponent() {
  const { secretRoomPrice, ticketStock, itemWeights: weights } = useAdmin();
  
  const [modalOpen, setModalOpen] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [home, setHome] = useState<Home | null>(Home.Re);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const randomPrice = secretRoomPrice;

  const [isSpinning, setIsSpinning] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GachaItem | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [targetHouse, setTargetHouse] = useState<Home | null>(null);

  const { ownValue, otherValue } = useScore();

  const handleSpin = () => {
    setIsSpinning(true);
    setResult(null);

    // Apply Ticket Stock constraint (if out of stock, weight is 0)
    const adjustedWeights = { ...weights };
    if (ticketStock <= 0) {
      adjustedWeights[7] = 0; // ID 7 is the Movie Ticket
    }

    const validItems = INITIAL_ITEMS.filter(item => adjustedWeights[item.id] > 0);
    const totalWeight = validItems.reduce((acc, item) => acc + adjustedWeights[item.id], 0);

    if (totalWeight === 0) {
      alert("Error: All item weights are set to 0. Please fix in settings.");
      setIsSpinning(false);
      setModalOpen(true);
      return;
    }

    let random = Math.random() * totalWeight;
    let selectedItem = validItems[0];

    for (const item of validItems) {
      if (random < adjustedWeights[item.id]) {
        selectedItem = item;
        break;
      }
      random -= adjustedWeights[item.id];
    }

    if (skipAnimation) {
      setResult(selectedItem);
      setIsSpinning(false);
      setHasSpun(true);
      setShowResult(true);
    } else {
      let spinsDone = 0;
      const totalSpins = 30 + Math.floor(Math.random() * 10); // Random number of animation cycles
      const baseDelay = 50;
      
      const animateSpin = () => {
        if (spinsDone >= totalSpins) {
          setActiveCard(selectedItem.id);
          setTimeout(() => {
            setResult(selectedItem);
            setIsSpinning(false);
            setHasSpun(true);
            setShowResult(true);
          }, 800);
          return;
        }

        const randomDisplayItem = validItems[Math.floor(Math.random() * validItems.length)];
        setActiveCard(randomDisplayItem.id);
        
        spinsDone++;
        const easeOutQuad = (t: number) => t * (2 - t);
        const progress = spinsDone / totalSpins;
        const delay = baseDelay + (easeOutQuad(progress) * 300);

        setTimeout(animateSpin, delay);
      };

      animateSpin();
    }
  };

  const resetGame = () => {
    setResult(null);
    setHasSpun(false);
    setShowResult(false);
    setActiveCard(null);
    setTargetHouse(null);
    setModalOpen(true);
  };

  // Point Calculation Logic for Tooltips/Display based on useScore logic
  const getPointEffect = (item: GachaItem) => {
    if (!home) return "";
    switch (item.id) {
      case 1: return `Gain +${2 * ownValue} pts / Potentially lose others`;
      case 2: return `Cause ${2 * otherValue} pts to all other Houses`;
      case 3: return `Lose 2 ores / Give ${2 * otherValue} pts to target`;
      case 4: return `Gain +${4 * ownValue} pts`;
      case 5: return `Gain +${2 * ownValue} pts / Deduct target ores`;
      case 6: return `Drop all other Houses by 2 of their own ores`;
      case 7: return `Real World Reward`;
      case 8: return `+5 Coins`;
      case 9: return `Deduct 2 target ores`;
      case 10: return `0 pts`;
      default: return "";
    }
  };

  return (
    <>
      <Dialog 
        open={modalOpen} 
        onOpenChange={(isOpen) => {
          if (isOpen && !isSpinning) setModalOpen(true);
        }}
      >
        <DialogContent 
          className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto" 
          showCloseButton={false}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl text-center flex-1">Setup Secret Room</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4 rounded-full" 
                onClick={() => setShowInfo(true)}
              >
                <Info className="size-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-3">
              <Label className="uppercase font-semibold text-muted-foreground">Select Home</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(Home).map((h) => (
                  <Button
                    key={h}
                    variant={home === h ? "default" : "outline"}
                    onClick={() => setHome(h)}
                    className={`uppercase font-bold ${home === h ? HOME_COLORS[h as Home] : ""}`}
                  >
                    {h}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="uppercase font-semibold text-muted-foreground">Major Cineplex Tickets Stock</Label>
                <div className="flex items-center gap-2">
                  <Ticket className="size-5 text-yellow-500" />
                  <span className="text-xl font-bold text-yellow-500">{ticketStock}</span>
                </div>
              </div>
              <Input
                type="number"
                value={ticketStock}
                readOnly
                disabled
              />
              {ticketStock === 0 && (
                <p className="text-xs text-destructive mt-1 font-medium">* Tickets are out of stock! The drop rate for this item will be 0.</p>
              )}
            </div>

            <Separator />

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="skip-animation" 
                checked={skipAnimation} 
                onCheckedChange={(checked) => setSkipAnimation(checked as boolean)} 
              />
              <Label
                htmlFor="skip-animation"
                className="cursor-pointer"
              >
                Skip Animation
              </Label>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-2">
              <Label className="uppercase font-semibold text-muted-foreground">Price</Label>
              <span className="text-xl font-bold text-primary">
                {randomPrice} <span className="text-sm font-normal text-muted-foreground">coins</span>
              </span>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => {
                  setModalOpen(false);
                  setTimeout(() => handleSpin(), 300);
                }} 
                disabled={!home}
                className={`w-full h-12 text-lg font-bold ${home ? HOME_COLORS[home as Home] : ""}`}
              >
                Start Secret Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center justify-center min-h-dvh p-4 py-20 relative">
        <header className="text-center space-y-2 mb-12 w-full mt-19 container max-w-6xl relative">
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative w-full">
             <h1 className="text-5xl font-black uppercase tracking-wider text-primary">
               Secret Room
             </h1>
             <Button 
               variant="outline" 
               size="icon" 
               className="sm:absolute sm:right-0 rounded-full shrink-0" 
               onClick={() => setShowInfo(true)}
             >
               <Info className="size-6" />
             </Button>
           </div>
           <p className="text-muted-foreground font-medium text-sm">
             Spend 15 Coins to draw one item.
           </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full container max-w-6xl">
          {INITIAL_ITEMS.map((item) => {
            const isActive = activeCard === item.id;
            const outOfStock = item.id === 7 && ticketStock === 0;
            const weight = outOfStock ? 0 : weights[item.id];
            const totalWeight = INITIAL_ITEMS.reduce((acc, i) => acc + (i.id === 7 && ticketStock === 0 ? 0 : weights[i.id]), 0);
            const dropRate = totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(1) : "0.0";

            return (
              <Card 
                key={item.id}
                className={`
                  relative overflow-hidden flex flex-col items-center p-4 transition-all duration-75 border-2
                  ${isActive ? `scale-105 z-20 shadow-2xl ring-4 ring-primary` : 'border-border'}
                  ${isSpinning && !isActive ? 'opacity-60 scale-95' : ''}
                  ${outOfStock ? 'opacity-40 grayscale' : ''}
                `}
              >
                <div className={`size-16 mb-4 rounded-full flex items-center justify-center bg-muted/50 border-2 ${RARITY_STYLES[item.rarity]}`}>
                   <item.icon className="size-8" />
                </div>
                
                <h3 className="text-sm font-bold text-center leading-tight min-h-[40px] flex items-center mb-2">
                  {item.name}
                </h3>
                
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 bg-background border ${RARITY_STYLES[item.rarity]}`}>
                  {item.rarity}
                </span>

                <div className="mt-auto w-full flex justify-between items-center text-[10px] font-mono text-muted-foreground border-t pt-2">
                  <span>{dropRate}% Rate</span>
                  {item.id === 7 && <span className="text-yellow-500 font-bold">{ticketStock} Left</span>}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-16 z-20 h-20 items-center">
          {!hasSpun ? (
            isSpinning ? (
              <span className="text-4xl font-black uppercase tracking-widest text-primary animate-pulse">
                SPINNING...
              </span>
            ) : null
          ) : (
            <Button 
              size="lg" 
              variant="outline"
              className="w-64 h-20 text-2xl font-bold uppercase tracking-wider hover:bg-secondary border-4"
              onClick={resetGame}
            >
              New Draw
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
             <DialogTitle className="text-3xl text-center font-black uppercase tracking-wider mb-2 text-primary">Item Found</DialogTitle>
          </DialogHeader>
           {result && (
             <div className="flex flex-col items-center text-center gap-4 py-4">
               <div className={`size-24 rounded-full flex items-center justify-center bg-muted/50 border-4 shadow-xl ${RARITY_STYLES[result.rarity]}`}>
                 <result.icon className="size-12" />
               </div>
               
               <div className="space-y-4 w-full mt-2">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">{result.name}</h2>
                 
                 <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                   <p className="text-sm font-medium leading-relaxed">
                     {result.description}
                   </p>
                 </div>
                 
                 <div className="bg-muted/30 rounded-xl p-4 border border-border/50 flex justify-between items-center">
                   <span className="text-xs font-bold uppercase text-muted-foreground">Effect Summary</span>
                   <span className="text-sm font-black text-primary">
                     {getPointEffect(result)}
                   </span>
                 </div>

                 {[3, 5, 9].includes(result.id) && (
                   <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-3 w-full">
                     <span className="text-xs font-bold uppercase text-muted-foreground block text-left">Select Target House</span>
                     <div className="grid grid-cols-3 gap-2">
                       {Object.values(Home).filter(h => h !== home).map((h) => (
                         <Button
                           key={h}
                           variant={targetHouse === h ? "default" : "outline"}
                           onClick={() => setTargetHouse(h)}
                           className={`uppercase font-bold ${targetHouse === h ? HOME_COLORS[h as Home] : ""}`}
                         >
                           {h}
                         </Button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               <Button 
                 onClick={() => setShowResult(false)} 
                 disabled={[3, 5, 9].includes(result.id) && !targetHouse}
                 className="w-full h-14 mt-4 text-lg font-bold uppercase"
               >
                 {[3, 5, 9].includes(result.id) ? "Confirm Selection" : "Close"}
               </Button>
             </div>
           )}
        </DialogContent>
      </Dialog>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
             <DialogTitle className="text-2xl font-black uppercase tracking-wider text-primary">รายละเอียดไอเทม</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {INITIAL_ITEMS.map(item => (
              <div key={item.id} className="flex gap-4 items-start p-4 rounded-xl border border-border/50 bg-muted/30">
                <div className={`size-12 shrink-0 rounded-full flex items-center justify-center bg-background border ${RARITY_STYLES[item.rarity]}`}>
                   <item.icon className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <span className={`inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-background border ${RARITY_STYLES[item.rarity]}`}>
                    {item.rarity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


