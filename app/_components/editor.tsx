"use client";

import {
  EditorContent,
  JSONContent,
  useEditor,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./_layout/button";

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-5">
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        type="button"
        variant={
          editor.isActive("heading", { level: 1 }) ? "secondary" : "primary"
        }
      >
        <span>H1</span>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        type="button"
        variant={
          editor.isActive("heading", { level: 2 }) ? "secondary" : "primary"
        }
      >
        <span>H2</span>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        type="button"
        variant={
          editor.isActive("heading", { level: 3 }) ? "secondary" : "primary"
        }
      >
        <span>H3</span>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "primary"}
      >
        <span>Gras</span>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "primary"}
      >
        <span>Italique</span>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        type="button"
        variant={editor.isActive("strike") ? "secondary" : "primary"}
      >
        <span>Barré</span>
      </Button>
    </div>
  );
};

export function TipTapEditor({
  setJson,
  json,
  onContentChange, // Nouveau callback pour répercuter les changements
}: {
  setJson: any;
  json: JSONContent | null;
  onContentChange?: (content: JSONContent) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: json || { type: "doc", content: [] }, // Valeur par défaut (document vide)
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose-base",
      },
    },
    onUpdate: ({ editor }) => {
      const updatedJson = editor.getJSON();
      setJson(updatedJson);
      if (onContentChange) onContentChange(updatedJson); // Synchronisation avec le formulaire
    },
  });

  return (
    <div className="flex flex-col gap-y-2">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="rounded-lg border p-2 min-h-[150px]"
      />
    </div>
  );
}
