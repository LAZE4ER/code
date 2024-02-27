import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import { usePosts } from "../../hooks/usePosts";
import { getUserPostsService } from "../../services/usersServices";
import PostsList from "../posts/PostsList";
import PropTypes from "prop-types";

function UserPosts({ userId }) {
  const params = useMemo(() => {
    return {
      userId,
    };
  }, [userId]);

  const { posts, activePage, hasMore, fetchPosts, likePost, deletePost } =
    usePosts(getUserPostsService, params);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      endMessage={<span>🐧</span>}
      loader={
        <Stack py="32px" alignItems="center">
          <CircularProgress isIndeterminate />
        </Stack>
      }
      next={() => fetchPosts(activePage + 1)}
      hasMore={hasMore}
    >
      <PostsList posts={posts} onLike={likePost} onDelete={deletePost} />
    </InfiniteScroll>
  );
}
UserPosts.propTypes = {
  userId: PropTypes.isRequired,
};
export default UserPosts;
