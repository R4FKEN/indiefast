import { Flex, Image, Text } from "@chakra-ui/react"

export function IndieFast() {
  return (
    <Flex
      as="a"
      href="https://indiefa.st"
      target="_blank"
      rel="noopener noreferrer"
      alignItems="center"
      gap="1.5"
      px="3"
      py="1.5"
      rounded="full"
      bg="gray.900"
      color="white"
      fontSize="xs"
      fontWeight="semibold"
      w="fit-content"
      _hover={{ bg: "gray.800" }}
      transition="backgrounds"
      transitionDuration="fast"
    >
      <Image
        src="/indiefast-logo-nobg-500x500.png"
        alt="indiefa.st"
        w="16px"
        h="16px"
        objectFit="contain"
      />
      <Text fontSize="xs" fontWeight="semibold">
        Built with indiefa.st
      </Text>
    </Flex>
  )
}
