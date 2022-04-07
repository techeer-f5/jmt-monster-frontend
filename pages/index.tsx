import { Container, Typography } from "@mui/material";
import type { NextPage } from "next";
import React from "react";

const Index: NextPage = () => {
  return (
    <Container maxWidth="sm" className="flex-1 flex-row">
      <Typography variant="h1" className="text-purple-600">
        Hello, JMT Monster!
      </Typography>
    </Container>
  );
};

export default Index;
