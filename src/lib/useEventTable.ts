"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlock } from "@/app/actions";
import { parseMarkdownTable, parseTableToTimeSlots } from "@/lib/tableParser";

const extractMarkdownFromBlock = (block: any): string | null => {
  if (block?.markdown) {
    return block.markdown;
  }
  if (block?.blocks && Array.isArray(block.blocks) && block.blocks.length > 0) {
    return extractMarkdownFromBlock(block.blocks[0]);
  }
  if (
    block?.content &&
    Array.isArray(block.content) &&
    block.content.length > 0
  ) {
    return extractMarkdownFromBlock(block.content[0]);
  }
  return null;
};

export function useEventTable(blockId?: string, encryptedBlob?: string) {
  const query = useQuery({
    queryKey: ["event_block", blockId, encryptedBlob],
    queryFn: () => {
      if (!blockId || !encryptedBlob) {
        throw new Error("Missing block identifier or encrypted blob");
      }
      return getBlock(encryptedBlob, blockId, 0);
    },
    enabled: !!blockId && !!encryptedBlob,
  });

  const markdown = useMemo(() => {
    if (!query.data) {
      return null;
    }
    return extractMarkdownFromBlock(query.data);
  }, [query.data]);

  const table = useMemo(() => {
    if (!markdown) {
      return null;
    }
    return parseMarkdownTable(markdown);
  }, [markdown]);

  const timeSlots = useMemo(() => {
    if (!table) {
      return [];
    }
    return parseTableToTimeSlots(table);
  }, [table]);

  return {
    ...query,
    markdown,
    table,
    timeSlots,
  };
}




