import { HelpCircleIcon } from "lucide-react";

import { VerifiedStatus } from "@/components/settings/verified-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const VerifiedCitizen = () => {
	return (
		<section className="flex max-w-lg flex-col gap-4">
			<h2 className="font-semibold text-xl md:py-2 md:text-2xl">
				Citizen Verification
			</h2>
			<Card className="flex-1 rounded-md border-none bg-vd-blue-200 shadow-none">
				<CardHeader>
					<CardTitle className={cn("flex items-center gap-1 pb-0")}>
						<HelpCircleIcon size={16} strokeWidth={2} />
						Why does this matter?
					</CardTitle>
				</CardHeader>
				<CardContent>
					Our focus is on report authenticity, empowering local residents with
					the most accurate regional insights. Through Anon Aadhaar, a
					sophisticated cryptographic tool, we verify citizenship using
					Aadhaar’s QR code, ensuring privacy. For more information, read here.
				</CardContent>
			</Card>
			<VerifiedStatus />
		</section>
	);
};

VerifiedCitizen.displayName = "VerifiedCitizen";

export { VerifiedCitizen };
