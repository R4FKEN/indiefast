import { Box, Flex, Text, Input, Button } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { submitEmail } from "../api"

export function Newsletter() {
  const emailRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const email = emailRef.current?.value.trim() ?? ""
    if (!email) return
    setStatus("loading")
    setErrorMessage("")
    try {
      await submitEmail(email)
      setStatus("success")
      if (emailRef.current) emailRef.current.value = ""
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Failed to subscribe. Try again.")
      setTimeout(() => setStatus("idle"), 4000)
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
        Follow the path
      </Text>
      <Text fontSize="sm" color="#555" mb="4">
        Weekly refreshes across every stage — one vetted pick at a time, with the best live discount on each.
      </Text>
      <form onSubmit={handleSubmit} autoComplete="on">
        <Flex gap="2" maxW="lg">
          <Input
            id="newsletter-email"
            name="email"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="send"
            ref={emailRef}
            placeholder="your@email.dev"
            type="email"
            size="sm"
            aria-label="Email address"
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
          {errorMessage || "Failed to subscribe. Try again."}
        </Text>
      )}
    </Box>
  )
}
