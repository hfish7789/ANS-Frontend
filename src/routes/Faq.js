import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

import { H2 as DefaultH2 } from '../components/Typography/Basic'
import slugify from 'slugify'
import ReverseRecordImageSrc from '../assets/reverseRecordImage.png'
import linkout from '../assets/Vector (1).png'
import faqMark from '../assets/Group 2920.png'
import {
  NonMainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'

import {
  Divider,
  Typography,
  Stack,
  Grid
} from '@mui/material'
import { Box } from '@mui/system'

const H2 = styled(DefaultH2)`
  margin-left: 20px;
  ${mq.medium`
    margin-left: 0;
  `}
`

const Question = styled('h3')`
  margin-right: 0.5em;
  font-size: 16px;
  opacity: 0.4;
  margin-bottom: 8px;
`

const Answer = styled('p')`
  font-size: 16px;
  opacity: 0.65;
  font-weight: 400;
`

const AnchorContainer = styled('a')``

const ImageContainer = styled('div')`
  margin: 2em;
`

const ReverseRecordImage = styled('img')`
  width: 100%;
  ${mq.medium`
    width: 600px;
  `}
`

const Section = ({ question, children }) => {
  let slug
  if (question) {
    slug = slugify(question, {
      lower: true
    })
  }
  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Question id={slug}>{question}</Question>
        <AnchorContainer href={`#${slug}`}>
          <Typography component="img" src={linkout} sx={{ width: "18px", height: "18px", opacity: "0.4", marginBottom: "-8px" }} />
        </AnchorContainer>
      </Stack>
      <Answer>{children}</Answer>
    </Box>
  )
}

function Faq() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = 'ANS Faq'
  }, [])

  return (
    <>
      {/*<NonMainPageBannerContainer>
        <DAOBannerContent />
      </NonMainPageBannerContainer>*/}
      <FaqContainer>
        <Typography sx={{ fontSize: "28px", fontWeight: "600", lineHeight: "34px" }}>FAQ</Typography>
        <Divider sx={{ my: "35px" }} />
        <Grid container direction="row" justifyContent="space-between">
          <Grid sm={12} md={6.65}>
            <H2>&nbsp;•&nbsp;&nbsp;Before You register</H2>
            <Section question="Is ANS only for storing an Avalanche address?">
              No, you can store the addresses <a style={{ color: "#F26155" }}>of over 100 blockchains</a>, a content
              hash of a decentralized website, profile information such as an avatar
              and Twitter handle, and more.
            </Section>

            <Section question="Can I use an ANS name to point to my website?">
              Though ANS can technically store anything, there aren't many third
              party tools and applications which resolve IP addresses attached to
              ANS.
              <br />
              Instead, <a style={{ color: "#F26155" }}>we suggest hosting your static html/css/images on IPFS</a> and
              put the hash in your ANS name's Content record. Then it can be
              resolved by ANS-aware browsers (e.g. Opera), browser extensions
              (Metamask), or any browser with ".link" or ".limo" appended to the end
              (e.g. matoken.avax.link or matoken.avax.limo).
              <br />
              If you want to redirect your ANS name to an existing website, you
              could write a html file containing JavasSript logic to redirect your
              website, upload the file into ipfs using services like{' '}
              <a href="https://pinata.cloud/">IPFS Pinata</a>, then set the CID to
              your contenthash. See the source code of depositcontract.avax.link as
              an example.
            </Section>

            <Section question="What is the maximum length of a name I can register?">
              There is no limit on the name length.
            </Section>

            <Section question="Can you have names with emojis?">Yes.</Section>

            <Section question="How much does it cost to register a .avax name?">
              Currently, registration costs are set at the following prices:
              <ul>
                <li>5+ character .avax names: <a style={{ color: "#F26155" }}>$5 in AVAX</a> per year.</li>
                <li>4 character .avax names: <a style={{ color: "#F26155" }}>$160 in AVAX</a> per year.</li>
                <li>3 character .avax names <a style={{ color: "#F26155" }}>$640 in AVAX</a> per year.</li>
              </ul>
              3 and 4 character names have <a style={{ color: "#F26155" }}>'premium'</a> pricing to reflect the small
              number of these names available.
              <br />
              Also, if the name was previously owned by someone but recently
              released, it has a temporary decreasing premium to prevent squatters
              snatching up names.
            </Section>

            <Section question="How much gas does it cost to register and extend registration?">
              It depends on the gas price. You can check the historical registration
              and extending transaction costs
              <a href="https://explore.duneanalytics.com/public/dashboards/48pBVvSxRNVjSE8Ing1uOrCtjD4r3WmV0v5KpS05">
                {' '}
                here{' '}
              </a>
              . "Transaction cost (USD)" query will tell you how much it costs to
              register (commit + registerWithConfig) and extend registration.
              <br />
              Please bear in mind that "registerWithConfig" combines 3 transactions
              (register, set resolver and set avax address) hence the gas cost is
              relatively expensive.
            </Section>

            <Section question="Can I register names other than .avax?">
              Yes, you can import into ANS any DNS name with the required DNSSEC.
              <br />
              Please refer to our{' '}
              <a href="https://docs.avaxns.domains/dns-registrar-guide">
                guide
              </a>{' '}
              for more detail.
            </Section>

            <H2>&nbsp;•&nbsp;&nbsp;When you register</H2>

            <Section question="At step 1, the transaction was slow so I speeded up">
              Our app cannot currently detect that you sped up the transaction.
              Please refresh the page and start from step 1 again.
            </Section>

            <Section question="I am stuck at step 2">
              At times, the counter waits for up to a minute at the end of step 2 to
              make sure that the Avalanche blockchain has progressed. If this
              continues for more than 5 min after moving to step 2, please contact
              us on Discord.
              <br />
              Note that if you leave it at step 2 for more than 7 days, it gets
              reset and you have to start from step 1 again.
            </Section>

            <Section question="My transaction at step 3 failed">
              This happens occasionally when the USD price changes and you haven,t
              registered with enough AVAX. Please try again from step3.
              <br />
              Please also be noted that the registration step will expire if you
              don't complete within 24 hrs and you have to start from step 1 again.
            </Section>

            <Section question="I cannot see the names I registered on OpenSea nor on my wallet">
              This occasionally happens when OpenSea is under a heavy load. You may
              also not find your name under the NFT section of your wallet, as many
              wallets fetch metadata from OpenSea.
              <br />
              As long as you can see your registered name under "My Account" on our
              site or your AVAX address under the name section, your name is
              registered successfully.
            </Section>

            <Section question="Is it safe to refresh the page, close the browser, or switch to different browser/machine?">
              It is safe to refresh the page or close the browser once step 1
              transaction is complete. However you cannot switch to different
              devices or machines because it needs a locally stored “secret” which
              will be used at step 3. Please also do not delete browser history
              during the registration.
            </Section>

            <H2>&nbsp;•&nbsp;&nbsp;After you register</H2>

            <Section question="What is the difference between the Registrant and Controller?">
              If your Avalanche address is set as the Controller you can change the
              resolver and add/edit records. Some dapps (eg: Fleek, OpenSea) set
              themselves as the Controller so they can update records on your
              behalf.
              <br />
              The Registrant only exists on ".avax" names and it allows you to
              change the Controller. If you transfer the Registrant to an address
              you don,t own, you lose the ownership of the name.
            </Section>

            <Section question="What is a Resolver?">
              A Resolver is a smart contract that holds records. Names are set by
              default to the Public Resolver managed by the ANS team and has all the
              standard ANS record types. You can set your Resolver to a custom
              resolver contract if you,d like.
            </Section>

            <Section question="What is a Primary ANS Name record?">
              A Primary ANS Name record (formerly Reverse Record) makes your
              Avalanche address point to an ANS name. This allows dapps to find and
              display your ANS name when you connect to them with your Avalanche
              account. This can only be set by you so it is not set automatically
              upon registration.
              <br />
              To set the Primary ANS Name record, please click "My account", and
              select "Primary ANS Name".
            </Section>

            <Section question="How do I unregister my name?">
              If you click the "trash bin" icon on the address record, it will unset
              your address so that people can no longer look up your address with
              the name. You can also unset ownership of subdomains in this way, but
              you cannot do so on ".avax" addresses. Because ‘.avax` names are
              ERC721-compliant NFTs, you cannot transfer them to an empty address
              (0x00000...). You can transfer it to a burn address (eg: 0x00001), but
              that does not erase the fact that you used to own the name. Also, the
              name will not become available for registration again until the
              registration period and grace period runs out.
            </Section>

            <Section question="How do I transfer my name?">
              For a ".avax" name, transfer both the Registrant and the Controller to
              the new Avalanche account. Since ".avax" names are ERC721 compliant
              NFTs, you can change the Registrant by simply transferring the NFT
              from any NFT compliant wallet/marketplace as well.
              <br />
              Note that transferring the ownership (aka the Registrant) of the name
              does not change the controller nor records, so the recipient may need
              to update them once received. If the recipient is not experienced or
              you prefer your address not to be associated to the transferring
              names, it may be a good idea for you to set the AVAX Address record to
              their Avalanche address, set the controller, then transfer the name.
              <br />
              For subdomains, there are no registrants unless the subdomain is
              customised to be ERC721 compliant. Simply set the controller to the
              new address (after setting the record to the new address).
            </Section>

            <Section question="Why are some of my subdomains shown as a jumble of characters?">
              ANS names are stored as a hash on-chain so we have to decode the name
              using a list of possible names, and it shows in the hashed format if
              we don,t have it on our list. You can still access and manage the name
              if you search for the name directly in the search bar.
            </Section>

            <Section question="How do I find the labelhash/namehash of a name?">
              Please refer to our{' '}
              <a href="https://docs.avaxns.domains/contract-api-reference/name-processing#how-do-i-find-the-labelhash-namehash-of-a-name">
                developer documentation page.
              </a>
            </Section>

            <H2>&nbsp;•&nbsp;&nbsp;When you extend your registration</H2>

            <Section question="How do I receive an extension reminder?">
              Click the "Remind me" button on the name,s page or your address page
              so that you can set a calendar reminder or email reminder. Note that
              you have to set calendar reminders per name, whereas you only need to
              set email reminders per the address of the owner. Also note that you
              can register a name for multiple years, removing the need to extend
              each year.
            </Section>

            <Section question="What happens if I forget to extend the registration of a name?">
              After your name expires, there is a 90 day grace period in which the
              owner can't edit the records but can still re-register the name. After
              the grace period, the name is released for registration by anyone with
              a temporary premium which decreases over a 28 days period. The
              released name continues to resolve your AVAX address until the new
              owner overwrites it.
            </Section>

            <Section question="I lost access to the Avalanche account that owns a name I registered. Can I still extend its registration period?">
              Any Avalanche account can pay to extend the registration of any ANS
              name, though doing so from an account that's not the owner will not
              change ownership of the name. Just go to the name,s page and click
              "Extend".
            </Section>

            <Section question="I registered names before 2019 May. Can I have my deposit back?">
              Yes, you can get your deposit back from
              <a href="https://reclaim.avaxns.domains">
                {' '}
                reclaim.avaxns.domains{' '}
              </a>{' '}
              whether you extended the registration of the name or not.
              <br />
              Please remember that the amount you will receive is the amount of the
              second-highest bidder (unless you were the only bidder). For example,
              if you bid 1 AVAX and the second highest bidder bid 0.1 AVAX, you
              deposited 0.1 AVAX and you have already received the remaining (0.9
              AVAX) when you finailsed the auction. Therefore you can now only
              reclaim 0.1 AVAX back. Please read the{' '}
              <a href="https://medium.com/the-ethereum-name-service/a-beginners-guide-to-buying-an-ens-domain-3ccac2bdc770">
                {' '}
                the initial guide back in 2017{' '}
              </a>{' '}
              for more detail.
            </Section>
          </Grid>
          <Grid sm={12} md={4.5} container justifyContent="center">
            <Box>
              <Typography component="img" src={faqMark} sx={{ maxWidth: "541px", maxHeight: "465px", width: "100%" }} />
            </Box>
          </Grid>
        </Grid>
      </FaqContainer>
    </>
  )
}

const FaqContainer = styled('div')`
  margin: 1em;
  padding: 92px;
  background-color: white;
`

export default Faq
