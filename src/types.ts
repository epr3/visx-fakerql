export type Post = {
  id: string;
  createdAt: number;
};

export type PostData = {
  allPosts: Post[];
};
export type PostVars = {
  count: number;
};
