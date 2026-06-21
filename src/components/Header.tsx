import { Box, Flex, Text, Heading, Image } from "@chakra-ui/react"
import { SITE_COPY } from "@/constants/site-copy"

export function Header() {
  return (
    <Box mb="10">
      <Flex alignItems="center" gap="1" mb="4">
        <Image
          src="/indiefast-logo-nobg-500x500.png"
          alt="indiefa.st logo"
          w="64px"
          h="64px"
          flexShrink="0"
          objectFit="contain"
        />
        <Heading
          fontSize="3xl"
          fontWeight="black"
          fontFamily="heading"
          letterSpacing="tight"
          color="#1a1a1a"
        >
          {SITE_COPY.name}
        </Heading>
      </Flex>
      <Heading
        as="p"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="black"
        color="#1a1a1a"
        maxW="3xl"
        lineHeight="shorter"
        mb="3"
      >
        {SITE_COPY.tagline}
      </Heading>
      <Text
        fontSize="md"
        color="#444"
        maxW="2xl"
        lineHeight="tall"
        fontWeight="medium"
        mb="4"
      >
        {SITE_COPY.supporting}
      </Text>
      <Text fontSize="sm" color="#666" maxW="3xl" lineHeight="tall">
        {SITE_COPY.description}
      </Text>
    </Box>
  )
}