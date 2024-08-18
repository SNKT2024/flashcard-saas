"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import db from "@/firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [showBack, setShowBack] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcard = [];
      docs.forEach((doc) => {
        flashcard.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcard);
    }
    getFlashcard();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleFlashcard = (index) => {
    setShowBack((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }} mb={4}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Typography variant="h5">{flashcard.name}</Typography>
            <Box
              sx={{
                perspective: "1000px", // Perspective for 3D effect
              }}
            >
              <Card
                onClick={() => toggleFlashcard(index)}
                sx={{
                  perspective: "1000px",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "200px",
                    textAlign: "center",
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    transform: showBack[index]
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  }}
                >
                  <CardContent
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#1976d2",
                      color: "white",
                    }}
                  >
                    <Typography>{flashcard.front}</Typography>
                  </CardContent>
                  <CardContent
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f50057",
                      color: "white",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Typography>{flashcard.back}</Typography>
                  </CardContent>
                </Box>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
