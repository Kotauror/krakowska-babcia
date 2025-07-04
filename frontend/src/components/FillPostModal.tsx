"use client";

import { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { Post } from "@/types";

interface FillPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  postToEdit?: Post;
}

const ALLOWED_TAGS = [
  "w góry",
  "nad wodę",
  "regionalna kultura",
  "w niepogodę",
  "budżetowo",
  "z nocowankiem",
  "dzieciaczkowy raj",
];

export default function FillPostModal({
  isOpen,
  onClose,
  onSuccess,
  postToEdit,
}: FillPostModalProps) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef<{ textarea: HTMLTextAreaElement } | null>(null);
  const [longitude, setLongitude] = useState<number | "">("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagError, setTagError] = useState<string>("");

  // Reset form when modal opens/closes or postToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (postToEdit) {
        setTitle(postToEdit.title);
        setDestination(postToEdit.destination);
        setContent(postToEdit.content);
        setLongitude(postToEdit.longitude);
        setLatitude(postToEdit.latitude);
        setSelectedTags(
          postToEdit.tags ? postToEdit.tags.map((t) => t.name) : []
        );
      } else {
        setTitle("");
        setDestination("");
        setContent("");
        setLongitude("");
        setLatitude("");
        setSelectedTags([]);
      }
    }
  }, [isOpen, postToEdit]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Insert the image markdown at cursor position
      const editor = editorRef.current?.textarea;
      if (editor) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const markdown = `![${file.name}](${response.data.url})`;
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
    if (selectedTags.length === 0) {
      setTagError("Wybierz przynajmniej jeden tag.");
      return;
    } else {
      setTagError("");
    }
    setIsSubmitting(true);

    try {
      if (postToEdit) {
        await api.put(`/posts/${postToEdit.id}`, {
          title,
          destination,
          content,
          longitude,
          latitude,
          tags: selectedTags,
        });
      } else {
        await api.post("/posts", {
          title,
          destination,
          content,
          longitude,
          latitude,
          tags: selectedTags,
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {postToEdit ? "Edit Post" : "Add New Post"}
          </h2>
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
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700"
            >
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              required
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                value={latitude}
                onChange={(e) =>
                  setLatitude(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                value={longitude}
                onChange={(e) =>
                  setLongitude(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagi
            </label>
            <div className="flex flex-wrap gap-3">
              {ALLOWED_TAGS.map((tag) => (
                <label key={tag} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, tag]);
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      }
                    }}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
            {tagError && (
              <div className="text-red-500 text-sm mt-1">{tagError}</div>
            )}
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
              {isSubmitting
                ? postToEdit
                  ? "Saving..."
                  : "Creating..."
                : postToEdit
                ? "Save Changes"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
