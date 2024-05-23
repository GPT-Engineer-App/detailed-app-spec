import { useState, useEffect } from "react";
import { Container, Text, VStack, Box, Button, Input, Select, Textarea, HStack } from "@chakra-ui/react";

// Supabase URL and Anon Key
const SUPABASE_URL = "https://jjfebbwwtcxyhvnkuyrh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZmViYnd3dGN4eWh2bmt1eXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NTgyMzMsImV4cCI6MjAzMjAzNDIzM30.46syqx3sHX-PQMribS6Vt0RLLUY7w295JHO61yZ-fec";

// Fetch notes from Supabase
const fetchNotes = async () => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const data = await response.json();
  return data;
};

// Add a new note to Supabase
const addNote = async (note) => {
  await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
};

// Delete a note from Supabase
const deleteNote = async (id) => {
  await fetch(`${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
};

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const getNotes = async () => {
      const notes = await fetchNotes();
      setNotes(notes);
    };
    getNotes();
  }, []);

  const handleAddNote = async () => {
    const newNote = { title, content, category };
    await addNote(newNote);
    const notes = await fetchNotes();
    setNotes(notes);
    setTitle("");
    setContent("");
    setCategory("");
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    const notes = await fetchNotes();
    setNotes(notes);
  };

  const filteredNotes = filter ? notes.filter(note => note.category === filter) : notes;

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Notes App</Text>
        <Box width="100%">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={2}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            mb={2}
          />
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            mb={2}
          />
          <Button onClick={handleAddNote} colorScheme="teal" width="100%">
            Add Note
          </Button>
        </Box>
        <Box width="100%">
          <Select
            placeholder="Filter by category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            mb={4}
          >
            <option value="">All</option>
            {Array.from(new Set(notes.map(note => note.category))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          {filteredNotes.map(note => (
            <Box key={note.id} p={4} shadow="md" borderWidth="1px" mb={4}>
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">{note.title}</Text>
                <Button size="sm" colorScheme="red" onClick={() => handleDeleteNote(note.id)}>
                  Delete
                </Button>
              </HStack>
              <Text mt={2}>{note.content}</Text>
              <Text mt={2} fontSize="sm" color="gray.500">{note.category}</Text>
            </Box>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;