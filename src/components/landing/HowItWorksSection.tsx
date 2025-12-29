import { Smartphone, Users, TrendingUp, Heart } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "Get Your Digital Twin",
      description: "We create a personalized digital replica of your metabolism using advanced sensors and AI technology."
    },
    {
      icon: Users,
      title: "Expert Care Team",
      description: "Get matched with doctors, nutritionists, and health coaches who guide your journey."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Insights",
      description: "Receive personalized recommendations for food, sleep, and activity based on your body's response."
    },
    {
      icon: Heart,
      title: "Reverse & Thrive",
      description: "Watch your health transform as you reverse diabetes and achieve lasting metabolic wellness."
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How Twin Health Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our science-backed approach combines cutting-edge technology with personalized care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <step.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
