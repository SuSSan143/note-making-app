import { FormEvent, useContext, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import axios, { AxiosError } from "axios";

import { NoteContext } from "../context/NoteContext";
import FormElement from "./FormElement";

import { ModalProps } from "../types/notes.types";

const AddNewNoteModal = ({ isOpen, onClose }: ModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
  });
  const noteContext = useContext(NoteContext);

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/add-note", {
        data: userInput,
        notesId: noteContext?.notesId,
      });

      noteContext?.setNotes(data.notes);
      setUserInput({
        title: "",
        description: "",
      });
      onClose();
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

  const handleClose = () => {
    setUserInput({
      title: "",
      description: "",
    });
    onClose();
  };

  return (
    <Modal motionPreset="scale" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ADD NEW NOTE</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent="center">
            <FormElement
              userInput={userInput}
              setUserInput={setUserInput}
              handleSubmit={handleSubmit}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isLoading}
            loadingText="Please wait..."
            spinnerPlacement="end"
            type="submit"
            form="form"
            colorScheme="blue"
            mr={3}
          >
            Add
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddNewNoteModal;
