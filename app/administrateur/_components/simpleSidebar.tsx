import { Button } from "@/app/_components/_layout/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BaseComponent } from "@/utils/types";
import { Menu } from "lucide-react";

export function SimpleSidebar({ children }: BaseComponent) {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">{children}</SheetContent>
      </Sheet>
    </div>
  );
}
