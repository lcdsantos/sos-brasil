import { Mark } from "@chakra-ui/react";
import { RangeTuple } from "fuse.js";

export function highlightMatches(
  text?: string | null,
  regions: ReadonlyArray<RangeTuple> = [],
) {
  if (!regions.length) return text;

  const chunks = [];
  let lastIndex = 0;

  // Fuse.js returns sorted, non-overlapping [start, end] pairs
  for (const [start, end] of regions) {
    // Add any unmatched text before this region
    if (start > lastIndex) {
      chunks.push(text?.slice(lastIndex, start));
    }
    // Wrap the matched range in a <Mark> tag
    chunks.push(
      <Mark variant="solid" key={start}>
        {text?.slice(start, end + 1)}
      </Mark>,
    );
    lastIndex = end + 1;
  }

  // Add any remaining text after the last match
  if (lastIndex < (text?.length ?? 0)) {
    chunks.push(text?.slice(lastIndex));
  }

  return chunks;
}
