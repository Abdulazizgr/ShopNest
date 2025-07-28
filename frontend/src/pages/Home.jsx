import React from "react";
import {
  BestSeller,
  Hero,
  LatestCollection,
  NewsletterBox,
  OurPolicy,
} from "../components";
import Section from "../components/Section";

const Home = () => {
  return (
    <div>
      <Section>
        <Hero />
      </Section>
      <Section>
        <LatestCollection />
      </Section>
      <Section>
        <BestSeller />
      </Section>
      <Section>
        <OurPolicy />
      </Section>
      <Section>
        <NewsletterBox />
      </Section>
    </div>
  );
};

export default Home;
