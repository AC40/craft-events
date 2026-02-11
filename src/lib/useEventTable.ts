"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlock } from "@/app/actions";
import type { Block } from "@/lib/craftApi";
import {
  parseMarkdownTable,
  parseTableToTimeSlots,
  extractTimezone,
} from "@/lib/tableParser";

/** Block shape as returned by the Craft API (may include nested `blocks` array) */
interface CraftBlock extends Block {
  blocks?: CraftBlock[];
}

const extractMarkdownFromBlock = (block: CraftBlock): string | null => {
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
    return extractMarkdownFromBlock(block.content[0] as CraftBlock);
  }
  return null;
};

/**
 * Extracts all markdown from sibling blocks (for finding timezone metadata)
 */
const extractAllMarkdownFromBlocks = (blocks: CraftBlock[]): string[] => {
  const markdowns: string[] = [];
  for (const block of blocks) {
    const md = extractMarkdownFromBlock(block);
    if (md) {
      markdowns.push(md);
    }
    // Also check nested blocks
    if (block?.blocks && Array.isArray(block.blocks)) {
      markdowns.push(...extractAllMarkdownFromBlocks(block.blocks));
    }
    if (block?.content && Array.isArray(block.content)) {
      markdowns.push(...extractAllMarkdownFromBlocks(block.content));
    }
  }
  return markdowns;
};

/**
 * Gets the parent page block to access sibling blocks (like timezone metadata)
 */
async function getParentPageBlock(
  blockId: string,
  encryptedBlob: string
): Promise<CraftBlock | null> {
  try {
    // Fetch the block with depth 1 to get parent info
    const block = await getBlock(encryptedBlob, blockId, 1);

    // If block has a parent reference, try to fetch it
    // Otherwise, we need to fetch the page that contains this block
    // For now, we'll check if the block structure includes parent/sibling info
    return block;
  } catch {
    return null;
  }
}

export function useEventTable(blockId?: string, encryptedBlob?: string) {
  const query = useQuery({
    queryKey: ["event_block", blockId, encryptedBlob],
    queryFn: async () => {
      if (!blockId || !encryptedBlob) {
        throw new Error("Missing block identifier or encrypted blob");
      }
      // Single fetch with depth 1 — includes table markdown and sibling context (timezone block)
      const blockWithContext = await getBlock(encryptedBlob, blockId, 1);

      return { tableBlock: blockWithContext, blockWithContext };
    },
    enabled: !!blockId && !!encryptedBlob,
  });

  const markdown = useMemo(() => {
    if (!query.data) {
      return null;
    }
    // Get markdown from the table block
    const data = query.data;
    return extractMarkdownFromBlock(data.tableBlock || data);
  }, [query.data]);

  const table = useMemo(() => {
    if (!markdown) {
      return null;
    }
    return parseMarkdownTable(markdown);
  }, [markdown]);

  const timezone = useMemo(() => {
    if (!query.data) {
      return null;
    }

    const data = query.data;
    const allMarkdowns: string[] = [];

    // Get markdown from table block
    const tableMd = extractMarkdownFromBlock(data.tableBlock || data);
    if (tableMd) {
      allMarkdowns.push(tableMd);
    }

    // Check parent/sibling blocks for timezone (stored before table as separate block)
    if (data.blockWithContext) {
      // Check if there are sibling blocks in the parent
      if (
        data.blockWithContext.blocks &&
        Array.isArray(data.blockWithContext.blocks)
      ) {
        allMarkdowns.push(
          ...extractAllMarkdownFromBlocks(data.blockWithContext.blocks)
        );
      }
      if (
        data.blockWithContext.content &&
        Array.isArray(data.blockWithContext.content)
      ) {
        allMarkdowns.push(
          ...extractAllMarkdownFromBlocks(data.blockWithContext.content)
        );
      }
    }

    // Search through all markdown for timezone
    for (const md of allMarkdowns) {
      const tz = extractTimezone(md);
      if (tz) {
        return tz;
      }
    }

    return null;
  }, [query.data]);

  const timeSlots = useMemo(() => {
    if (!table) {
      return [];
    }
    return parseTableToTimeSlots(table, timezone);
  }, [table, timezone]);

  return {
    ...query,
    markdown,
    table,
    timeSlots,
    timezone,
  };
}
