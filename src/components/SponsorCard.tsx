import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react"
import { LuSparkles } from "react-icons/lu"
import { TOOL_CARD_HEIGHT } from "@/constants"
import featuredListingSource from "@/data/featured-listings.json"
import type { FeaturedListing, Tool } from "@/types"
import { ToolCard } from "./ToolCard"

const FEATURED_LISTINGS: FeaturedListing[] = featuredListingSource.featuredListings
const RANKFAST_LISTING = FEATURED_LISTINGS.find((listing) => listing.id === "rankfast")

if (!RANKFAST_LISTING) {
  throw new Error("Missing RankFast featured listing data")
}

const RANKFAST_TOOL: Tool = {
  id: RANKFAST_LISTING.id,
  Name: RANKFAST_LISTING.name,
  Category: RANKFAST_LISTING.category,
  SecondCategory: "",
  OneLiner: RANKFAST_LISTING.description,
  Reasoning: RANKFAST_LISTING.description,
  TimeSaved: "",
  Pricing: "",
  AffiliateURL: RANKFAST_LISTING.url,
  Discount: "",
  Featured: true,
  Subtopic: RANKFAST_LISTING.subtopic,
  LogoUrl: RANKFAST_LISTING.logoUrl,
}

interface RankFastCardProps {
  inStack: boolean
  onToggleStack: (tool: Tool) => void
}

export function RankFastCard({ inStack, onToggleStack }: RankFastCardProps) {
  return (
    <ToolCard
      tool={RANKFAST_TOOL}
      inStack={inStack}
      onToggleStack={onToggleStack}
      badgeLabel="Featured"
    />
  )
}

export function SponsorCard() {
  return (
    <Box
      border="2px solid"
      borderColor="#1a1a1a"
      borderRadius="sm"
      bg="white"
      p={{ base: "4", xl: "5" }}
      h={{ base: "auto", xl: TOOL_CARD_HEIGHT.lg }}
      display="flex"
      flexDirection="column"
      gap="3"
      transition="all 0.1s"
      boxShadow="4px 4px 0px #1a1a1a"
      _hover={{
        transform: "translate(-2px, -2px)",
        boxShadow: "6px 6px 0px #1a1a1a",
      }}
    >
      <Flex alignItems="center" gap="2">
        <Flex
          w="9"
          h="9"
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
          bg="#FFE66D"
          border="2px solid"
          borderColor="#1a1a1a"
          borderRadius="sm"
        >
          <Icon boxSize="4" color="#1a1a1a">
            <LuSparkles />
          </Icon>
        </Flex>
        <Text fontSize="2xs" fontWeight="black" letterSpacing="wider" color="#555">
          SPONSOR SPOT
        </Text>
      </Flex>

      <Box>
        <Text
          fontSize={{ base: "sm", xl: "md" }}
          fontWeight="black"
          lineHeight="short"
          color="#1a1a1a"
        >
          Sponsor us to get featured!
        </Text>
        <Text fontSize="xs" color="#555" mt="2" lineHeight="tall">
          Put your product in front of indie makers. Only $25/month! Or, pay $200 for a whole year!
        </Text>
      </Box>

      <Button
        asChild
        size="xs"
        mt="auto"
        bg="#1a1a1a"
        color="white"
        border="2px solid"
        borderColor="#1a1a1a"
        borderRadius="sm"
        fontWeight="bold"
        _hover={{ bg: "#333" }}
      >
        <a href="mailto:support@indiefa.st?subject=Sponsor%20IndieFast">
          Get featured
        </a>
      </Button>
    </Box>
  )
}
