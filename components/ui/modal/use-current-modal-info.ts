import React, { useEffect, useState } from "react";

type ModalInfo = {
	dismissible: boolean;
	title: Element | string;
	description: Element | string;
};

const DEFAULT_MODAL_INFO: ModalInfo = {
	dismissible: true,
	title: "Untitled Modal",
	description: "No description found for this modal.",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useCurrentModalInfo = (modalIdStack: string[]) => {
	const [modalInfo, setModalInfo] = useState<ModalInfo>(DEFAULT_MODAL_INFO);

	// biome-ignore lint/correctness/useExhaustiveDependencies(modalIdStack): modalIdStack is the trigger for this side effect.
	useEffect(() => {
		wait(100).then(() => {
			const currentModal = document.querySelector("[data-current-modal]");
			if (!currentModal) {
				setModalInfo(DEFAULT_MODAL_INFO);
				return;
			}

			const title = currentModal.querySelector("[data-modal-title]");
			const description = currentModal.querySelector(
				"[data-modal-description]",
			);
			const dismissible = currentModal.querySelector(
				"[data-modal-dismissible]",
			);

			console.log("dismissible", dismissible);

			setModalInfo({
				dismissible:
					dismissible &&
					dismissible.getAttribute("data-modal-dismissible") === "true"
						? true
						: false,
				title: title ? title : DEFAULT_MODAL_INFO.title,
				description: description ? description : DEFAULT_MODAL_INFO.description,
			});
		});
	}, [modalIdStack]);

	return modalInfo;
};

export default useCurrentModalInfo;
