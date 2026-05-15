import { Box, Flex, Text, Heading } from "@chakra-ui/react"
import { Icon } from "@chakra-ui/react"
import { LuZap } from "react-icons/lu"

export function Header() {
  return (
    <Box mb="10">
      <Flex alignItems="center" gap="3" mb="4">
        <Flex
          alignItems="center"
          justifyContent="center"
          w="10"
          h="10"
          bg="pop.yellow"
          border="3px solid"
          borderColor="#1a1a1a"
          borderRadius="sm"
          boxShadow="3px 3px 0px #1a1a1a"
        >
          <Icon color="#1a1a1a" boxSize="5">
            <LuZap />
          </Icon>
        </Flex>
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
