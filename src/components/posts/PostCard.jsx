import {
  Card,
  CardHeader,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
  CardBody,
  Image,
  CardFooter,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiShare } from "react-icons/bi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  likePostService,
  deletePostService,
} from "../../services/postsServices";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/authSelectors";
import { formatPostDate } from "../../utils/formatPostDate";

function PostCard({
  title,
  excerpt,
  author,
  image,
  id,
  onLike,
  isLiked,
  likesCount,
  onDelete,
  createdAt,
}) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const user = useSelector(selectUser);

  function handleLikeClick() {
    setIsLikeLoading(true);

    likePostService(id)
      .then((post) => {
        onLike(post);
      })
      .finally(() => setIsLikeLoading(false));
  }

  function handleDeleteClick() {
    setIsDeleteLoading(true);
    deletePostService(id).then(() => {
      onDelete(id);
    });
  }

  return (
    <Card>
      <CardHeader pb={0}>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={author.fullName} src={author.avatar || undefined} />

            <Box>
              <Heading size="sm">{author.fullName || "-"}</Heading>
              <Text as={Link} to={`/users/${author.id}`}>
                @{author.username}
              </Text>
            </Box>

            <Text fontSize="sm" fontWeight={500}>
              {formatPostDate(createdAt)}
            </Text>
          </Flex>

          {author.id === user.id && (
            <Menu>
              <MenuButton
                as={IconButton}
                variant="ghost"
                colorScheme="gray"
                aria-label="See menu"
                icon={<BsThreeDotsVertical />}
                isLoading={isDeleteLoading}
              />

              <MenuList>
                <MenuItem as={Link} to={`/posts/${id}/edit`}>
                  Edit
                </MenuItem>
                <MenuItem color="red.400" onClick={handleDeleteClick}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Heading mb="8px" size="lg" as={Link} to={`/posts/${id}`}>
          {title}
        </Heading>
        <Text>{excerpt}</Text>
      </CardBody>
      {image && <Image objectFit="cover" src={image} alt={title} />}

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button
          flex="1"
          variant="ghost"
          leftIcon={<BiLike />}
          onClick={handleLikeClick}
          colorScheme={isLiked ? "blue" : "gray"}
          isLoading={isLikeLoading}
        >
          Like ({likesCount})
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  image: PropTypes.string,
  author: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  onLike: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likesCount: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PostCard;
