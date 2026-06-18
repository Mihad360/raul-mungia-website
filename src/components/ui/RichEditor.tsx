"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Link as LinkIcon,
  Undo,
  Redo,
  Quote,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Code,
  Code2,
  Minus,
  RemoveFormatting,
  Pilcrow,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  toolbarTopOffset?: number;
}

const RichEditor = ({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = 240,
  toolbarTopOffset = 0,
}: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({
        HTMLAttributes: { style: "background-color: #fef08a;" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content focus:outline-none",
        style: `min-height: ${minHeight}px; padding: 16px;`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className="border border-gray-200 rounded-lg bg-gray-50"
        style={{ minHeight: minHeight + 50 }}
      />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg bg-white">
        {/* Sticky Toolbar */}
        <div
          className="flex flex-wrap gap-0.5 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg sticky z-20 shadow-sm"
          style={{ top: `${toolbarTopOffset}px` }}
        >
          {/* ─── Paragraph / Headings ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            icon={Pilcrow}
            title="Paragraph"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Heading 1"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Heading 3"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            active={editor.isActive("heading", { level: 4 })}
            icon={Heading4}
            title="Heading 4"
          />

          <Divider />

          {/* ─── Inline Formatting ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            icon={Bold}
            title="Bold (Ctrl+B)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            icon={Italic}
            title="Italic (Ctrl+I)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            icon={UnderlineIcon}
            title="Underline (Ctrl+U)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            icon={Strikethrough}
            title="Strikethrough"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            icon={Highlighter}
            title="Highlight"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            icon={Code}
            title="Inline Code"
          />

          <Divider />

          {/* ─── Alignment ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            title="Align Right"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            icon={AlignJustify}
            title="Justify"
          />

          <Divider />

          {/* ─── Lists & Blocks ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Numbered List"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            icon={Code2}
            title="Code Block"
          />

          <Divider />

          {/* ─── Insert ─── */}
          <ToolButton
            onClick={setLink}
            active={editor.isActive("link")}
            icon={LinkIcon}
            title="Insert Link"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            title="Horizontal Line"
          />

          <Divider />

          {/* ─── Utils ─── */}
          <ToolButton
            onClick={clearFormatting}
            icon={RemoveFormatting}
            title="Clear Formatting"
          />
          <ToolButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={Undo}
            title="Undo (Ctrl+Z)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={Redo}
            title="Redo (Ctrl+Y)"
          />
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Styles */}
      <style jsx global>{`
        .rich-editor-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          color: #111827;
        }
        .rich-editor-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          color: #111827;
        }
        .rich-editor-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
          color: #111827;
        }
        .rich-editor-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
          color: #111827;
        }
        .rich-editor-content p {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #374151;
        }
        .rich-editor-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor-content ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor-content li {
          margin: 0.25rem 0;
        }
        .rich-editor-content blockquote {
          border-left: 3px solid #c70a24;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
          font-style: italic;
        }
        .rich-editor-content a {
          color: #c70a24;
          text-decoration: underline;
        }
        .rich-editor-content strong {
          font-weight: 700;
        }
        .rich-editor-content em {
          font-style: italic;
        }
        .rich-editor-content u {
          text-decoration: underline;
        }
        .rich-editor-content s {
          text-decoration: line-through;
        }
        .rich-editor-content mark {
          background-color: #fef08a;
          padding: 0 2px;
          border-radius: 2px;
        }
        .rich-editor-content code {
          background-color: #f3f4f6;
          color: #c70a24;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.875em;
          font-family: ui-monospace, SFMono-Regular, monospace;
        }
        .rich-editor-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.875rem;
        }
        .rich-editor-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        .rich-editor-content hr {
          border: 0;
          border-top: 1px solid #e5e7eb;
          margin: 1.5rem 0;
        }
        .rich-editor-content [data-text-align="center"] {
          text-align: center;
        }
        .rich-editor-content [data-text-align="right"] {
          text-align: right;
        }
        .rich-editor-content [data-text-align="justify"] {
          text-align: justify;
        }
      `}</style>
    </>
  );
};

const ToolButton = ({
  onClick,
  active,
  disabled,
  icon: Icon,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon: typeof Bold;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded transition-colors cursor-pointer ${
      active
        ? "text-white"
        : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-200"
    }`}
    style={active ? { backgroundColor: "#C70A24" } : undefined}
  >
    <Icon size={16} />
  </button>
);

const Divider = () => <div className="w-px bg-gray-300 mx-1 my-0.5" />;

export default RichEditor;
