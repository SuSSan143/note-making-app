import { useContext, useEffect } from "react";

import {
  Box,
  Button,
  Heading,
  IconButton,
  SimpleGrid,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

import { GrAdd } from "react-icons/gr";

import Card from "../Components/Card";
import AddNewNoteModal from "../Components/AddNewNoteModal";
import { NoteContext } from "../context/NoteContext";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const noteContext = useContext(NoteContext);
  const userContext = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("https://note-making-app-backend.vercel.app/check-user");

        if (data) {
          userContext?.setUserDetails(data);
          return data.notesId;
        }
      } catch (error) {
        navigate("/");
      }
    };

    const fetchData = async (notesId: string) => {
      const { data } = await axios.get(`https://note-making-app-backend.vercel.app/get-notes/${notesId}`);
      noteContext?.setNotes(data.notes);
    };

    fetchUser().then((response) => {
      if (response) fetchData(response);
    });
  }, []);

  const handleLogout = async () => {
    await axios.delete("https://note-making-app-backend.vercel.app/logout");
    navigate("/");
  };

  return (
    <>
      <SimpleGrid
        backgroundColor="#e5e5e5"
        w="full"
        h="full"
        minH="100vh"
        py="16"
        columns={[1, 1, 2, 3]}
        justifyItems="center"
        alignItems="center"
        spacing="8"
      >
        {!noteContext?.notes?.length && <Heading>No data found</Heading>}
        {noteContext?.notes &&
          noteContext?.notes?.map((item, index) => (
            <Card
              key={index}
              title={item?.title}
              description={item?.description}
              noteId={item._id}
            />
          ))}
      </SimpleGrid>
      <Box position="fixed" bottom="30px" left="30px">
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box position="fixed" bottom="30px" right="30px">
        <Tooltip label="Add new Note" placement="left">
          <IconButton
            colorScheme="messenger"
            rounded="full"
            size="lg"
            onClick={onOpen}
            aria-label="add note"
            icon={<GrAdd size="1.8rem" />}
          />
        </Tooltip>
        <AddNewNoteModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
};

export default Home;
