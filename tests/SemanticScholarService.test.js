import { fetchAndComputeTldrAndAbstract } from "../src/services/SemanticScholarService";

const PAPER_ID = "e21c794b4941a5628b3b8c138e211a5b75b66a08";

const EXPECTED_ABSTRACT =
  "Group-size variation has been examined within a framework of costs and benefits to ecological factors such as food limitations and risks from predators. Social interactions between males from male–male competition might also influence group size particularly in polygynous males. To explore the role of social and ecological factors on group size outside the mating season I examined the influence of abundance on male grouping patterns in a population of Roosevelt elk (Cervus elaphus roosevelti) in northwestern California, USA. Male grouping patterns were complex, males often group with other males, but they also can be transient members of female groups. Because male\u2013male competition is pervasive even outside of the mating season, sizes of groups comprised of males only should be positive and linearly related to abundance of the male population or frequency associated. Whereas the number of males in female groups should be inversely related to female abundance or density associated. Males associating with females is more likely at low female abundance because females might still be reproductively active and per capita forage should be abundant. Across a 23-year study I examined whether male or female abundance was related to male only group sizes and the number of males in female groups. Size of male-only groups displayed a positive, linear relationship with male abundance and the number of males in female groups exhibited an inverse, linear relationship with female abundance. Uncovering forces influencing male grouping patterns required using the appropriate metric of abundance. Social factors likely influenced sizes of male-only groups and ecological factors probably influenced male prevalence in female groups.";
const EXPECTED_TLDR =
  "To explore the role of social and ecological factors on group size outside the mating season I examined the influence of abundance on male grouping patterns in a population of Roosevelt elk in northwestern California, USA.";

test("Test SemanticScholarService.fetchPaperTldrAndAbstract", async () => {
  let abstractAndTldr = await fetchAndComputeTldrAndAbstract(PAPER_ID);
  expect(abstractAndTldr.abstract).toBe(EXPECTED_ABSTRACT);
  expect(abstractAndTldr.tldr).toBe(EXPECTED_TLDR);
});

test("Test SemanticScholarService.fetchPaperTldrAndAbstract, not exists", async () => {
  let abstractAndTldr = await fetchAndComputeTldrAndAbstract(
    PAPER_ID + "some_fake_char"
  );
  expect(abstractAndTldr.abstract).toBe(null);
  expect(abstractAndTldr.tldr).toBe(null);
});
