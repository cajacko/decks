import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * For making animations smoother, we can delay the action for a certain amount of time.
 *
 * The intended use to is to mark the items as "DELETING" on "pending" and then have our selectors
 * exclude them. And then actually delete them on "fulfilled". This way when a screen is animating
 * closed or a card is animating in it's deletion we can avoid the actual markup disappearing.
 *
 * In most cases where you can just delay calling the action do that. But there are some cases where
 * that doesn't quite work e.g. your on a deck page and want to delete that deck and navigate back
 * to the deck list. Now this deck would be visible both on the view your animating from and to. So
 * when do you delete?
 */
export default function createDelayedActionForAnimations<P>(name: string) {
  return createAsyncThunk<P, P>(
    name,
    async (props: P) =>
      new Promise<P>((resolve) => setTimeout(() => resolve(props), 1000)),
  );
}
