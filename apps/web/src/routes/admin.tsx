import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin, Score } from "../contexts/admin-context";
import { INITIAL_ITEMS, DEFAULT_SCORING, DEFAULT_ECONOMY } from "../lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@itcamp-allcamp/ui/components/card";
import { Button } from "@itcamp-allcamp/ui/components/button";
import { Input } from "@itcamp-allcamp/ui/components/input";
import { Label } from "@itcamp-allcamp/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@itcamp-allcamp/ui/components/dialog";
import { Settings, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminComponent,
});

const HOUSES: (keyof Score)[] = ["re", "drop", "pro", "tire"];

function AdminComponent() {
  const [isWeightsResetOpen, setIsWeightsResetOpen] = useState(false);
  const [isScoreResetOpen, setIsScoreResetOpen] = useState(false);
  const [isScoringResetOpen, setIsScoringResetOpen] = useState(false);
  const [isEconomyResetOpen, setIsEconomyResetOpen] = useState(false);

  const {
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
    score,
    setScore,
  } = useAdmin();

  const handleWeightChange = (id: number, value: string) => {
    setItemWeights({
      ...itemWeights,
      [id]: Math.max(0, Number(value)),
    });
  };

  const handleScoreChange = (houseKey: keyof Score, oreKey: keyof Score, value: string) => {
    setScore({
      ...score,
      [houseKey]: {
        ...score[houseKey],
        [oreKey]: Math.max(0, Number(value)),
      }
    });
  };

  const resetWeights = () => {
    const defaultWeights = INITIAL_ITEMS.reduce((acc, item) => ({ 
      ...acc, 
      [item.id]: item.defaultWeight 
    }), {});
    setItemWeights(defaultWeights);
    setIsWeightsResetOpen(false);
  };

  const resetScores = () => {
    const newScore = { ...score };
    HOUSES.forEach(h => {
      newScore[h] = { re: 0, drop: 0, pro: 0, tire: 0 };
    });
    setScore(newScore);
    setIsScoreResetOpen(false);
  };

  const resetScoring = () => {
    setOwnValue(DEFAULT_SCORING.ownValue);
    setOtherValue(DEFAULT_SCORING.otherValue);
    setIsScoringResetOpen(false);
  };

  const resetEconomy = () => {
    setSpinPrice(DEFAULT_ECONOMY.spinPrice);
    setSecretRoomPrice(DEFAULT_ECONOMY.secretRoomPrice);
    setTicketStock(DEFAULT_ECONOMY.ticketStock);
    setIsEconomyResetOpen(false);
  };

  return (
    <div className="min-h-dvh bg-background p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8 py-20">
        <header className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Settings className="size-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider">Admin Dashboard</h1>
            <p className="text-muted-foreground font-medium">Configure game economics and probabilities</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl uppercase tracking-wider">Global Scoring</CardTitle>
              <Dialog open={isScoringResetOpen} onOpenChange={setIsScoringResetOpen}>
                <Button variant="outline" size="sm" onClick={() => setIsScoringResetOpen(true)}>
                  Reset
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertTriangle className="size-5" />
                      <DialogTitle>Confirm Reset Scoring</DialogTitle>
                    </div>
                    <DialogDescription>
                      This will reset the point multipliers back to their default values (Own: {DEFAULT_SCORING.ownValue}, Other: {DEFAULT_SCORING.otherValue}).
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => setIsScoringResetOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={resetScoring}>Yes, reset scoring</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Points Gained (Own House)</Label>
                <Input
                  type="number"
                  value={ownValue}
                  onChange={(e) => setOwnValue(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Points Impact (Other Houses)</Label>
                <Input
                  type="number"
                  value={otherValue}
                  onChange={(e) => setOtherValue(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl uppercase tracking-wider">Economy</CardTitle>
              <Dialog open={isEconomyResetOpen} onOpenChange={setIsEconomyResetOpen}>
                <Button variant="outline" size="sm" onClick={() => setIsEconomyResetOpen(true)}>
                  Reset
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertTriangle className="size-5" />
                      <DialogTitle>Confirm Reset Economy</DialogTitle>
                    </div>
                    <DialogDescription>
                      This will reset spin prices and ticket stock back to their original values.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => setIsEconomyResetOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={resetEconomy}>Yes, reset economy</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Standard Spin Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={spinPrice}
                  onChange={(e) => setSpinPrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Secret Room Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={secretRoomPrice}
                  onChange={(e) => setSecretRoomPrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Major Cineplex Ticket Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={ticketStock}
                  onChange={(e) => setTicketStock(Math.max(0, Number(e.target.value)))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl uppercase tracking-wider">House Inventories</CardTitle>
            <Dialog open={isScoreResetOpen} onOpenChange={setIsScoreResetOpen}>
              <Button variant="outline" size="sm" onClick={() => setIsScoreResetOpen(true)}>
                Reset to 0
              </Button>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    <AlertTriangle className="size-5" />
                    <DialogTitle>Confirm Reset Scores</DialogTitle>
                  </div>
                  <DialogDescription>
                    This will set ALL house inventories to 0. This action is permanent and will affect all live players.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="ghost" onClick={() => setIsScoreResetOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={resetScores}>Yes, reset all scores</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {HOUSES.map((houseKey) => (
                <div key={houseKey} className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                  <h3 className="font-black uppercase tracking-wider text-primary border-b pb-2 mb-2">
                    {houseKey} House Inventory
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {HOUSES.map((oreKey) => (
                      <div key={oreKey} className="flex items-center justify-between gap-2">
                        <Label className="text-xs uppercase w-8">{oreKey}:</Label>
                        <Input
                          type="number"
                          min={0}
                          value={score[houseKey][oreKey]}
                          onChange={(e) => handleScoreChange(houseKey, oreKey, e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl uppercase tracking-wider">Secret Room Drop Rates (Weights)</CardTitle>
            <Dialog open={isWeightsResetOpen} onOpenChange={setIsWeightsResetOpen}>
              <Button variant="outline" size="sm" onClick={() => setIsWeightsResetOpen(true)}>
                Reset to Defaults
              </Button>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    <AlertTriangle className="size-5" />
                    <DialogTitle>Confirm Reset Weights</DialogTitle>
                  </div>
                  <DialogDescription>
                    This will restore all item drop weights to their original factory values.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="ghost" onClick={() => setIsWeightsResetOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={resetWeights}>Yes, reset weights</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {INITIAL_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex flex-col overflow-hidden pr-2 w-2/3">
                    <span className="font-bold text-sm truncate">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.rarity}</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/3">
                    <Label className="text-xs shrink-0">Weight:</Label>
                    <Input
                      type="number"
                      min={0}
                      value={itemWeights[item.id]}
                      onChange={(e) => handleWeightChange(item.id, e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-xl flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider">Total Weight Base</span>
              <span className="text-xl font-black text-primary">
                {Object.values(itemWeights).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}