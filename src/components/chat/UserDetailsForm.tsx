import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Name validation: allows letters, spaces, apostrophes, hyphens (for names like O'Neil, Van Der Beek)
const nameRegex = /^[a-zA-Z]+(?:[''\s-][a-zA-Z]+)*$/;

// Indian phone number: exactly 10 digits, starting with 6-9
const indianPhoneRegex = /^[6-9]\d{9}$/;

const userDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(nameRegex, {
      message: "Name can only contain letters, spaces, apostrophes, and hyphens",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, {
      message: "Please enter a valid 10-digit Indian phone number",
    }),
});

type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

interface UserDetailsFormProps {
  onSubmit: (data: UserDetailsFormData) => void;
}

const UserDetailsForm = ({ onSubmit }: UserDetailsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: UserDetailsFormData) => {
    setIsSubmitting(true);
    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
      <p className="text-sm text-muted-foreground mb-4">
        Please fill in your details to continue:
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., John, O'Neil, Van Der Beek"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Phone Number (India)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    {...field}
                    onChange={(e) => {
                      // Only allow digits
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsForm;
