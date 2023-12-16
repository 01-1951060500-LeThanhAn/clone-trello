"use client";
import { deleteBoardList } from "@/actions/delete-listboard/main";
import { FormSubmits } from "@/components/forms/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-actions";
import { ListCards } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Card } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import React, { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface OptionListProps {
  data: ListCards;
  onAddCard: () => void;
  onSort: () => void;
}
const OptionList: React.FC<OptionListProps> = ({ data, onSort }) => {
  const { user } = useUser();
  const closeRef = useRef<ElementRef<"button">>(null);
  const { execute: deleteExcute } = useAction(deleteBoardList, {
    onSuccess: () => {
      toast.success("Delete this list successfully");
      closeRef.current?.click();
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const onSubmit = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    deleteExcute({ id, boardId });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-auto w-auto p-2" variant={"ghost"}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="px-0 py-3 mt-2" side="bottom" align="start">
          <div className="text-sm font-medium text-center text-neutral-700">
            Actions
          </div>
          <PopoverClose ref={closeRef}>
            <Button className="w-auto h-auto p-2 absolute top-3 right-2 ">
              <X className="w-4 h-4" />
            </Button>
          </PopoverClose>

          <Button
            variant={"ghost"}
            className="rounded-sm w-full text-sm font-normal mt-2 h-auto px-5 p-2 justify-start"
          >
            Add Card
          </Button>
          <form>
            <input hidden name="id" id="id" value={data.id} />
            <input hidden name="boardId" id="boardId" value={data.boardId} />
            <FormSubmits
              variant="ghost"
              className="rounded-sm w-full text-sm font-normal mt-1 h-auto px-5 p-2 justify-start"
            >
              Copy list...
            </FormSubmits>
          </form>

          <form action={onSort}>
            <input hidden name="id" id="id" value={data.id} />
            <input hidden name="boardId" id="boardId" value={data.boardId} />
            <FormSubmits
              variant="ghost"
              className="rounded-sm w-full text-sm font-normal mt-1 h-auto px-5 p-2 justify-start"
            >
              Sorted By Time created
            </FormSubmits>
          </form>

          <Separator className="mt-2" />
          {data.cards?.length > 0 && data.cards[0].userId === user?.id && (
            <form action={onSubmit}>
              <input hidden name="id" id="id" value={data.id} />
              <input hidden name="boardId" id="boardId" value={data.boardId} />
              <FormSubmits
                variant="ghost"
                className="rounded-sm w-full text-sm font-normal h-auto px-5 p-2 justify-start"
              >
                Delete this list
              </FormSubmits>
            </form>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default OptionList;
