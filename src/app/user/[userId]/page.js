"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  Textarea,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { authUrl, configHeader } from "@/app/utils";
import { PostListing } from "@/app/components/PostListing";

const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const UserDetails = ({ params }) => {
  const [value, setValue] = useState("");
  const [comment, setComment] = useState(false);
  const [userPosts, setUserPosts] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [apiResponse, setApiResponse] = useState(null);
  const [getNewComments, setGetNewComments] = useState(true);
  const [addNewComment, setAddNewComment] = useState("");
  const [getComment, setGetComment] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const initialFormData = {
    title: "",
    body: "",
  };

  const [errors, setErrors] = useState({
    title: false,
    body: false,
  });

  const [formData, setFormData] = useState(initialFormData);
  const userId = params.userId;
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
  };

  const handleNewCommentChange = (e) => {
    const { value } = e.target;
    setAddNewComment(value);
  };

  const handleAddUser = () => {
    const { title, body } = formData;
    const newErrors = {
      title: title === "",
      body: body === "",
    };

    if (newErrors.title || newErrors.body) {
      setErrors(newErrors);
      return;
    }

    fetch(`${authUrl}/users/${userId}/posts`, {
      method: "POST",
      body: JSON.stringify({
        title: formData.title,
        body: formData.body,
      }),
      headers: configHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        const { field = "", message = "" } = data?.[0] || {};
        setApiResponse({
          success: true,
          message: `${field} ${message}`.trim() || "Post added successfully",
          isError: field?.length ? true : false,
        });
        // Clear form fields
        if (!field?.length) {
          setFormData(initialFormData);
        }
        setGetNewComments(true);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setApiResponse({ success: false, message: "Failed to add post" });
      });
  };

  const handleCloseModal = () => {
    onClose();
    setApiResponse({ success: true, message: "", isError: false });
    setFormData(initialFormData);
  };

  const fetchUserComments = async (postId) => {
    try {
      const response = await fetch(
        `${authUrl}/posts/${postId}/comments`,
        {
          method: "GET",
          headers: configHeader,
        }
      );
      const data = await response.json();
      if (data) {
        let postData = userPosts;
        postData.map((item) => {
          if (postId === item.id) {
            item.comments = data
          }
        })
        setUserPosts(postData)
        setGetComment(data)
      } else {
        console.error("Failed to fetch user posts data:", data);
      }
    } catch (error) {
      console.error("Error fetching user posts data:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `${authUrl}/users/${userId}/posts`,
        {
          method: "GET",
          headers: configHeader,
        }
      );
      const data = await response.json();

      if (response.ok) {
        data.map((item) => {
          item.comments = [];
        })
        setUserPosts(data);
        setTimeout(() => {
          setGetNewComments(false);
        }, 500);
      } else {
        console.error("Failed to fetch user posts data:", data);
      }
    } catch (error) {
      console.error("Error fetching user posts data:", error);
    }
  };

  useEffect(() => {
    if (userId && getNewComments) {
      fetchUserPosts();
    }
  }, [userId, getNewComments]);

  if (!userPosts) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleComment = (data, index) => {
    setCommentId(index);
    setComment(!comment);
    fetchUserComments(data.id)
  };

  const handleAddNewComment = (data, index) => {
    if (addNewComment) {
      fetch(`${authUrl}/posts/${data.id}/comments`, {
        method: "POST",
        body: JSON.stringify({
          name: userData?.name,
          body: addNewComment,
          email: userData?.email,
        }),
        headers: configHeader,
      })
        .then((response) => response.json())
        .then((res) => {
          setAddNewComment("")
          fetchUserComments(data?.id)
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          setApiResponse({ success: false, message: "Failed to add post" });
        });
    }
  };

  const renderAddUserModal = () => {
    handleCloseModal();
    setOverlay(<OverlayOne />);
    onOpen();
  };

  const renderHeader = () => {
    return (
      <>
        <Box w="100%" display="flex" justifyContent="flex-end">
          <Button
            colorScheme="green"
            variant="solid"
            onClick={renderAddUserModal}
            borderRadius="15px"
          >
            + Add Post
          </Button>
        </Box>
        <Modal
          isCentered
          isOpen={isOpen}
          onClose={onClose}
        >
          {overlay}
          <ModalContent>
            <ModalHeader>Add Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your Title"
                />
                {errors.title && (
                  <FormErrorMessage>Title is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.body}>
                <FormLabel>Body</FormLabel>
                <Textarea
                  name="body"
                  type="textarea"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Write here..."
                  size="sm"
                  resize={false}
                />
                {errors.body && (
                  <FormErrorMessage>Body is required.</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
              >
                <Box>
                  {apiResponse && (
                    <VStack align="flex-start" mb={4}>
                      <Text
                        color={!apiResponse?.isError ? "green.500" : "red.500"}
                      >
                        {apiResponse?.message}
                      </Text>
                    </VStack>
                  )}
                </Box>
                <Box>
                  <Button colorScheme="blue" mr={3} onClick={handleAddUser}>
                    Add Post
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </Box>
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Box
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="20px"
        padding="20px"
      >
        <Box
          padding="40px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="20px"
        >
          <Box
            cursor="pointer"
            bg={cardBg}
            transition="all 0.2s"
            shadow="md"
            borderRadius="md"
            p={4}
            h="100%"
          >
            <Stack direction="row" spacing={4} align="center">
              <Avatar name={userData?.name} src="https://bit.ly/broken-link" />
              <Heading size="md">{userData?.name}</Heading>
            </Stack>
            <Stack direction="column" spacing={4} marginLeft="65px">
              <Text color={textColor}>Email: {userData?.email}</Text>
              <Text color={textColor}>Gender: {userData?.gender}</Text>
              <Text color={textColor}>
                Status:{" "}
                {userData?.status === "active" ? (
                  <Box as="span" color="green.500">
                    active
                  </Box>
                ) : (
                  <Box as="span" color="red.500">
                    inactive
                  </Box>
                )}
              </Text>
            </Stack>
          </Box>
          {renderHeader()}
          <PostListing userPosts={userPosts} cardBg={cardBg} textColor={textColor} comment={comment} commentId={commentId} getComment={getComment} handleAddNewComment={handleAddNewComment} handleComment={handleComment}
            handleNewCommentChange={handleNewCommentChange} addNewComment={addNewComment}
          />
        </Box>
      </Box>
    </>
  );
};

export default UserDetails;
