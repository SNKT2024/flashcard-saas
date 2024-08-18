"use client";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import db from "@/firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function getFlashcards() {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        const docRef = doc(collection(db, "users"), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcards();
  }, [isLoaded, isSignedIn, user]);

  const handleCardClick = (name) => {
    setFlipped((prev) => ({ ...prev, [name]: !prev[name] }));
    router.push(`/flashcard?id=${name}`);
  };

  const handleDelete = async (name) => {
    try {
      // Filter out the flashcard to be deleted
      const updatedFlashcards = flashcards.filter(
        (flashcard) => flashcard.name !== name
      );
      setFlashcards(updatedFlashcards);

      // Update the Firestore database
      const docRef = doc(collection(db, "users"), user.id);
      await updateDoc(docRef, { flashcards: updatedFlashcards });
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  if (!flashcards.length) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
          No flashcards available. Please check if you have selected a valid
          flashcard set.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Box>
                    <Typography variant="h5" component="div">
                      {flipped[flashcard.name]
                        ? flashcard.name
                        : flashcard.name}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
              <Button onClick={() => handleDelete(flashcard.name)}>
                <DeleteIcon fontSize="large" />
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
