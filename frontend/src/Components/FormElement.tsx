import { ChangeEvent, useState, FormEvent } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FormProps } from "../types/notes.types";

const FormElement = ({
  handleSubmit,
  userInput,
  setUserInput,
  isLoading,
}: FormProps) => {
  const toast = useToast();
  const [isInValid, setIsInvalid] = useState({
    title: false,
    description: false,
  });

  const handleUserInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleFormSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!userInput.title && !userInput.description)
      return setIsInvalid({
        title: true,
        description: true,
      });
    if (!userInput.title) return setIsInvalid({ ...isInValid, title: true });
    // if (!userInput.description)
    //   return setIsInvalid({ ...isInValid, description: true });

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

    handleSubmit(e);
  };  

  return (
    <VStack w="90%" onSubmit={handleFormSubmit} as="form" id="form" spacing={8}>
      <FormControl isInvalid={isInValid.title}>
        <FormLabel>Title</FormLabel>
        <Input
          disabled={isLoading}
          w="full"
          name="title"
          value={userInput?.title}
          onChange={handleUserInput}
          placeholder={isLoading ? "Loading..." : "Title here"}
        />
        {isInValid.title && (
          <FormErrorMessage>Title field cannot be empty</FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          disabled={isLoading}
          name="description"
          value={userInput?.description}
          onChange={handleUserInput}
          size="md"
          placeholder={isLoading ? "Loading..." : "Description here"}
        />
      </FormControl>
    </VStack>
  );
};

export default FormElement;
