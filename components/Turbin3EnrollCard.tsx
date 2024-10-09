"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTurbin3Program } from "@/lib/contract";

const formSchema = z.object({
  github: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Turbin3EnrollCard = () => {
  const { publicKey } = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      github: "HongThaiPham",
    },
  });

  const onSubmit = (values: FormSchemaType) => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const program = getTurbin3Program(connection);
          const github = Buffer.from(values.github, "utf8");
          const transaction = await program.methods
            .complete(github)
            .accounts({
              signer: publicKey,
            })
            .transaction();

          const signature = await sendTransaction(transaction, connection);
          resolve(signature);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Enrolling...",
        success: "Enrolled successfully",
        error: "Failed to enroll. Please try again",
      }
    );
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Turbin 3 Enrol</CardTitle>
        <CardDescription>
          This form is used to enroll in Turbin 3
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Github username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your Github username
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Turbin3EnrollCard;
