"use client";

import usePriceFeed from "@/app/PriceFeedProvider";
import type { Hypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { useEffect, useMemo, useRef } from "react";

type GraphNode = {
	id: string;
	kind: "work" | "author";
	name?: string;
	imageUrl?: string;
	color?: string;
	hypercertId?: string;
	author?: string;
};

export default function GraphView({ hypercerts }: { hypercerts: Hypercert[] }) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);
	const priceFeed = usePriceFeed();

	const nodes = useMemo<GraphNode[]>(
		() =>
			hypercerts.map((h) => ({
				id: h.hypercertId,
				kind: "work",
				name: h.name,
				imageUrl: `/api/hypercert-image/${h.hypercertId}`,
			})),
		[hypercerts],
	);

	const links = useMemo(() => {
		// Ensure a connected graph by linking nodes in a chain
		return nodes
			.slice(0, -1)
			.map((_, i) => ({ source: nodes[i].id, target: nodes[i + 1].id }));
	}, [nodes]);

	const hypercertById = useMemo(() => {
		const m = new Map<string, Hypercert>();
		for (const h of hypercerts) m.set(h.hypercertId, h);
		return m;
	}, [hypercerts]);

	const buildTooltipHTML = (h: Hypercert): string => {
		const name = h.name ?? "Untitled";
		const rawDesc = (h.description ?? "").trim();
		const MAX_LEN = 140;
		let desc = rawDesc;
		if (rawDesc.length > MAX_LEN) {
			const truncated = rawDesc.slice(0, MAX_LEN);
			const lastSpace = truncated.lastIndexOf(" ");
			desc = `${(lastSpace > 0
				? truncated.slice(0, lastSpace)
				: truncated
			).trimEnd()}…`;
		}
		const authors = Array.isArray(h.contributors) ? h.contributors : [];
		const idShort = `${h.hypercertId.slice(0, 6)}…${h.hypercertId.slice(-6)}`;
		const authorsText = authors.length
			? authors.join(", ").replace(/, ([^,]*)$/, " & $1")
			: "";
		return `
      <div style="display:flex;flex-direction:column;gap:6px;max-width:320px;">
        <div style="font-weight:600;">${escapeHtml(name)}</div>
        ${
					authorsText
						? `<div style=\"font-style:italic;color:var(--muted-foreground,#6b7280);font-size:12px;\">${escapeHtml(
								authorsText,
						  )}</div>`
						: ""
				}
        ${
					desc
						? `<div style=\"margin-top:4px;font-size:12px;\">${escapeHtml(
								desc,
						  )}</div>`
						: ""
				}
        <div style="color:var(--muted-foreground, #6b7280);font-size:11px;">${escapeHtml(
					idShort,
				)}</div>
      </div>
    `;
	};

	function escapeHtml(input: string): string {
		return input
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	useEffect(() => {
		let isCancelled = false;

		const init = async () => {
			const d3 = (await import("d3")) as unknown as typeof import("d3");
			if (!svgRef.current || !containerRef.current || isCancelled) return;

			const container = containerRef.current;
			const svg = d3.select(svgRef.current);

			const width = container.clientWidth || 800;
			const height = container.clientHeight || 600;

			svg.selectAll("*").remove();
			svg.attr("viewBox", `0 0 ${width} ${height}`);

			const imageSize = 48;
			const nodeRadius = imageSize / 2;

			type NodeDatum = GraphNode & d3.SimulationNodeDatum;
			type LinkDatum = d3.SimulationLinkDatum<NodeDatum>;
			const nodeData = nodes as NodeDatum[];
			const linkData = links as unknown as LinkDatum[];
			const simulation = d3
				.forceSimulation(nodeData)
				.force(
					"link",
					d3
						.forceLink<NodeDatum, LinkDatum>(linkData)
						.id((d) => (d as NodeDatum).id)
						.distance(120),
				)
				.force("charge", d3.forceManyBody().strength(-300))
				.force("center", d3.forceCenter(width / 2, height / 2))
				.force("collision", d3.forceCollide(nodeRadius * 1.1));

			const zoom = d3
				.zoom<SVGSVGElement, unknown>()
				.scaleExtent([0.4, 2])
				.on("zoom", (event) => {
					g.attr("transform", event.transform.toString());
				});

			svg.call(zoom);

			const g = svg.append("g");
			// Tooltip container
			const tooltip = document.createElement("div");
			tooltip.style.position = "absolute";
			tooltip.style.pointerEvents = "none";
			// Force solid white tooltip background for readability
			tooltip.style.background = "#ffffff";
			tooltip.style.border = "1px solid #E5E7EB"; // gray-200
			tooltip.style.borderRadius = "8px";
			tooltip.style.padding = "10px 12px";
			tooltip.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
			tooltip.style.color = "#111827"; // gray-900
			tooltip.style.fontSize = "12px";
			tooltip.style.zIndex = "50";
			tooltip.style.display = "none";
			// Ensure the container is a positioning context
			container.style.position = "relative";
			container.appendChild(tooltip);
			const link = g
				.append("g")
				.attr("stroke", "#9CA3AF")
				.attr("stroke-opacity", 0.6)
				.selectAll("line")
				.data(linkData)
				.join("line")
				.attr("stroke-width", 1.5);

			// No clip paths; we render the images directly

			const nodeGroup = g
				.append("g")
				.selectAll("g.node")
				.data(nodeData)
				.join("g")
				.attr("class", "node")
				.each(function (d) {
					d3.select<SVGGElement, NodeDatum>(this as SVGGElement)
						.datum(d as NodeDatum)
						.call(
							d3
								.drag<SVGGElement, NodeDatum>()
								.on("start", (event, d) => {
									if (!event.active) simulation.alphaTarget(0.3).restart();
									d.fx = d.x;
									d.fy = d.y;
								})
								.on("drag", (event, d) => {
									d.fx = event.x;
									d.fy = event.y;
								})
								.on("end", (event, d) => {
									if (!event.active) simulation.alphaTarget(0);
									d.fx = null;
									d.fy = null;
								}),
						);
				});

			// No outer circle/background; show only the image as the node

			nodeGroup
				.append("image")
				.attr("href", (d) => (d as GraphNode).imageUrl ?? "")
				.attr("width", imageSize)
				.attr("height", imageSize)
				.attr("x", -nodeRadius)
				.attr("y", -nodeRadius)
				.style("cursor", "pointer")
				.on("mouseover", (_event, d) => {
					const h = hypercertById.get((d as NodeDatum).id);
					if (!h) return;
					tooltip.innerHTML = buildTooltipHTML(h);
					tooltip.style.display = "block";
				})
				.on("mousemove", (event) => {
					const rect = container.getBoundingClientRect();
					const padding = 8;
					const offset = 8;
					const x = event.clientX - rect.left;
					const y = event.clientY - rect.top;

					// Default placement: to the right and below the cursor
					let left = x + offset;
					let top = y + offset;

					// Measure tooltip
					const tw = tooltip.offsetWidth || 0;
					const th = tooltip.offsetHeight || 0;
					const cw = container.clientWidth || 0;
					const ch = container.clientHeight || 0;

					// Flip horizontally if overflowing right edge
					if (left + tw + padding > cw) {
						left = x - tw - offset;
					}
					// Flip vertically if overflowing bottom edge
					if (top + th + padding > ch) {
						top = y - th - offset;
					}

					// Final clamp to keep within bounds
					left = Math.max(padding, Math.min(left, cw - tw - padding));
					top = Math.max(padding, Math.min(top, ch - th - padding));

					tooltip.style.left = `${left}px`;
					tooltip.style.top = `${top}px`;
				})
				.on("mouseout", () => {
					tooltip.style.display = "none";
				})
				.on("click", (_event, d) => {
					window.location.href = `/hypercert/${(d as NodeDatum).id}`;
				});

			const isNodeDatum = (v: unknown): v is NodeDatum =>
				typeof v === "object" &&
				v !== null &&
				"x" in (v as Record<string, unknown>) &&
				"y" in (v as Record<string, unknown>);

			simulation.on("tick", () => {
				link
					.attr("x1", (d) =>
						isNodeDatum(d.source) ? (d.source.x as number) : 0,
					)
					.attr("y1", (d) =>
						isNodeDatum(d.source) ? (d.source.y as number) : 0,
					)
					.attr("x2", (d) =>
						isNodeDatum(d.target) ? (d.target.x as number) : 0,
					)
					.attr("y2", (d) =>
						isNodeDatum(d.target) ? (d.target.y as number) : 0,
					);

				nodeGroup.attr("transform", (d: unknown) => {
					const nd = d as NodeDatum;
					return `translate(${nd.x},${nd.y})`;
				});
			});

			const resize = () => {
				const w = container.clientWidth || width;
				const h = container.clientHeight || height;
				svg.attr("viewBox", `0 0 ${w} ${h}`);
				simulation.force("center", d3.forceCenter(w / 2, h / 2));
				simulation.alpha(0.5).restart();
			};

			const ro = new ResizeObserver(resize);
			ro.observe(container);

			return () => {
				ro.disconnect();
				simulation.stop();
				try {
					container.removeChild(tooltip);
				} catch {}
			};
		};

		const cleanupPromise = init();
		return () => {
			isCancelled = true;
			// Best-effort cleanup if init finished
			void cleanupPromise;
		};
	}, [nodes, links, buildTooltipHTML, hypercertById]);

	if (hypercerts.length === 0) {
		return null;
	}

	return (
		<div
			ref={containerRef}
			className="h-[600px] w-full rounded-lg border border-border bg-background"
		>
			<svg ref={svgRef} className="h-full w-full" aria-label="Recerts graph" />
		</div>
	);
}
