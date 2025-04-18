import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setCaption("");
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setCaption(""); // Optionally clear the caption as well
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setCaption("");
    }
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/caption", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCaption(data.caption || "Error generating caption.");
    } catch {
      setCaption("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center p-4"  style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/007/188/992/non_2x/abstract-minimal-modern-geometric-shape-background-free-vector.jpg')` }}>
        <div className="w-full max-w-md bg-white bg-opacity-60 backdrop-blur-md text-gray-800 shadow-2xl rounded-3xl p-8 transition-all">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            🧠 Caption Generator
          </h1>

          {/* Drag and Drop */}
          <div
            className={`mb-4 p-6 border-2 border-dashed rounded-xl transition ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <p className="text-center text-sm opacity-80">
              Drag & drop an image here or
            </p>

            <div className="flex justify-center mt-4 space-x-4">
              {/* Choose File Button */}
              <label className="cursor-pointer inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Delete Button */}
              {image && (
                <button
                  onClick={handleDeleteImage}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="mb-4 flex justify-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-h-60 rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition duration-200 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Generating...
              </div>
            ) : (
              "Generate Caption"
            )}
          </button>

          {/* Caption Result */}
          {caption && (
            <div className="mt-6 p-4 bg-gray-100 rounded-xl border">
              <h3 className="font-semibold text-lg">📝 Caption:</h3>
              <p className="mt-1 italic text-gray-700">{caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
