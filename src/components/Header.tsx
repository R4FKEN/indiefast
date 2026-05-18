import { Box, Flex, Text, Heading, Image } from "@chakra-ui/react"

export function Header() {
  return (
    <Box mb="10">
      <Flex alignItems="center" gap="3" mb="4">
        <Image
          src="/indiefast-logo-nobg-500x500.png"
          alt="indiefa.st logo"
          w="10"
          h="10"
        />
        <Heading
          fontSize="3xl"
          fontWeight="black"
          fontFamily="heading"
          letterSpacing="tight"
          color="#1a1a1a"
        >
          indiefa.st
        </Heading>
      </Flex>
      <Text
        fontSize="md"
        color="#555"
        maxW="xl"
        lineHeight="tall"
        fontWeight="medium"
      >
        The curated, hyper-efficient software toolkit for modern builders.
        Zero bloat. Maximum velocity.
      </Text>
    </Box>
  )
}
