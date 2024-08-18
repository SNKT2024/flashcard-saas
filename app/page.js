"use client";
import React from "react";

import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Grid,
  Container,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import getStripe from "../utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Home = () => {
  const handleCheckout = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode == 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };
  const router = useRouter();
  return (
    <>
      <Container maxWidth>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                variant="contained"
                sx={{ marginRight: "15px" }}
                onClick={() => router.push("/flashcards")}
              >
                Show Saved Flash Cards
              </Button>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 2 }}
            href="/generate"
          >
            Get Started
          </Button>
        </Box>
        <Box sx={{ height: "400px" }} textAlign={"center"} mt={12}>
          <Typography variant="h4">Features</Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems={"center"}
          >
            {[
              {
                header: "Simple Card Creation",
                description:
                  "Quickly create new flashcards with an intuitive interface. Add questions and answers in just a few clicks.",
              },
              {
                header: "Test Your Knowledge",
                description:
                  "Use built-in quizzes to test your knowledge and reinforce learning. Immediate feedback helps you learn faster.",
              },
              {
                header: "Find What You Need",
                description:
                  "Easily search through your flashcards and organize them into sets for efficient study sessions.",
              },
            ].map((plan, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{ height: "300px" }}
              >
                <Box
                  sx={{
                    border: 1,
                    p: 2,
                    height: "350px",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5">{plan.header}</Typography>
                  <Typography variant="body1">{plan.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Pricing
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ height: "300px" }}
          >
            {[
              {
                name: "Free Plan",
                description: "Basic features for personal use.",
                price: "$0/month",
                priceId: null,
              },
              {
                name: "Pro Plan",
                description: "Advanced features for professionals.",
                price: "$5/month",
                priceId: "prod_QgD7DW8d5wIzFI",
              },
              {
                name: "Premium Plan",
                description: "All features with priority support.",
                price: "$9/month",
                priceId: "prod_QgD9nEERu7mtWU",
              },
            ].map((plan, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{ height: "300px" }}
              >
                <Box sx={{ border: 1, p: 2, height: "300px" }}>
                  <Typography variant="h6">{plan.name}</Typography>
                  <Typography>{plan.description}</Typography>
                  <Typography variant="h4" sx={{ my: 2 }}>
                    {plan.price}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCheckout}
                  >
                    Select
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;
