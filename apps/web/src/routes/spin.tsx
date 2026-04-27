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

export const Route = createFileRoute("/spin")({
  component: RouteComponent,
});

function RouteComponent() {
  const [modalOpen, setModalOpen] = useState(true);
  const [home, setHome] = useState<Home | null>(Home.Re);
  const [randomPrice] = useState(5);
  const [randomTime, setRandomTime] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [reward, setReward] = useState<Record<Home, number>>({
    [Home.Re]: 0,
    [Home.Drop]: 0,
    [Home.Pro]: 0,
    [Home.Tire]: 0,
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [activeCard, setActiveCard] = useState<Home | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  const { ownValue, otherValue } = useScore();

  const handleSpin = () => {
    if (skipAnimation) {
      const finalRewards = { re: 0, drop: 0, pro: 0, tire: 0 } as Record<Home, number>;
      const keys = Object.values(Home);
      for (let i = 0; i < randomTime; i++) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        finalRewards[randomKey]++;
      }
      setReward(finalRewards);
      setHasSpun(true);
      setShowSummary(true);
    } else {
      setIsSpinning(true);
      setReward({ re: 0, drop: 0, pro: 0, tire: 0 } as Record<Home, number>);
      let spinsDone = 0;
      let tempRewards = { re: 0, drop: 0, pro: 0, tire: 0 } as Record<Home, number>;
      const keys = Object.values(Home);
      
      const intervalDelay = Math.max(30, Math.min(150, 3000 / Math.max(1, randomTime))); 
      
      const interval = setInterval(() => {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setActiveCard(randomKey);
        tempRewards[randomKey]++;
        setReward({ ...tempRewards });
        spinsDone++;

        if (spinsDone >= randomTime) {
          clearInterval(interval);
          setActiveCard(null);
          setIsSpinning(false);
          setHasSpun(true);
          setTimeout(() => setShowSummary(true), 600);
        }
      }, intervalDelay);
    }
  };

  const resetGame = () => {
    setReward({ re: 0, drop: 0, pro: 0, tire: 0 } as Record<Home, number>);
    setHasSpun(false);
    setShowSummary(false);
    setRandomTime(0);
    setActiveCard(null);
    setModalOpen(true);
  };

  return (
    <>
      <Dialog 
        open={modalOpen} 
        onOpenChange={(isOpen) => {
          if (isOpen) setModalOpen(true);
        }}
      >
        <DialogContent 
          className="sm:max-w-[425px]" 
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Setup Random Spin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold uppercase">Select Home</label>
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
              <label className="text-sm font-semibold uppercase">Number of Spins</label>
              <input
                type="number"
                value={randomTime}
                onChange={(e) => setRandomTime(Number(e.target.value))}
                min={0}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <div className="flex gap-2">
                {[5, 10, 20, 50].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setRandomTime(val)}
                  >
                    {val}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 border-t pt-4">
              <Checkbox 
                id="skip-animation" 
                checked={skipAnimation} 
                onCheckedChange={(checked) => setSkipAnimation(checked as boolean)} 
              />
              <label
                htmlFor="skip-animation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Skip Animation
              </label>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-semibold uppercase">Total Price</span>
              <span className="text-xl font-bold text-primary">
                {randomPrice * randomTime} <span className="text-sm font-normal text-muted-foreground">coins</span>
              </span>
            </div>
            <div className="pt-2">
              <Button 
                onClick={() => {
                  setModalOpen(false);
                  setTimeout(() => {
                    handleSpin();
                  }, 300);
                }} 
                disabled={!home || randomTime <= 0}
                className={`w-full h-12 text-lg font-bold ${home ? HOME_COLORS[home as Home] : ""}`}
              >
                Start Random
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center justify-center min-h-dvh p-4 py-20 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-19 container max-w-6xl">
          {Object.values(Home).map((h) => (
            <Card 
              key={h}
              className={`aspect-square overflow-hidden flex flex-col items-center justify-center transition-all duration-75 relative ${activeCard === h ? `ring-8 ring-${h} scale-105 z-10 shadow-2xl` : 'border-2'} ${isSpinning && activeCard !== h ? 'opacity-60 scale-95' : ''}`}
            >
              <div className="absolute top-4 right-4 bg-muted text-foreground px-4 py-2 rounded-full text-2xl font-black shadow-sm">
                {reward[h]}
              </div>
              <div className={`bg-${h} size-24 rounded-full shadow-lg`} />
              <span className="text-5xl font-black mt-4 uppercase tracking-wider">{h}</span>
              <span
                className={`text-xl font-bold mt-2 px-3 py-1 rounded-full bg-muted/50 ${home === h ? "text-green-500" : "text-red-500"}`}
              >
                {home === h ? `+${ownValue}` : `${otherValue}`}
              </span>
            </Card>
          ))}
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
              New Game
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center font-black uppercase tracking-wider mb-2">Results</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
             {Object.values(Home).map((h) => (
               <div key={h} className="flex justify-between items-center bg-secondary/50 p-4 rounded-xl border border-border/50">
                 <div className="flex items-center gap-4">
                   <div className={`size-8 rounded-full shadow-sm bg-${h}`} />
                   <span className="uppercase font-black text-2xl">{h}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="text-sm font-semibold text-muted-foreground w-16 text-right">
                     {reward[h]} x {home === h ? ownValue : otherValue}
                   </span>
                   <span className={`text-2xl font-black w-16 text-right ${reward[h] * (home === h ? ownValue : otherValue) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                     {reward[h] * (home === h ? ownValue : otherValue) > 0 ? "+" : ""}{reward[h] * (home === h ? ownValue : otherValue)}
                   </span>
                 </div>
               </div>
             ))}
             <div className="border-t-4 border-primary/20 pt-6 mt-4 flex justify-between items-center">
               <span className="text-2xl font-black uppercase tracking-wider">Total Score</span>
               <span className={`text-4xl font-black ${Object.values(Home).reduce((acc, h) => acc + (reward[h] * (h === home ? ownValue : otherValue)), 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {Object.values(Home).reduce((acc, h) => acc + (reward[h] * (h === home ? ownValue : otherValue)), 0) > 0 ? "+" : ""}
                 {Object.values(Home).reduce((acc, h) => acc + (reward[h] * (h === home ? ownValue : otherValue)), 0)}
               </span>
             </div>
          </div>
          <Button onClick={() => setShowSummary(false)} className="w-full h-14 text-xl font-bold uppercase mt-2">
            Close Summary
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
