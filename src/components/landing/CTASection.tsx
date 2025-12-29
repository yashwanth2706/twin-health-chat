import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
          Ready to Reverse Your Diabetes?
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Take the first step towards a healthier you. Book a free consultation with our experts and discover how Twin Health can transform your life.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-full"
          >
            Book Free Consultation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg rounded-full"
          >
            <Phone className="mr-2 w-5 h-5" />
            Call Us Now
          </Button>
        </div>

        <p className="mt-8 text-primary-foreground/60 text-sm">
          No commitment required • 100% confidential • Expert guidance
        </p>
      </div>
    </section>
  );
};

export default CTASection;
