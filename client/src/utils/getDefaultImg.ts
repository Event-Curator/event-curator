import type { SyntheticEvent } from "react";

export function getDefaultImg(
  event: SyntheticEvent<HTMLImageElement, Event>,
  defaultImg: string
): void {
  const target = event.target as HTMLImageElement;
  target.src = defaultImg;
}
