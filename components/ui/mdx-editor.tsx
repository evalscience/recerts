"use client";

import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CreateLink,
	InsertTable,
	InsertThematicBreak,
	ListsToggle,
	MDXEditor,
	type MDXEditorMethods,
	type MDXEditorProps,
	Separator,
	UndoRedo,
	headingsPlugin,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	markdownShortcutPlugin,
	quotePlugin,
	tablePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import React, { type ForwardedRef } from "react";

function MarkdownEditor({
	editorRef,
	showToolbar = true,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps & {
		showToolbar?: boolean;
	}) {
	const toolbar = toolbarPlugin({
		toolbarContents: () => {
			return (
				<div className="flex flex-col">
					<div className="flex items-center">
						<UndoRedo />

						<Separator />

						<BoldItalicUnderlineToggles />

						<Separator />

						<BlockTypeSelect />

						<Separator />

						<ListsToggle />

						<Separator />

						<CreateLink />
						<InsertTable />

						<Separator />

						<InsertThematicBreak />
					</div>
				</div>
			);
		},
	});

	return (
		<MDXEditor
			contentEditableClassName="prose"
			plugins={[
				headingsPlugin(),
				listsPlugin(),
				quotePlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				tablePlugin(),
				thematicBreakPlugin(),
				markdownShortcutPlugin(),
				...(showToolbar ? [toolbar] : []),
			]}
			{...props}
			ref={editorRef}
		/>
	);
}
export default MarkdownEditor;
