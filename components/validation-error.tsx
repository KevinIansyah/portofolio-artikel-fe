import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ValidationError({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="bg-destructive/20 border-destructive">
      <Info />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
