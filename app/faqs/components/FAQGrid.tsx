"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import FAQs from "./../data.json";

const FAQGrid = () => {
	return (
		<div className="w-full">
			<Accordion type="single" collapsible className="w-full">
				{FAQs.map((faq) => (
					<AccordionItem key={faq.id} value={String(faq.id)}>
						<AccordionTrigger className="px-3 py-2 text-left font-baskerville text-base hover:no-underline">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="px-3 pb-2 text-muted-foreground text-sm leading-relaxed">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default FAQGrid;
