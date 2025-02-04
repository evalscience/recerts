"use client";
import React from "react";
import Masonry from "react-masonry-css";
import FAQs from "./../data.json";
import FAQCard from "./FAQCard";

const breakpointColsObj = {
	default: 2,
	768: 1,
};

const FAQGrid = () => {
	return (
		<Masonry
			breakpointCols={breakpointColsObj}
			className="flex w-auto gap-3"
			columnClassName="flex flex-col gap-3"
		>
			{FAQs.map((faq) => {
				return (
					<FAQCard key={faq.id} question={faq.question} answer={faq.answer} />
				);
			})}
		</Masonry>
	);
};

export default FAQGrid;
