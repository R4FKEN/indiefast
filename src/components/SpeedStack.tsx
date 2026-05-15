import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react"
import { Tooltip } from "@/components/ui/tooltip"
import { LuX, LuCopy, LuCopyCheck } from "react-icons/lu"
import { useState, useEffect, useRef } from "react"
import type { Tool } from "../types"

interface SpeedStackProps {
  stack: Tool[]
  onRemove: (tool: Tool) => void
  onClose?: () => void
}

export function SpeedStack({ stack, onRemove, onClose }: SpeedStackProps) {
  const [copied, setCopied] = useState(false)
  const [closed, setClosed] = useState(false)
  const prevLengthRef = useRef(stack.length)

  useEffect(() => {
    if (stack.length > prevLengthRef.current) {
      setClosed(false)
    }
    prevLengthRef.current = stack.length
  }, [stack.length])

  if (stack.length === 0 || closed) return null

  const exportText = stack
    .map((t) => `${t.Name} — ${t.Category} — ${t.AffiliateURL}`)
    .join("\n")

  function handleCopy() {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Box
      position="fixed"
      bottom="4"
      left="4"
      right="4"
      bg="white"
      border="3px solid"
      borderColor="#1a1a1a"
      borderRadius="sm"
      px={{ base: "4", md: "6" }}
      py="3"
      zIndex="sticky"
      boxShadow="5px 5px 0px #1a1a1a"
      maxW="5xl"
      mx="auto"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="4"
      >
        <Flex alignItems="center" gap="3" flex="1" overflow="hidden">
          <Flex
            alignItems="center"
            gap="1"
            bg="#FFE66D"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            px="2"
            py="0.5"
            flexShrink={0}
          >
            <Text fontSize="xs" color="#1a1a1a" fontWeight="black">
              STACK [{stack.length}]
            </Text>
          </Flex>
          <Flex gap="2" overflow="auto" flex="1">
            {stack.map((tool) => (
              <Flex
                key={tool.id}
                alignItems="center"
                gap="1"
                bg="#f5f5f5"
                border="1.5px solid"
                borderColor="#1a1a1a"
                borderRadius="sm"
                px="2"
                py="1"
                flexShrink={0}
              >
                <Text fontSize="2xs" color="#1a1a1a" fontWeight="bold">
                  {tool.Name}
                </Text>
                <Box
                  as="button"
                  onClick={() => onRemove(tool)}
                  cursor="pointer"
                  color="#888"
                  _hover={{ color: "#FF6B6B" }}
                  display="flex"
                >
                  <Icon boxSize="3">
                    <LuX />
                  </Icon>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Flex alignItems="center" gap="2" flexShrink={0}>
          <Button
            size="xs"
            bg={copied ? "#4ECDC4" : "#1a1a1a"}
            color="white"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            fontWeight="bold"
            _hover={{ bg: copied ? "#3dbdb5" : "#333" }}
            onClick={handleCopy}
          >
            <Icon boxSize="3.5">
              {copied ? <LuCopyCheck /> : <LuCopy />}
            </Icon>
            {copied ? "Copied!" : "Export"}
          </Button>
          <Tooltip content="Close" openDelay={200} closeDelay={100}>
            <Box
              as="button"
              onClick={() => {
                setClosed(true)
                onClose?.()
              }}
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="6"
              h="6"
              borderRadius="full"
              border="2px solid"
              borderColor="#1a1a1a"
              bg="white"
              color="#1a1a1a"
              _hover={{ bg: "#FF6B6B", borderColor: "#FF6B6B", color: "white" }}
              transition="all 0.1s"
              flexShrink={0}
            >
              <Icon boxSize="3">
                <LuX />
              </Icon>
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}
