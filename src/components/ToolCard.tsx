import { Box, Flex, Text, Badge, Button, Icon } from "@chakra-ui/react"
import { LuClock, LuExternalLink, LuPlus, LuCheck } from "react-icons/lu"
import type { Tool, Category } from "../types"

const CATEGORY_COLORS: Record<string, string> = {
  "1. Discover": "#FF6B6B",
  "2. Research": "#FF8C42",
  "3. Validate": "#FFE66D",
  "4. Plan": "#95E1D3",
  "5. Design": "#4ECDC4",
  "6. Build": "#45B7D1",
  "7. Backend": "#74B9FF",
  "8. Ship": "#A8E6CF",
  "9. Monetize": "#FF8ED4",
  "10. Measure": "#DDA0DD",
  "11. Grow": "#98FB98",
}

interface ToolCardProps {
  tool: Tool
  inStack: boolean
  onToggleStack: (tool: Tool) => void
}

export function ToolCard({ tool, inStack, onToggleStack }: ToolCardProps) {
  const catColor = CATEGORY_COLORS[tool.Category as Category] || "#e5e5e5"

  return (
    <Box
      border="2px solid"
      borderColor="#1a1a1a"
      borderRadius="sm"
      bg="white"
      p="5"
      position="relative"
      transition="all 0.1s"
      boxShadow="4px 4px 0px #1a1a1a"
      _hover={{
        transform: "translate(-2px, -2px)",
        boxShadow: "6px 6px 0px #1a1a1a",
      }}
      display="flex"
      flexDirection="column"
      gap="3"
    >
      {tool.Featured && (
        <Badge
          position="absolute"
          top="-1px"
          right="-1px"
          bg="#FF6B6B"
          color="white"
          fontSize="2xs"
          fontWeight="black"
          borderRadius="none"
          border="2px solid"
          borderColor="#1a1a1a"
          px="2"
          py="0.5"
          letterSpacing="wider"
        >
          FEATURED
        </Badge>
      )}

      <Flex alignItems="center" gap="3">
        <Box
          w="9"
          h="9"
          bg={catColor}
          borderRadius="sm"
          border="2px solid"
          borderColor="#1a1a1a"
          overflow="hidden"
          flexShrink={0}
        >
          {tool.LogoUrl ? (
            <img
              src={tool.LogoUrl}
              alt={tool.Name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="100%"
            >
              <Text fontSize="sm" fontWeight="black" color="#1a1a1a">
                {tool.Name.charAt(0).toUpperCase()}
              </Text>
            </Box>
          )}
        </Box>
        <Box>
          <Text fontWeight="bold" fontSize="sm" color="#1a1a1a" lineClamp={1}>
            {tool.Name}
          </Text>
          <Flex alignItems="center" gap="1.5" flexWrap="wrap" mt="0.5">
            <Flex
              alignItems="center"
              bg={CATEGORY_COLORS[tool.Category] || "#e5e5e5"}
              border="1.5px solid"
              borderColor="#1a1a1a"
              borderRadius="sm"
              px="1.5"
              py="0"
              lineHeight="1"
            >
              <Text fontSize="2xs" fontWeight="bold" color="#1a1a1a">
                {tool.Category}
              </Text>
            </Flex>
            {tool.SecondCategory && (
              <Flex
                alignItems="center"
                bg={`${CATEGORY_COLORS[tool.SecondCategory] || "#e5e5e5"}20`}
                border="1.5px solid"
                borderColor={CATEGORY_COLORS[tool.SecondCategory] || "#ccc"}
                borderRadius="sm"
                px="1.5"
                py="0"
                lineHeight="1"
              >
                <Text fontSize="2xs" fontWeight="semibold" color="#555">
                  {tool.SecondCategory}
                </Text>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>

      <Text fontSize="xs" color="#555" lineHeight="tall" lineClamp={2} flex="1">
        {tool.OneLiner}
      </Text>

      <Flex alignItems="center" gap="2" flexWrap="wrap">
        <Flex
          alignItems="center"
          gap="1"
          bg="#f0fdf4"
          border="1.5px solid"
          borderColor="#16a34a"
          borderRadius="sm"
          px="2"
          py="0.5"
        >
          <Icon color="#16a34a" boxSize="3">
            <LuClock />
          </Icon>
          <Text fontSize="2xs" fontWeight="bold" color="#16a34a">
            Saves {tool.TimeSaved}
          </Text>
        </Flex>
        <Text fontSize="xs" color="#888" fontWeight="medium">
          {tool.Pricing}
        </Text>
        {tool.Discount && (
          <Flex
            alignItems="center"
            bg="#FF6B6B"
            border="1.5px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            px="2"
            py="0.5"
          >
            <Text fontSize="2xs" fontWeight="bold" color="white">
              {tool.Discount}
            </Text>
          </Flex>
        )}
      </Flex>

      <Flex gap="2" mt="1">
        <Button
          asChild
          size="xs"
          bg="#1a1a1a"
          color="white"
          border="2px solid"
          borderColor="#1a1a1a"
          borderRadius="sm"
          flex="1"
          fontWeight="bold"
          _hover={{ bg: "#333" }}
        >
          <a href={tool.AffiliateURL} target="_blank" rel="noopener noreferrer">
            Get Tool
            <Icon boxSize="3" ml="1">
              <LuExternalLink />
            </Icon>
          </a>
        </Button>
        <Button
          size="xs"
          variant="outline"
          bg={inStack ? "#4ECDC4" : "white"}
          border="2px solid"
          borderColor="#1a1a1a"
          color="#1a1a1a"
          borderRadius="sm"
          px="2"
          _hover={{
            bg: inStack ? "#3dbdb5" : "#f5f5f5",
          }}
          onClick={() => onToggleStack(tool)}
        >
          <Icon boxSize="3.5">
            {inStack ? <LuCheck /> : <LuPlus />}
          </Icon>
        </Button>
      </Flex>
    </Box>
  )
}
