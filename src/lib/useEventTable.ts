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
  content?: CraftBlock[];
}

function getChildBlocks(block: CraftBlock | null | undefined): CraftBlock[] {
  if (!block) {
    return [];
  }

  const blocks = Array.isArray(block.blocks) ? block.blocks : [];
  const content = Array.isArray(block.content) ? block.content : [];
  return [...blocks, ...content];
}

const extractMarkdownFromBlock = (block: CraftBlock | null | undefined): string | null => {
  if (!block) {
    return null;
  }
  if (typeof block.markdown === "string" && block.markdown.trim()) {
    return block.markdown;
  }

  for (const child of getChildBlocks(block)) {
    const markdown = extractMarkdownFromBlock(child);
    if (markdown) {
      return markdown;
    }
  }

  return null;
};

const collectMarkdownFromBlock = (block: CraftBlock | null | undefined): string[] => {
  const markdowns: string[] = [];

  if (!block) {
    return markdowns;
  }

  if (typeof block.markdown === "string" && block.markdown.trim()) {
    markdowns.push(block.markdown);
  }

  for (const child of getChildBlocks(block)) {
    markdowns.push(...collectMarkdownFromBlock(child));
  }

  return markdowns;
};

const findBlockById = (
  block: CraftBlock | null | undefined,
  targetId: string
): CraftBlock | null => {
  if (!block) {
    return null;
  }

  if (block.id === targetId) {
    return block;
  }

  for (const child of getChildBlocks(block)) {
    const match = findBlockById(child, targetId);
    if (match) {
      return match;
    }
  }

  return null;
};

export function useEventTable(blockId?: string, encryptedBlob?: string) {
  const query = useQuery({
    queryKey: ["event_block", blockId, encryptedBlob],
    queryFn: async () => {
      if (!blockId || !encryptedBlob) {
        throw new Error("Missing block identifier or encrypted blob");
      }
      // Keep the full payload so we can inspect any surrounding context returned by Craft.
      return getBlock(encryptedBlob, blockId, 1);
    },
    enabled: !!blockId && !!encryptedBlob,
  });

  const tableBlock = useMemo(() => {
    if (!query.data || !blockId) {
      return null;
    }

    return findBlockById(query.data as CraftBlock, blockId) ?? (query.data as CraftBlock);
  }, [blockId, query.data]);

  const markdown = useMemo(() => {
    if (!tableBlock) {
      return null;
    }

    return extractMarkdownFromBlock(tableBlock);
  }, [tableBlock]);

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

    const allMarkdowns = collectMarkdownFromBlock(query.data as CraftBlock);

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
