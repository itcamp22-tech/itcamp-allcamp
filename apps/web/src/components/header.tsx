import { Button } from "@itcamp-allcamp/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="h-19 border-b flex items-center justify-center w-full fixed top-0 z-50 backdrop-blur-2xl">
      <div className="container px-4 py-2 flex items-center justify-between h-full">
        <button className="h-full w-fit cursor-pointer" onClick={() => navigate({ to: "/" })}>
          <img src="/icons/itcamp.svg" alt="IT Camp Logo" className="max-h-full w-auto" />
        </button>
        <Button
          onClick={() => navigate({ to: "/admin" })}
          variant={"outline"}
          size={"icon"}
        >
          <Settings2 />
        </Button>
      </div>
    </div>
  );
}
