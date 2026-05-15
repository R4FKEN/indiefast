import { Box, Flex, Text, Input, Button } from "@chakra-ui/react"
import { useState } from "react"
import { submitEmail } from "../api"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      await submitEmail(email)
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <Box
      mt="16"
      mb="20"
      bg="#FFE66D"
      border="3px solid"
      borderColor="#1a1a1a"
      borderRadius="sm"
      boxShadow="5px 5px 0px #1a1a1a"
      p="6"
    >
      <Text fontSize="lg" fontWeight="black" color="#1a1a1a" mb="1">
        Stay in the loop
      </Text>
      <Text fontSize="sm" color="#555" mb="4">
        Get the zero-bloat toolkit updates. No spam, just tools.
      </Text>
      <form onSubmit={handleSubmit}>
        <Flex gap="2" maxW="lg">
          <Input
            placeholder="your@email.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            size="sm"
            bg="white"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            color="#1a1a1a"
            fontSize="sm"
            _placeholder={{ color: "#aaa" }}
            _focus={{
              borderColor: "#1a1a1a",
              outline: "none",
              boxShadow: "2px 2px 0px #1a1a1a",
            }}
            flex="1"
          />
          <Button
            type="submit"
            size="sm"
            bg="#1a1a1a"
            color="white"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            fontWeight="bold"
            fontSize="sm"
            px="6"
            loading={status === "loading"}
            disabled={status === "success"}
            boxShadow="2px 2px 0px rgba(0,0,0,0.3)"
            _hover={{ bg: "#333" }}
          >
            {status === "success" ? "Done!" : "Subscribe"}
          </Button>
        </Flex>
      </form>
      {status === "error" && (
        <Text fontSize="xs" color="#FF6B6B" mt="2" fontWeight="bold">
          Failed to subscribe. Try again.
        </Text>
      )}
    </Box>
  )
}
