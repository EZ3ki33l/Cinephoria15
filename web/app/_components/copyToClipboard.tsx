"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./_layout/button";

interface CopyToClipboardProps {
  text: string;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text }) => {
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`Texte : " ${text} " copié.`);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-5 space-x-2 bg-gray-light rounded-full border shadow-inner">
      <span>{text}</span>
      <Button action={handleCopyClick}>
        <Copy />
      </Button>
    </div>
  );
};
