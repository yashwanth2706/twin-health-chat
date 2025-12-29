import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      result: "Reversed Type 2 Diabetes in 4 months",
      quote: "I was on insulin for 8 years. With Twin Health, I'm now medication-free and my HbA1c is normal. This is nothing short of a miracle.",
      avatar: "RK"
    },
    {
      name: "Priya Sharma",
      location: "Bangalore",
      result: "Lost 18kg & reversed prediabetes",
      quote: "The personalized approach made all the difference. My energy levels are through the roof and I feel 10 years younger.",
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      location: "Delhi",
      result: "Off diabetes medication in 3 months",
      quote: "The care team was incredibly supportive. They understood my lifestyle and helped me make sustainable changes.",
      avatar: "AP"
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Real Stories, Real Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have transformed their health with Twin Health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  <p className="text-sm text-accent font-medium">{testimonial.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
