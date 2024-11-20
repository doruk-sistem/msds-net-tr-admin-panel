import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      
      {/* Floating circles decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">
        {/* Soft gradient text */}
        <div className="relative">
          <h1 className="text-[10rem] font-black leading-none tracking-tighter bg-gradient-to-b from-primary/50 to-primary/5 bg-clip-text text-transparent select-none">
            404
          </h1>
          
          {/* Decorative line */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        {/* Content with soft shadows */}
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-semibold text-foreground/90">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the digital sunset.
          </p>

          {/* Action buttons with hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              asChild
              size="lg"
              variant="default"
              className="relative group transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/20"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Dashboard
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="transition-all duration-300 ease-out hover:bg-primary/5"
            >
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>

          {/* Help text with subtle animation */}
          <p className="mt-12 text-sm text-muted-foreground/80 animate-pulse">
            Need assistance? <span className="text-primary/80">Contact support</span>
          </p>
        </div>
      </div>
    </div>
  );
}