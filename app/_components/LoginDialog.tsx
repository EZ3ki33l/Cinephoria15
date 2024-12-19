'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/app/_components/_layout/button";
import { SignInButton } from "@clerk/nextjs";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle>Connexion requise</DialogTitle>
          <DialogDescription>
            Veuillez vous connecter pour continuer votre réservation.
          </DialogDescription>
        </DialogHeader>
        <SignInButton mode="modal">
          <Button onClick={onClose}>
            Se connecter
          </Button>
        </SignInButton>
      </DialogContent>
    </Dialog>
  );
} 