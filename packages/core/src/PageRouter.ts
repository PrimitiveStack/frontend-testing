export interface PageRouter<TPageId> {
  navigate(pageId: TPageId): void;
}