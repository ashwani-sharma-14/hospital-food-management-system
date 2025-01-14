import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { patientSchema, PatientFormData } from "@/schemas/patientSchema";
import axios from "axios";

import { useRouter } from "next/navigation";
import {  useState } from "react";
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
  if (!user.isAdmin) {
    return (
      <>
        <div>You are not authauthorised to this page</div>
        <button onClick={()=>router.back()}>Back</button>
      </>
    );
  }

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
      age: '',
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
    name: "diseases",
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: "allergies",
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
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in submission", error);
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
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
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
                    type="text"
                    min={1}
                    placeholder="Age"
                    {...field}
                    className="border-gray-300"
                    onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Room Number"
                    {...field}
                    className="border-gray-300"
                    onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Bed Number"
                    {...field}
                    className="border-gray-300"
                    onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Floor Number"
                    {...field}
                    className="border-gray-300"
                    onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Diseases</h2>
            {diseaseFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  {...form.register(`diseases.${index}`)}
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
            <Button
              type="button"
              variant="outline"
              className="border-solid border-2 border-black inline-block"
              onClick={() => appendDisease("")}
            >
              Add Disease
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Allergies</h2>
            {allergyFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  {...form.register(`allergies.${index}`)}
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
            <Button
              type="button"
              variant="outline"
              className="border-solid border-2 border-black inline-block"
              onClick={() => appendAllergy("")}
            >
              Add Allergy
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
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
      isAdmin: typeof payload.isAdmin === "boolean" ? payload.isAdmin : false,
      isPantry:
        typeof payload.isPantry === "boolean" ? payload.isPantry : false,
      isDelivery:
        typeof payload.isDelivery === "boolean" ? payload.isDelivery : false,
    };

    return {
      props: { user: userPayload },
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
};

export default PatientDetailForm;
