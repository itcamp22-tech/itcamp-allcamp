import { Button } from "@itcamp-allcamp/ui/components/button"
import { Settings2 } from "lucide-react";

export default function Header() {
  return (
    <div className="h-19 border-b flex items-center justify-center w-full fixed top-0 z-50 backdrop-blur-2xl">
      <div className="container px-4 py-2 flex items-center justify-between h-full">
        <img src="/icons/itcamp.svg" alt="" className="max-h-full w-auto" />
        <Button variant={"outline"} size={"icon"}>
          <Settings2 />
        </Button>
      </div>
    </div>
  );
}
