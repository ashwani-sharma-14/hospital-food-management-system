import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { patientSchema, PatientFormData } from "@/schemas/patientSchema";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GetServerSideProps } from "next";
import { JWTPayload, jwtVerify } from "jose";
import { parse } from "cookie";

interface UserPayload extends JWTPayload {
  id: string;
  email: string;
  isAdmin: boolean | null;
  isPantry: boolean | null;
  isDelivery: boolean | null;
}

const PatientDetailForm = ({ user }: { user: UserPayload }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize hooks unconditionally
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      diseases: [""],
      allergies: [""],
      roomNumber: 1,
      bedNumber: 1,
      floorNumber: 1,
      age: "",
      gender: "",
      phone: "",
      emergencyContact: "",
    },
  });

  const {
    fields: diseaseFields,
    append: appendDisease,
    remove: removeDisease,
  } = useFieldArray({
    control: form.control,
    name: "diseases" as const,
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: "allergies" as const,
  });

  // Redirect or render UI based on user permissions
  if (!user.isAdmin) {
    return (
      <div>
        <p>You are not authorized to access this page</p>
        <button onClick={() => router.back()}>Back</button>
      </div>
    );
  }

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/patient", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/dashboard`);
    } catch (error) {
      console.error("Error in submission", error);
      toast({
        title: "Error",
        description: "Submission failed, please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Patient Registration Form
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter patient's name"
                    {...field}
                    className="border-gray-300"
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., +910123456789"
                    {...field}
                    className="border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., +910123456789"
                    {...field}
                    className="border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Select Patient Gender</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="male" />
                    <FormLabel>Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="female" />
                    <FormLabel>Female</FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Diseases</h2>
            {diseaseFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  {...form.register(`diseases.${index}` as const)}
                  placeholder="Enter a disease"
                  className="border-gray-300"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeDisease(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendDisease("")}>
              Add Disease
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Allergies</h2>
            {allergyFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  {...form.register(`allergies.${index}` as const)}
                  placeholder="Enter an allergy"
                  className="border-gray-300"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeAllergy(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendAllergy("")}>
              Add Allergy
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parse(context.req.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    const userPayload: UserPayload = {
      id: payload.id as string,
      email: payload.email as string,
      isAdmin: payload.isAdmin as boolean,
      isPantry: payload.isPantry as boolean,
      isDelivery: payload.isDelivery as boolean,
    };

    return { props: { user: userPayload } };
  } catch {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
};

export default PatientDetailForm;
