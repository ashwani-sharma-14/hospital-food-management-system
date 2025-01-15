/* eslint-disable @typescript-eslint/no-unused-vars */
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
    name: "diseases" as 'diseases',
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: "allergies" as 'allergies',
  });

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
        description: "Failed to submit the form.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return user.isAdmin ? (
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
                  <Input placeholder="Enter patient's name" {...field} />
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
                  <Input placeholder="+910123456789" {...field} />
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
                  <Input placeholder="+910123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                  >
                    <RadioGroupItem value="male">Male</RadioGroupItem>
                    <RadioGroupItem value="female">Female</RadioGroupItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Age"
                    {...field}
                    onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h2 className="font-semibold">Diseases</h2>
            {diseaseFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input {...form.register(`diseases.${index}`)} />
                <Button
                  type="button"
                  onClick={() => removeDisease(index)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendDisease("")}
              className="mt-2"
            >
              Add Disease
            </Button>
          </div>

          <div>
            <h2 className="font-semibold">Allergies</h2>
            {allergyFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input {...form.register(`allergies.${index}`)} />
                <Button
                  type="button"
                  onClick={() => removeAllergy(index)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendAllergy("")}
              className="mt-2"
            >
              Add Allergy
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  ) : (
    <div className="text-center mt-20">
      <p>You are not authorized to view this page.</p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parse(context.req.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) {
      return {
        redirect: { destination: "/sign-in", permanent: false },
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    const userPayload: UserPayload = {
      id: payload.id as string,
      email: payload.email as string,
      isAdmin: Boolean(payload.isAdmin),
      isPantry: Boolean(payload.isPantry),
      isDelivery: Boolean(payload.isDelivery),
    };

    return { props: { user: userPayload } };
  } catch {
    return { redirect: { destination: "/sign-in", permanent: false } };
  }
};

export default PatientDetailForm;
