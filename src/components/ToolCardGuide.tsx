import { cloneElement, isValidElement, useState, type ReactNode } from "react"
import { Box, Flex, Text, Badge, Button, Icon, Image } from "@chakra-ui/react"
import type { BoxProps } from "@chakra-ui/react"
import { LuClock, LuExternalLink, LuPlus, LuCheck, LuInfo } from "react-icons/lu"
import { Tooltip } from "@/components/ui/tooltip"
import { CATEGORY_COLORS, TOOL_CARD_HEIGHT } from "../constants"
import type { Category } from "../types"

interface GuideHintProps {
  title: string
  description?: string
  children: ReactNode
  placement?: "top" | "bottom" | "left" | "right"
  wrapperProps?: BoxProps
  /** When true, children are the tooltip trigger (for clickable controls). */
  interactive?: boolean
}

const hintHoverOutline = {
  outline: "2px dashed",
  outlineColor: "#FFE66D",
  outlineOffset: "2px",
}

function GuideHint({
  title,
  description,
  children,
  placement = "left",
  wrapperProps,
  interactive = false,
}: GuideHintProps) {
  const tooltipContent = description ? (
    <Box>
      <Text fontWeight="bold" mb="1">
        {title}
      </Text>
      <Text lineHeight="moderate">{description}</Text>
    </Box>
  ) : (
    <Text fontWeight="bold">{title}</Text>
  )

  if (interactive && isValidElement(children)) {
    return (
      <Tooltip
        content={tooltipContent}
        openDelay={200}
        closeDelay={100}
        positioning={{ placement }}
        contentProps={{ maxW: "xs", fontSize: "xs", lineHeight: "moderate" }}
      >
        {cloneElement(children, {
          ...wrapperProps,
          transition: "outline 0.1s",
          _hover: {
            ...(children.props as { _hover?: Record<string, unknown> })._hover,
            ...hintHoverOutline,
          },
        })}
      </Tooltip>
    )
  }

  return (
    <Tooltip
      content={tooltipContent}
      openDelay={200}
      closeDelay={100}
      positioning={{ placement }}
      contentProps={{ maxW: "xs", fontSize: "xs", lineHeight: "moderate" }}
    >
      <Box
        cursor="help"
        borderRadius="sm"
        transition="outline 0.1s"
        _hover={hintHoverOutline}
        {...wrapperProps}
      >
        {children}
      </Box>
    </Tooltip>
  )
}

const PRIMARY_CATEGORY = "6. Build" as const
const SECONDARY_CATEGORY = "8. Ship" as const
const catColor = CATEGORY_COLORS[PRIMARY_CATEGORY]
const secondCatColor = CATEGORY_COLORS[SECONDARY_CATEGORY as Category]

export function ToolCardGuide() {
  const [demoInStack, setDemoInStack] = useState(false)

  return (
    <Box
      w="full"
      position={{ lg: "sticky" }}
      top={{ lg: "6" }}
    >
      <Flex alignItems="center" gap="2" mb="3">
        <Icon boxSize="4" color="#1a1a1a">
          <LuInfo />
        </Icon>
        <Text fontSize="sm" fontWeight="black" color="#1a1a1a" letterSpacing="tight">
          How to read a tool card
        </Text>
        <Text fontSize="2xs" color="#888" fontWeight="medium">
          Hover each part
        </Text>
      </Flex>

      <Box
        w="full"
        border="2px solid"
        borderColor="#1a1a1a"
        borderRadius="sm"
        bg="white"
        p="5"
        h={TOOL_CARD_HEIGHT}
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
        <GuideHint
          title="Featured Badge"
          description="Shown on featured tools when you filter by a specific journey step (hidden on “All”). Marks community favorites — we surface these first in category views."
          placement="left"
        >
          <Badge
            position="absolute"
            top="-1px"
            right="-1px"
            bg="#FFE66D"
            color="#1a1a1a"
            fontSize="2xs"
            fontWeight="black"
            borderRadius="none"
            border="2px solid"
            borderColor="#1a1a1a"
            px="2"
            py="0.5"
            letterSpacing="wider"
            display="flex"
            alignItems="center"
            gap="1"
          >
            Featured Badge
            <Image src="/fire.gif" alt="" boxSize="3.5" objectFit="contain" />
          </Badge>
        </GuideHint>

        <Flex alignItems="center" gap="3">
          <Box w="9" h="9" flexShrink={0}>
            <GuideHint
              title="Logo"
              description="The tool’s brand mark from our directory. If no logo is available, you’ll see the first letter of the name on a color block matching the primary category."
              wrapperProps={{ w: "full", h: "full" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
                bg={catColor}
                borderRadius="sm"
                border="2px solid"
                borderColor="#1a1a1a"
                p="1"
              >
                <Text
                  fontSize="2xs"
                  fontWeight="black"
                  color="#1a1a1a"
                  lineHeight="1"
                  textAlign="center"
                  letterSpacing="tight"
                >
                  Logo
                </Text>
              </Box>
            </GuideHint>
          </Box>
          <Box>
            <GuideHint
              title="Tool Name"
              description="Official product name. One tool per journey step — pick the best fit, not every option in a category."
            >
              <Text fontWeight="bold" fontSize="sm" color="#1a1a1a" lineClamp={1}>
                Tool Name
              </Text>
            </GuideHint>
            <Flex alignItems="center" gap="1.5" flexWrap="wrap" mt="0.5">
              <GuideHint
                title="Primary Category"
                description="Which step of the founder path this tool belongs to (1. Discover → 11. Grow). Color matches the filter bar so you can scan the journey at a glance."
              >
                <Flex
                  alignItems="center"
                  bg={catColor}
                  border="1.5px solid"
                  borderColor="#1a1a1a"
                  borderRadius="sm"
                  px="1.5"
                  py="0"
                  lineHeight="1"
                >
                  <Text fontSize="2xs" fontWeight="bold" color="#1a1a1a">
                    Primary Category
                  </Text>
                </Flex>
              </GuideHint>
              <GuideHint
                title="Secondary Category"
                description="Optional. Appears when a tool is equally useful in a second journey step — softer styling so the primary step stays clear."
              >
                <Flex
                  alignItems="center"
                  bg={`${secondCatColor}20`}
                  border="1.5px solid"
                  borderColor={secondCatColor}
                  borderRadius="sm"
                  px="1.5"
                  py="0"
                  lineHeight="1"
                >
                  <Text fontSize="2xs" fontWeight="semibold" color="#555">
                    Secondary Category
                  </Text>
                </Flex>
              </GuideHint>
            </Flex>
          </Box>
        </Flex>

        <GuideHint title="Reasoning" placement="top">
          <Text
            fontSize="xs"
            color="#555"
            lineHeight="tall"
            lineClamp={4}
            minH={{ base: "72px", md: "64px" }}
          >
            Why we recommend this tool for solo founders — the concrete problem it solves. Pulled from our curation notes; falls back to the one-line summary if reasoning isn’t set.
          </Text>
        </GuideHint>

        <Box mt="auto">
          <Flex alignItems="center" justifyContent="space-between" gap="2" minH="28px" mb="3">
            <GuideHint
              title="Time Saved"
              description="Estimated hours saved per month versus doing the same work manually. Helps you compare ROI before you click through."
            >
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
                  Time Saved
                </Text>
              </Flex>
            </GuideHint>
            <GuideHint
              title="Discount"
              description="Deal or perk when available — free tier, credit, or coupon code. Only rendered when we have an active offer; empty deals are hidden."
            >
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
                  Discount
                </Text>
              </Flex>
            </GuideHint>
          </Flex>

          <Flex gap="2">
            <GuideHint
              title="Get Tool"
              description="Opens the tool’s website in a new tab."
              placement="top"
              wrapperProps={{ flex: "1" }}
            >
              <Button
                size="xs"
                bg="#1a1a1a"
                color="white"
                border="2px solid"
                borderColor="#1a1a1a"
                borderRadius="sm"
                flex="1"
                fontWeight="bold"
                w="full"
                _hover={{ bg: "#333" }}
              >
                Get Tool
                <Icon boxSize="3" ml="1">
                  <LuExternalLink />
                </Icon>
              </Button>
            </GuideHint>
            <GuideHint
              title="Speed Stack"
              description="Add or remove this tool from your stack. Stacked tools roll into a downloadable PDF cheat sheet — the + adds, a checkmark means already in stack on real tool cards."
              interactive
            >
              <Button
                size="xs"
                variant="outline"
                bg={demoInStack ? catColor : "white"}
                border="2px solid"
                borderColor="#1a1a1a"
                color="#1a1a1a"
                borderRadius="sm"
                px="2"
                _hover={{ bg: catColor }}
                onClick={() => setDemoInStack((prev) => !prev)}
                aria-pressed={demoInStack}
                aria-label={demoInStack ? "Remove from stack (demo)" : "Add to stack (demo)"}
              >
                <Icon boxSize="3.5">
                  {demoInStack ? <LuCheck /> : <LuPlus />}
                </Icon>
              </Button>
            </GuideHint>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}