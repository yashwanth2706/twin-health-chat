import teamSpirit from "@/assets/illustrations/team-spirit.png";
import fitnessStats from "@/assets/illustrations/fitness-stats.png";
import treatment from "@/assets/illustrations/treatment.png";
import personalGrowth from "@/assets/illustrations/personal-growth.png";
import fitnessTracking from "@/assets/illustrations/fitness-tracking.png";

const HeroSection = () => {
  const conditions = [
    "Prediabetes",
    "Diabetes", 
    "Obesity",
    "PCOD",
    "Metabolic Wellness for Preventive Care"
  ];

  return (
    <section className="w-full py-12 md:py-20 px-6 md:px-12 bg-[hsl(220,40%,92%)]">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[hsl(220,60%,20%)] leading-tight mb-6">
          Reverse Diabetes with Twin Health<br />
          India's Whole Body Digital Twin™
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6">
          {conditions.map((condition, index) => (
            <span key={condition} className="flex items-center">
              <span className="text-[hsl(220,60%,20%)] font-semibold text-lg md:text-xl">
                {condition}
              </span>
              {index < conditions.length - 1 && (
                <span className="ml-2 md:ml-4 text-[hsl(220,60%,20%)] opacity-50">|</span>
              )}
            </span>
          ))}
        </div>

        <div className="w-full max-w-3xl mx-auto h-1 bg-gradient-to-r from-transparent via-accent to-transparent mb-8" />

        <p className="text-lg md:text-xl text-[hsl(220,40%,35%)] max-w-3xl mx-auto leading-relaxed mb-12">
          We help you to reverse diabetes, obesity and PCOD by healing the exact root cause of your metabolism. Our Whole Body Digital Twin uses real-time data to deliver personalised guidance for your lifestyle
        </p>

        {/* Illustration Collage */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="col-span-1 row-span-2 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl overflow-hidden flex items-center justify-center p-4">
              <img 
                src={treatment} 
                alt="Expert medical care and treatment" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-muted rounded-2xl overflow-hidden flex items-center justify-center p-3">
              <img 
                src={teamSpirit} 
                alt="Community support and teamwork" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-muted rounded-2xl overflow-hidden flex items-center justify-center p-3">
              <img 
                src={fitnessStats} 
                alt="Track your fitness progress" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-muted rounded-2xl overflow-hidden flex items-center justify-center p-3">
              <img 
                src={personalGrowth} 
                alt="Personal growth and wellness" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-muted rounded-2xl overflow-hidden flex items-center justify-center p-3">
              <img 
                src={fitnessTracking} 
                alt="Health monitoring and tracking" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
