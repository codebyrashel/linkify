"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Id } from "@/convex/_generated/dataModel";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { GripVertical, BarChart3, Pencil, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";

function SortableItem({ id, link }: { id: Id<"links">; link: Doc<"links"> }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(link?.title);
    const [editUrl, setEditUrl] = useState(link?.url);
    const [isUpdating, startTransition] = useTransition();

    const deleteLink = useMutation(api.lib.links.deleteLink);
    const updateLink = useMutation(api.lib.links.updateLink);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleCancel = () => {
        setEditTitle(link.title);
        setEditUrl(link.url);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!editTitle?.trim() || !editUrl?.trim()) return;

        startTransition(async () => {
            try {
            // Add https:// if no protocol is specified
            let processedUrl = editUrl;
            if (
                !processedUrl.startsWith("https://") &&
                !processedUrl.startsWith("http://")
            ) {
                processedUrl = `https://${processedUrl}`;
            }

            await updateLink({
                linkId: id,
                title: editTitle.trim(),
                url: processedUrl,
            });

            setIsEditing(false);

            toast.success("Link updated successfully");
        } catch (error) {
            console.error("Failed to update link:", error);
        }
        })
    };

    if (!link) return null;

    return (
        <div ref={setNodeRef} style={style} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">


            {isEditing ? (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Link title"
                            className="font-semibold"
                        />
                        <Input
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="text-sm"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isUpdating}
                        >
                            <X className="w-4 h-4" />
                        </Button>

                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isUpdating || !editTitle.trim() || !editUrl.trim()}
                        >
                            {isUpdating ? (
                                <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    {/* Drag handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        aria-describedby={`link-${id}`}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded flex-shrink-0 touch-none"
                    >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-semibold text-lg truncate">{link.title}</h3>
                        <p className="text-gray-600 text-sm truncate">{link.url}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Analytics Button */}
                        <Link 
                            href={`/dashboard/link/${id}`}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                type="button"
                            >
                                <BarChart3 className="w-3.5 h-3.5 text-green-500" />
                            </Button>
                        </Link>

                        {/* Edit Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();

                                const isConfirmed = confirm(
                                    `Are you sure you want to delete "${link.title}"?\n\nThis action cannot be undone.`
                                );

                                if (isConfirmed) {
                                    deleteLink({ linkId: id });
                                }
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default SortableItem;