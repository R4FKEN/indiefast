import { Box, Heading, Text } from "@chakra-ui/react"
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion"
import { extractFaqItems } from "@/utils/blog"

interface BlogPostFaqProps {
  schema?: Record<string, unknown>
}

export function BlogPostFaq({ schema }: BlogPostFaqProps) {
  const items = extractFaqItems(schema)
  if (items.length === 0) return null

  return (
    <Box mt="8" pt="6" borderTop="1px solid #e7dfcf">
      <Heading
        as="h2"
        fontSize="1.35rem"
        fontWeight={800}
        color="#1a1a1a"
        mb="4"
        lineHeight={1.3}
      >
        FAQ
      </Heading>

      <AccordionRoot
        collapsible
        multiple
        border="2px solid"
        borderColor="#1a1a1a"
        borderRadius="sm"
        overflow="hidden"
        bg="white"
      >
        {items.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={String(index)}
            borderBottom={index < items.length - 1 ? "1px solid #e7dfcf" : undefined}
          >
            <AccordionItemTrigger
              px="4"
              py="3"
              fontWeight={700}
              color="#1a1a1a"
              _hover={{ bg: "#FFFDF7" }}
            >
              <Text fontSize="sm" lineHeight="snug">
                {item.question}
              </Text>
            </AccordionItemTrigger>
            <AccordionItemContent px="4" pb="4" pt="1">
              <Text fontSize="sm" color="#333" lineHeight="tall">
                {item.answer}
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Box>
  )
}