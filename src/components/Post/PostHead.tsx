import React from "react";
import styled from "@emotion/styled";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import PostHeadInfo, { PostHeadInfoProps } from "components/Post/PostHeadInfo";

interface PostHeadProps extends PostHeadInfoProps {
  thumbnail: IGatsbyImageData;
}

interface GatsbyImgProps {
  image: IGatsbyImageData;
  alt: string;
  className?: string;
}

const PostHeadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BackgroundImage = styled((props: GatsbyImgProps) => (
  <GatsbyImage {...props} style={{ position: "absolute" }} />
))`
  z-index: -1;
  width: 100%;
  height: 400px;
  object-fit: cover;
  filter: brightness(0.25);
  @media (max-width: 768px) {
    height: 300px;
  }
`;

function PostHead({ title, date, categories, thumbnail }: PostHeadProps) {
  return (
    <PostHeadWrapper>
      <BackgroundImage image={thumbnail} alt="thumbnail" />
      <PostHeadInfo title={title} date={date} categories={categories} />
    </PostHeadWrapper>
  );
}

export default PostHead;
