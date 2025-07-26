import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Image, Send, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  // State now holds an array of image previews
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const { sendMessage, isMessagesSending } = useChatStore();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter for valid image files
    const imageFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`Skipped non-image file: ${file.name}`);
        return false;
      }
      return true;
    });

    if (imageFiles.length === 0) return;

    // Read all selected image files and convert them to base64
    const filePromises = imageFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    // Once all files are read, update the state with the new previews
    Promise.all(filePromises)
      .then((newPreviews) => {
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      })
      .catch((error) => {
        console.error("Error reading image files:", error);
        toast.error("There was an error processing the images.");
      });
  };

  // Removes a specific image from the preview list by its index
  const removeImage = (indexToRemove) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
    // Clear the file input value to allow re-selecting the same file if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && imagePreviews.length === 0) return;

    try {
      await sendMessage({
        text: text.trim(),
        images: imagePreviews, // Send the array of images
      });

      // Clear form and previews after sending
      setText("");
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 border-t border-base-300">
      {/* Image preview container is now horizontally scrollable */}
      {imagePreviews.length > 0 && (
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-base-300"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-error hover:text-error-content transition-colors"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isMessagesSending}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple // Allow multiple file selection
          />

          <button
            type="button"
            className="btn btn-circle btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isMessagesSending}
          >
            <Image size={20} />
          </button>
        </div>


        <button
          type="submit"
          // FIX: Added the DaisyUI 'loading' class conditionally
          className={`btn btn-primary btn-circle ${
            isMessagesSending ? "loading" : ""
          }`}
          disabled={
            isMessagesSending || (!text.trim() && imagePreviews.length === 0)
          }
        >
          {/* FIX: The Send icon is now the only child. DaisyUI handles the spinner. */}
          {!isMessagesSending && <Send size={22} />}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
