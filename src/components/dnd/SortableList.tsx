import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type SortableRenderProps = {
  setNodeRef: (node: HTMLElement | null) => void;
  attributes: Record<string, any>;
  listeners: Record<string, any>;
  style: React.CSSProperties;
};

interface InternalSortableProps {
  id: string;
  children: (props: SortableRenderProps) => React.ReactNode;
}

function InternalSortable({ id, children }: InternalSortableProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : undefined,
  };

  return <>{children({ attributes, listeners, setNodeRef, style })}</>;
}

export interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  children: (item: T, sortable: SortableRenderProps) => React.ReactNode;
}

export function SortableList<T extends { id: string }>({ items, onReorder, children }: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(items, oldIndex, newIndex).map((i) => i.id);
    onReorder(newOrder);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {items.map((item) => (
            <InternalSortable key={item.id} id={item.id}>
              {(sortable) => children(item, sortable)}
            </InternalSortable>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
