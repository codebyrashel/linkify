"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect, useTransition } from "react";
import { ImageIcon, Palette, Upload, X } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from "sonner";

function CustomizationForm() {
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateCustomizations = useMutation(api.lib.customizations.updateCustomizations);
    const generateUploadUrl = useMutation(api.lib.customizations.generateUploadUrl);
    const removeProfilePicture = useMutation(api.lib.customizations.removeProfilePicture);

    const existingCustomizations = useQuery(
        api.lib.customizations.getUserCustomizations,
        user ? { userId: user.id } : "skip"
    );

    const [formData, setFormData] = useState({
        description: "",
        accentColor: "#6366f1", // Default indigo
    });

    const [isLoading, startTransition] = useTransition();
    const [isUploading, startUploading] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        startTransition(async () => {
            try {
                await updateCustomizations({
                    description: formData.description || undefined,
                    accentColor: formData.accentColor || undefined,
                });
                toast.success("Customizations saved successfully!");
            } catch (error) {
                console.error("Failed to save customizations:", error);
                toast.error("Failed to save customizations");
            }
        });
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        startUploading(async () => {
            try {
                // Get upload URL
                const uploadUrl = await generateUploadUrl();

                // Upload file
                const uploadResult = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                if (!uploadResult.ok) {
                    throw new Error("Upload failed");
                }

                const { storageId } = await uploadResult.json();

                // Update customizations with new storage ID
                await updateCustomizations({
                    profilePictureStorageId: storageId,
                    description: formData.description || undefined,
                    accentColor: formData.accentColor || undefined,
                });

                toast.success("Profile picture updated successfully!");
            } catch (error) {
                console.error("Failed to upload image:", error);
                toast.error("Failed to upload image");
            } finally {
                // setIsUploading(false);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        });
    };


    const handleRemoveImage = async () => {
        startTransition(async () => {
            try {
                await removeProfilePicture();
                toast.success("Profile picture removed successfully!");
            } catch (error) {
                console.error("Failed to remove image:", error);
                toast.error("Failed to remove image");
            }
        });
    };


    // Update form data when existing customizations load
    useEffect(() => {
        if (existingCustomizations) {
            setFormData({
                description: existingCustomizations.description || "",
                accentColor: existingCustomizations.accentColor || "#6366f1",
            });
        }
    }, [existingCustomizations]);


    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="w-full bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                        <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Customize Your Page
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Personalize your public link page with custom profile picture,
                            description, and accent color.
                        </p>
                    </div>
                </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Profile Picture
                    </Label>

                    {/* Current Image Display */}
                    {existingCustomizations?.profilePictureUrl && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <Image
                                    src={existingCustomizations.profilePictureUrl}
                                    alt="Current profile picture"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 font-medium">
                                    Current profile picture
                                </p>
                                <p className="text-xs text-gray-500">
                                    Click &ldquo;Remove&rdquo; to delete this image
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    disabled={isLoading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* File Upload */}
                    <div className="flex items-center gap-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            {isUploading ? "Uploading..." : "Upload New Image"}
                        </Button>

                        <p className="text-sm text-gray-500">
                            Max 5MB. Supports JPG, PNG, GIF, WebP
                        </p>
                    </div>
                </div>


                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        placeholder="Tell visitors about yourself..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                        maxLength={200}
                    />
                    <p className="text-sm text-gray-500">
                        {formData.description.length}/200 characters
                    </p>
                </div>


                {/* Accent Color Picker */}
                <div className="space-y-3">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <input
                                id="accentColor"
                                type="color"
                                value={formData.accentColor}
                                onChange={(e) => handleInputChange("accentColor", e.target.value)}
                                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Choose your brand color
                                </p>
                                <p className="text-xs text-gray-500">{formData.accentColor}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        This color will be used as an accent in your page header
                    </p>
                </div>


                {/* Save Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading || isUploading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        {isLoading ? "Saving..." : "Save Customizations"}
                    </Button>
                </div>
            </form>
        </div>
    );

}

export default CustomizationForm;