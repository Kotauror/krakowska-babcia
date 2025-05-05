"use client";

import { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPostModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef<{ textarea: HTMLTextAreaElement } | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      // Insert the image markdown at cursor position
      const editor = editorRef.current?.textarea;
      if (editor) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const markdown = `![${file.name}](${data.secure_url})`;
        const newContent =
          content.substring(0, start) + markdown + content.substring(end);
        setContent(newContent);

        // Set cursor position after the inserted markdown
        setTimeout(() => {
          editor.focus();
          editor.setSelectionRange(
            start + markdown.length,
            start + markdown.length
          );
        }, 0);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/posts", {
        title,
        content,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Content (Markdown)
              </label>
              <label className="relative cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={isUploading}
                />
                <PhotoIcon className="h-5 w-5 inline-block mr-1" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </label>
            </div>
            <div data-color-mode="light">
              <MDEditor
                ref={editorRef}
                value={content}
                onChange={(value) => setContent(value || "")}
                height={400}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
