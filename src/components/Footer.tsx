import { Box, Flex, Grid, Heading, Image, Link as ChakraLink, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"
import { LuHouse, LuMail } from "react-icons/lu"
import { FaXTwitter } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { SITE_COPY } from "@/constants/site-copy"

const footerLinkProps = {
  fontSize: "sm",
  color: "#9ca3af",
  lineHeight: "tall",
  display: "block",
  _hover: { color: "#FFE66D", textDecoration: "none" },
}

function FooterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="bold"
        color="white"
        letterSpacing="wide"
        textTransform="uppercase"
        mb="4"
      >
        {title}
      </Text>
      <Box as="ul" listStyleType="none" m="0" p="0">
        {children}
      </Box>
    </Box>
  )
}

function FooterListItem({ children }: { children: ReactNode }) {
  return (
    <Box as="li" mb="2.5">
      {children}
    </Box>
  )
}

function ExternalFooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <ChakraLink href={href} target="_blank" rel="noopener noreferrer" {...footerLinkProps}>
      {children}
    </ChakraLink>
  )
}

function InternalFooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <ChakraLink asChild {...footerLinkProps}>
      <Link to={to}>{children}</Link>
    </ChakraLink>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box as="footer" bg="#111827" color="#9ca3af" mt="16">
      <Box maxW="7xl" mx="auto" px={{ base: "4", md: "6", lg: "8" }} py={{ base: "10", md: "12" }}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "2fr 1fr 1.4fr" }}
          gap={{ base: "8", lg: "10" }}
        >
          <Box>
            <ChakraLink asChild _hover={{ textDecoration: "none", opacity: 0.9 }}>
              <Link to="/">
                <Flex align="center" gap="2" mb="4">
                  <Image
                    src="/indiefast-logo-nobg-500x500.png"
                    alt="indiefa.st logo"
                    w="12"
                    h="12"
                    objectFit="contain"
                  />
                  <Heading
                    fontSize="xl"
                    fontWeight="black"
                    fontFamily="heading"
                    color="white"
                    letterSpacing="tight"
                  >
                    {SITE_COPY.name}
                  </Heading>
                </Flex>
              </Link>
            </ChakraLink>
            <Text fontSize="sm" lineHeight="tall" mb="4" maxW="sm">
              {SITE_COPY.supporting}
            </Text>
            <Text fontSize="xs" lineHeight="tall" color="#6b7280" maxW="md">
              Some links on this site may be affiliate links, which means I may earn a small
              commission at no extra cost to you. I only recommend tools and products I
              genuinely find useful.
            </Text>
          </Box>

          <FooterSection title="Resources">
            <FooterListItem>
              <InternalFooterLink to="/blog">Blog</InternalFooterLink>
            </FooterListItem>
            <FooterListItem>
              <ExternalFooterLink href="https://indiefa.st/sitemap.xml">Sitemap</ExternalFooterLink>
            </FooterListItem>
            <FooterListItem>
              <ExternalFooterLink href="https://indiefa.st/robots.txt">Robots.txt</ExternalFooterLink>
            </FooterListItem>
            <FooterListItem>
              <ExternalFooterLink href="https://indiefa.st/llms.txt">LLMs.txt</ExternalFooterLink>
            </FooterListItem>
          </FooterSection>

          <FooterSection title="By The Maker Of indiefa.st">
            <FooterListItem>
              <ExternalFooterLink href="https://lin-k.to/?utm_source=indiefast&utm_medium=website&utm_campaign=footer">
                <Box as="span" fontWeight="semibold" color="#d1d5db">
                  Linkto
                </Box>
                : Free SaaS Backlinks Database
              </ExternalFooterLink>
            </FooterListItem>
            <FooterListItem>
              <ExternalFooterLink href="https://chromegoldmine.com/?utm_source=indiefast&utm_medium=website&utm_campaign=footer">
                <Box as="span" fontWeight="semibold" color="#d1d5db">
                  The Chrome Goldmine
                </Box>
                : Database of Expired Chrome Extensions for Developers
              </ExternalFooterLink>
            </FooterListItem>
          </FooterSection>
        </Grid>

        <Box borderTop="1px solid" borderColor="#374151" pt="8" mt="10">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap="6"
          >
            <Text fontSize="sm">
              © {year} {SITE_COPY.name}. All rights reserved.
            </Text>

            <Flex align="center" gap="5">
              <ChakraLink
                href="mailto:support@indiefa.st"
                aria-label="Email support@indiefa.st"
                color="#9ca3af"
                _hover={{ color: "#FFE66D" }}
              >
                <LuMail size={20} />
              </ChakraLink>
              <ChakraLink
                href="https://rafvantongerloo.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="rafvantongerloo.com"
                color="#9ca3af"
                _hover={{ color: "#FFE66D" }}
              >
                <LuHouse size={20} />
              </ChakraLink>
              <ChakraLink
                href="https://x.com/RafVantongerloo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                color="#9ca3af"
                _hover={{ color: "#FFE66D" }}
              >
                <FaXTwitter size={18} />
              </ChakraLink>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}