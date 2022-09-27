import { MouseEvent, useContext, useState, FormEvent, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

import axios, { AxiosError } from "axios";

import { AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";

import { NoteContext } from "../context/NoteContext";
import FormElement from "./FormElement";
import { CardProps } from "../types/notes.types";
import { UserContext } from "../context/UserContext";

const Card = ({
  title,
  description,
  noteId,
  inEditMode = false,
  isCardLoading,
}: CardProps) => {
  const toast = useToast();
  const noteContext = useContext(NoteContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCompleteDescription, setShowCompleteDescription] = useState(true);
  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (inEditMode && noteId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const { data } = await axios.get(
            `https://note-making-app-backend.vercel.app/get-note/${noteContext?.notesId}/${noteId}`,
            { withCredentials: true }
          );

          const { title, description } = data;
          setUserInput({ title, description });
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error?.response?.data?.error) {
              toast({
                title: "Failed",
                description: error?.response?.data?.error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          }
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [noteId]);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    try {
      e.preventDefault();
      const { data } = await axios.delete(
        `https://note-making-app-backend.vercel.app/delete-note/${noteContext?.notesId}/${noteId}`,
        { withCredentials: true }
      );
      noteContext?.setNotes(data.notes);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.data?.error) {
          toast({
            title: "Failed",
            description: error?.response?.data?.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (userInput.title.length <= 10 && userInput.description.length < 1) {
      toast({
        title: "Cannot add this note",
        description:
          "Description is mandatory if length of title is less than 10",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://note-making-app-backend.vercel.app/edit-note",
        {
          title: userInput.title,
          description: userInput.description,
          notesId: noteContext?.notesId,
          noteId: noteId,
        },
        { withCredentials: true }
      );

      noteContext?.setNotes(data.notes);
      navigate(`/${userContext?.userDetails.username}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error?.response?.data?.error) {
          toast({
            title: "Failed",
            description: error?.response?.data?.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <Box
      boxShadow="xl"
      w={
        inEditMode ? "md" : { base: "container", sm: "md", md: "xs", xl: "md" }
      }
      p="5"
      mx="5"
      rounded="lg"
      backgroundColor="white"
    >
      <Box
        w="full"
        h={{ base: 48, sm: 60, md: 48, xl: 60 }}
        rounded="lg"
        mb="5"
        backgroundColor="gray.100"
      ></Box>
      <VStack spacing={7}>
        <VStack justifyContent="center" w="full">
          {!inEditMode ? (
            <>
              <Heading>{title}</Heading>
              <Heading size="md">
                By {userContext?.userDetails.username}
              </Heading>

              <Box w="full">
                <Text noOfLines={showCompleteDescription ? 2 : 10}>
                  {description}
                </Text>
                <Button
                  onClick={() =>
                    setShowCompleteDescription(!showCompleteDescription)
                  }
                  variant="link"
                  colorScheme="blue"
                >
                  {showCompleteDescription ? "read more" : "hide"}
                </Button>
              </Box>
            </>
          ) : (
            <FormElement
              userInput={userInput}
              setUserInput={setUserInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading || isCardLoading}
            />
          )}
        </VStack>

        <HStack w="full" justifyContent="space-between" alignItems="center">
          <HStack spacing={5}>
            {!inEditMode ? (
              <Button
                as={Link}
                to={`/${userContext?.userDetails.username}/${noteId}`}
                colorScheme="blue"
              >
                Edit
              </Button>
            ) : (
              <Button
                isLoading={isLoading}
                loadingText="Please wait..."
                spinnerPlacement="end"
                type="submit"
                form="form"
                colorScheme="blue"
              >
                Save
              </Button>
            )}
            <Button
              isLoading={isLoading}
              loadingText="Please wait..."
              spinnerPlacement="end"
              colorScheme="red"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </HStack>
          <HStack spacing={5}>
            <IconButton aria-label="like" icon={<AiOutlineHeart />} />
            <IconButton aria-label="share" icon={<AiOutlineShareAlt />} />
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Card;
