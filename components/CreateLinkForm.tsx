"use client";

import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    url: z.string().url("Please enter a valid URL"),
});

function CreateLinkForm() {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, startTransition] = useTransition();
    const router = useRouter();
    const createLink = useMutation(api.lib.links.createLink);


    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            url: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);

        // // Check if URL has https or http, if not, add it
        // if (
        //     !values.url.startsWith("https://") &&
        //     !values.url.startsWith("http://")
        // ) {
        //     values.url = `https://${values.url}`;
        // }

        startTransition(async () => {
            try {
                await createLink({
                    title: values.title,
                    url: values.url,
                });
                router.push("/dashboard");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create link");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link Title</FormLabel>
                            <FormControl>
                                <Input placeholder="My awesome link" {...field} />
                            </FormControl>
                            <FormDescription>
                                This will be displayed as the button text for your link.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                The destination URL where users will be redirected.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}


                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating..." : "Create Link"}
                </Button>
            </form>
        </Form>
    );
}

export default CreateLinkForm;