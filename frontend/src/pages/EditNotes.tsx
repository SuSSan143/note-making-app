import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../Components/Card";
import { Flex } from "@chakra-ui/react";
import { UserContext } from "../context/UserContext";

const EditNotes = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext);
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    noteId: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/check-user");

        if (data) {
          userContext?.setUserDetails(data);
          return data.notesId;
        }
      } catch (error) {
        navigate("/");
      }
    };

    const fetchData = async (notesId: string) => {
      const { data } = await axios.get(`/api/get-note/${notesId}/${noteId}`);
      setNoteData({
        title: data.title,
        description: data.description,
        noteId: data._id,
      });
    };

    fetchUser().then((response) => {
      if (response) fetchData(response);
      setIsLoading(false);
    });
  }, []);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      bgColor="#e5e5e5"
    >
      <Card
        title={noteData.title}
        description={noteData.title}
        noteId={noteData.noteId}
        inEditMode
        isCardLoading={isLoading}
      />
    </Flex>
  );
};

export default EditNotes;
