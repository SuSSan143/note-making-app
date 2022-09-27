import { ChangeEvent, FormEvent, useContext, useState } from "react";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import axios, { AxiosError } from "axios";

import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState("Sign In");
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });
  const [isInValid, setIsInvalid] = useState({
    username: false,
    password: false,
  });

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isInValid.password) setIsInvalid({ ...isInValid, password: false });
    if (isInValid.username) setIsInvalid({ ...isInValid, username: false });
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleSignIn = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!userInput.username && !userInput.password)
      return setIsInvalid({
        username: true,
        password: true,
      });
    if (!userInput.password)
      return setIsInvalid({ ...isInValid, password: true });
    if (!userInput.username)
      return setIsInvalid({ ...isInValid, username: true });

    setIsLoading(true);
    try {
      const { data: signInData } = await axios.post("https://note-making-app-backend.vercel.app/signin", {
        username: userInput.username,
        password: userInput.password,
      });

      userContext?.setUserDetails(signInData);
      return navigate(`/${signInData.username}`);
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

  const handleSignUp = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: signUpData } = await axios.post("https://note-making-app-backend.vercel.app/signup", {
        username: userInput.username,
        password: userInput.password,
      });
      toast({
        title: "Account created.",
        description: "You can login now",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
    <VStack
      justifyContent="space-between"
      py="8"
      alignItems="center"
      bgImage="url('/253796.jpg')"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
    >
      <HStack
        px={{ base: "3", sm: "10" }}
        w="full"
        as="nav"
        justifyContent="space-between"
      >
        <Heading size={{ base: "sm", sm: "xl" }} color="white">
          Authentication Page
        </Heading>
        <HStack>
          <Button onClick={() => setAuthType("Sign In")}>Log In</Button>
          <Button onClick={() => setAuthType("Sign Up")}>Sign Up</Button>
        </HStack>
      </HStack>
      <VStack
        onSubmit={authType === "Sign In" ? handleSignIn : handleSignUp}
        as="form"
        w={{ base: "90%", sm: "md", md: "lg" }}
      >
        <FormControl isInvalid={isInValid.username}>
          <FormLabel color="white">Username</FormLabel>
          <Input
            type="text"
            name="username"
            value={userInput.username}
            onChange={handleUserInput}
            color="white"
            variant="flushed"
          />
          {isInValid.username && (
            <FormErrorMessage color="black">
              Username is required
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={isInValid.password}>
          <FormLabel color="white">Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleUserInput}
            color="white"
            variant="flushed"
          />
          {isInValid.password && (
            <FormErrorMessage color="black">
              Password is required
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          isLoading={isLoading}
          loadingText={authType === "Sign In" ? "Signing In" : "Signing Up"}
          spinnerPlacement="end"
          type="submit"
        >
          {authType}
        </Button>
      </VStack>

      <VStack color="white">
        <Text>Made by the dude behind the Noon Pacific</Text>
        <Text>Inspired By Paul Nechita</Text>
      </VStack>
    </VStack>
  );
};

export default Auth;
