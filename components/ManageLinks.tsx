"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "./ui/button";
import SortableItem from "./SortableItem";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

function ManageLinks({
    preloadedLinks,
}: {
    preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId>;
}) {
    const links = usePreloadedQuery(preloadedLinks);
    const updateLinkOrder = useMutation(api.lib.links.updateLinkOrder);

    // Derive items from links, but allow local reordering
    const linkIds = useMemo(() => links.map((link) => link._id), [links]);
    const [items, setItems] = useState<Id<"links">[]>(() => linkIds);

    // Sync items with links when link IDs change (links added/removed, but preserve order on reorder)
    useEffect(() => {
        setItems((currentItems) => {
            const currentSet = new Set(currentItems);
            const newSet = new Set(linkIds);
            
            // Only update if the link IDs have actually changed (links added/removed)
            if (currentSet.size !== newSet.size || 
                !Array.from(currentSet).every(id => newSet.has(id))) {
                return linkIds;
            }
            
            // If same links, preserve current order (user's drag might have changed it)
            return currentItems;
        });
    }, [linkIds]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px of movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );


    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as Id<"links">);
                const newIndex = items.indexOf(over?.id as Id<"links">);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update the links order in the database
                updateLinkOrder({ linkIds: newItems });

                return newItems;
            });
        }
    }

    // Create a map for quick link lookup
    const linkMap = useMemo(() => {
        return Object.fromEntries(links.map((link) => [link._id, link]));
    }, [links]);

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {items.map((id) => {
                            const link = linkMap[id];
                            return <SortableItem key={id} id={id} link={link} />;
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-600 hover:text-white transition-all duration-200 mt-4"
                asChild
            >
                <Link
                    href="/dashboard/new-link"
                    className="flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Link
                </Link>
            </Button>

        </>
    );
}

export default ManageLinks;